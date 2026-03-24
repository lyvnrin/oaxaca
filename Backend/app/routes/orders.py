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
    cursor = conn.cursor()
    total = sum(i["price"] * i["quantity"] for i in payload.items)
    cursor.execute(
        "INSERT INTO orders (cust_id, table_id, total_cost, status) VALUES (?, ?, ?, ?)",
        (payload.cust_id, payload.table_id, total, "Pending"),
    )
    order_id = cursor.lastrowid
    cursor.executemany(
        "INSERT INTO order_item (order_id, item_id, quantity) VALUES (?, ?, ?)",
        [(order_id, i["item_id"], i["quantity"]) for i in payload.items]
    )
    conn.commit()
    conn.close()
    return {"order_id": order_id, "total_cost": total}


@router.get("/orders")
def get_orders(waiter_id: int | None = Query(default=None)):
    conn = get_conn()
    if waiter_id is not None:
        orders = conn.execute("""
            SELECT o.* FROM orders o
            JOIN tables t ON o.table_id = t.table_id
            WHERE t.assigned_waiter = ?
        """, (waiter_id,)).fetchall()
    else:
        orders = conn.execute("SELECT * FROM orders").fetchall()
    result = []
    for order in orders:
        items = conn.execute("""
            SELECT oi.quantity, mi.item_name, mi.price, mi.prep_time_mins
            FROM order_item oi
            JOIN menu_items mi ON oi.item_id = mi.item_id
            WHERE oi.order_id = ?
        """, (order["order_id"],)).fetchall()
        est_mins = max((i["prep_time_mins"] for i in items), default=15)
        result.append(
            {**dict(order), "items": [dict(i) for i in items], "est_mins": est_mins})
    conn.close()
    return result


@router.get("/orders/{order_id}")
def get_order(order_id: int):
    conn = get_conn()
    order = conn.execute(
        "SELECT * FROM orders WHERE order_id = ?", (order_id,)
    ).fetchone()
    conn.close()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return dict(order)


@router.patch("/orders/{order_id}")
def update_order_status(order_id: int, payload: OrderStatusUpdate):
    conn = get_conn()
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
    conn.close()
    return {"order_id": order_id, "status": payload.status}


@router.post("/orders/{order_id}/pay", status_code=200)
def pay_order(order_id: int):
    conn = get_conn()
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
    conn.close()
    return {"order_id": order_id, "status": "Paid"}


@router.delete("/orders/{order_id}/cleanup")
def cleanup_single_order(order_id: int):
    conn = get_conn()
    conn.execute("DELETE FROM order_item WHERE order_id = ?", (order_id,))
    conn.execute(
        "DELETE FROM orders WHERE order_id = ? AND status IN ('Paid', 'Cancelled')",
        (order_id,)
    )
    conn.commit()
    conn.close()
    return {"message": "Order cleaned up"}
