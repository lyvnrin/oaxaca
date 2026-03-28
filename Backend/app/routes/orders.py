from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from ..database import get_conn

router = APIRouter(tags=["orders"])


class OrderIn(BaseModel):
    cust_id: int
    table_id: int
    items: list[dict]


class OrderStatusUpdate(BaseModel):
    status: str
    waiter_id: int | None = None


@router.post("/orders", status_code=201)
def place_order(payload: OrderIn):
    conn = get_conn()
    try:
        cursor = conn.cursor()
        for i in payload.items:
            existing_qty = conn.execute("""
                SELECT COALESCE(SUM(oi.quantity), 0)
                FROM order_item oi
                JOIN orders o ON oi.order_id = o.order_id
                WHERE o.table_id = ? AND oi.item_id = ?
                AND o.status NOT IN ('Cancelled', 'Paid')
            """, (payload.table_id, i["item_id"])).fetchone()[0]
            if existing_qty + i["quantity"] > 25:
                raise HTTPException(
                    status_code=400,
                    detail="Item limit exceeded: cannot order more than 25 of the same item per table"
                )
        total = sum(i["price"] * i["quantity"] for i in payload.items)
        cursor.execute(
            "INSERT INTO orders (cust_id, table_id, total_cost, status) VALUES (?, ?, ?, ?)",
            (payload.cust_id, payload.table_id, total, "Pending"),
        )
        order_id = cursor.lastrowid
        cursor.executemany(
            "INSERT INTO order_item (order_id, item_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
            [(order_id, i["item_id"], i["quantity"], i.get("price")) for i in payload.items]
        )
        conn.commit()
        return {"order_id": order_id, "total_cost": total}
    finally:
        conn.close()


@router.get("/orders")
def get_orders(waiter_id: int | None = Query(default=None), table_id: int | None = Query(default=None)):
    conn = get_conn()
    try:
        if waiter_id is not None:
            orders = conn.execute("""
                SELECT o.* FROM orders o
                JOIN tables t ON o.table_id = t.table_id
                WHERE t.assigned_waiter = ?
            """, (waiter_id,)).fetchall()
        elif table_id is not None:
            orders = conn.execute(
                "SELECT * FROM orders WHERE table_id = ?", (table_id,)
            ).fetchall()
        else:
            orders = conn.execute("SELECT * FROM orders").fetchall()
        result = []
        for order in orders:
            items = conn.execute("""
                SELECT oi.item_id, oi.quantity, mi.item_name,
                       COALESCE(oi.unit_price, mi.price) as price,
                       mi.prep_time_mins
                FROM order_item oi
                JOIN menu_items mi ON oi.item_id = mi.item_id
                WHERE oi.order_id = ?
            """, (order["order_id"],)).fetchall()
            est_mins = max((i["prep_time_mins"] for i in items), default=15)
            result.append(
                {**dict(order), "items": [dict(i) for i in items], "est_mins": est_mins})
        return result
    finally:
        conn.close()


@router.get("/orders/{order_id}")
def get_order(order_id: int):
    conn = get_conn()
    try:
        order = conn.execute(
            "SELECT * FROM orders WHERE order_id = ?", (order_id,)
        ).fetchone()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return dict(order)
    finally:
        conn.close()


@router.patch("/orders/{order_id}")
def update_order_status(order_id: int, payload: OrderStatusUpdate):
    conn = get_conn()
    try:
        if payload.waiter_id and payload.status == "Completed":
            conn.execute(
                "UPDATE orders SET status = ?, waiter_id = ? WHERE order_id = ?",
                (payload.status, payload.waiter_id, order_id)
            )
        else:
            conn.execute(
                "UPDATE orders SET status = ? WHERE order_id = ?",
                (payload.status, order_id)
            )
        conn.commit()
        return {"order_id": order_id, "status": payload.status}
    finally:
        conn.close()


@router.post("/orders/{order_id}/pay", status_code=200)
def pay_order(order_id: int):
    conn = get_conn()
    try:
        row = conn.execute(
            "SELECT * FROM orders WHERE order_id = ?", (order_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Order not found")
        if row["status"] == "Paid":
            raise HTTPException(status_code=400, detail="Order already paid")
        conn.execute(
            "UPDATE orders SET status = 'Paid' WHERE order_id = ?", (order_id,)
        )
        if row["waiter_id"]:
            conn.execute(
                "UPDATE staff SET orders_handled = orders_handled + 1, total_sales = total_sales + ? WHERE staff_id = ?",
                (row["total_cost"], row["waiter_id"])
            )
        conn.commit()
        return {"order_id": order_id, "status": "Paid"}
    finally:
        conn.close()


class OrderItemAdd(BaseModel):
    item_id: int
    quantity: int
    price: float
    name: str


@router.post("/orders/{order_id}/items", status_code=201)
def add_item_to_order(order_id: int, payload: OrderItemAdd):
    conn = get_conn()
    try:
        row = conn.execute(
            "SELECT * FROM orders WHERE order_id = ?", (order_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Order not found")
        existing_qty = conn.execute("""
            SELECT COALESCE(SUM(oi.quantity), 0)
            FROM order_item oi
            JOIN orders o ON oi.order_id = o.order_id
            WHERE o.table_id = ? AND oi.item_id = ?
            AND o.status NOT IN ('Cancelled', 'Paid')
        """, (row["table_id"], payload.item_id)).fetchone()[0]
        if existing_qty + payload.quantity > 25:
            raise HTTPException(
                status_code=400,
                detail="Item limit exceeded: cannot order more than 25 of the same item per table"
            )
        existing = conn.execute(
            "SELECT order_item_id, quantity FROM order_item WHERE order_id = ? AND item_id = ?",
            (order_id, payload.item_id)
        ).fetchone()
        if existing:
            conn.execute(
                "UPDATE order_item SET quantity = quantity + ? WHERE order_item_id = ?",
                (payload.quantity, existing["order_item_id"])
            )
        else:
            conn.execute(
                "INSERT INTO order_item (order_id, item_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
                (order_id, payload.item_id, payload.quantity, payload.price)
            )
        new_total = conn.execute("""
            SELECT SUM(oi.quantity * COALESCE(oi.unit_price, mi.price))
            FROM order_item oi
            JOIN menu_items mi ON oi.item_id = mi.item_id
            WHERE oi.order_id = ?
        """, (order_id,)).fetchone()[0] or 0
        conn.execute(
            "UPDATE orders SET total_cost = ? WHERE order_id = ?", (new_total, order_id))
        conn.commit()
        return {"order_id": order_id, "total_cost": new_total}
    finally:
        conn.close()


@router.delete("/orders/{order_id}/items/{item_index}", status_code=200)
def remove_item_from_order(order_id: int, item_index: int):
    conn = get_conn()
    try:
        items = conn.execute(
            "SELECT order_item_id FROM order_item WHERE order_id = ? ORDER BY order_item_id",
            (order_id,)
        ).fetchall()
        if item_index >= len(items):
            raise HTTPException(status_code=404, detail="Item not found")
        conn.execute(
            "DELETE FROM order_item WHERE order_item_id = ?",
            (items[item_index]["order_item_id"],)
        )
        new_total = conn.execute("""
            SELECT SUM(oi.quantity * COALESCE(oi.unit_price, mi.price))
            FROM order_item oi
            JOIN menu_items mi ON oi.item_id = mi.item_id
            WHERE oi.order_id = ?
        """, (order_id,)).fetchone()[0] or 0
        conn.execute(
            "UPDATE orders SET total_cost = ? WHERE order_id = ?", (new_total, order_id))
        conn.commit()
        return {"order_id": order_id, "total_cost": new_total}
    finally:
        conn.close()


@router.delete("/orders/{order_id}/cleanup")
def cleanup_single_order(order_id: int):
    conn = get_conn()
    try:
        conn.execute("DELETE FROM order_item WHERE order_id = ?", (order_id,))
        conn.execute(
            "DELETE FROM orders WHERE order_id = ? AND status IN ('Paid', 'Cancelled')",
            (order_id,)
        )
        conn.commit()
        return {"message": "Order cleaned up"}
    finally:
        conn.close()