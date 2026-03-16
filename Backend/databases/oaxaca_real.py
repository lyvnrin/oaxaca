from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI(title="Oaxaca API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "oaxaca-real.db"

# DATABASE CONNECTION --------------------------


def get_conn():
    conn = sqlite3.connect(DB_FILE, timeout=10)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode=WAL")
    conn.row_factory = sqlite3.Row
    return conn

# SCHEMAS --------------------------


class CustomerIn(BaseModel):
    name: str
    table_id: int | None = None


class OrderIn(BaseModel):
    cust_id: int
    table_id: int
    items: list[dict]  # [{ item_id, quantity, price }]


class OrderStatusUpdate(BaseModel):
    status: str

# CUSTOMERS --------------------------


@app.get("/customers")
def get_customers():
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM customers ORDER BY created_at DESC").fetchall()
    conn.close()

    return [dict(r) for r in rows]


@app.post("/customers", status_code=201)
def add_customer(payload: CustomerIn):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO customers (name, table_id) VALUES (?, ?)",
            (payload.name, payload.table_id),
        )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM customers WHERE cust_id = ?", (cursor.lastrowid,)).fetchone()
        return dict(row)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@app.delete("/customers/{cust_id}")
def delete_customer(cust_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT table_id FROM customers WHERE cust_id = ?", (cust_id,)).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Customer not found")

    if row["table_id"]:
        conn.execute(
            "UPDATE tables SET occupied = 0 WHERE table_id = ?", (
                row["table_id"],)
        )

    conn.execute("DELETE FROM customers WHERE cust_id = ?", (cust_id,))
    conn.commit()
    conn.close()

    return {"deleted": cust_id}

# TABLES --------------------------


@app.get("/tables")
def get_tables():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM tables ORDER BY table_id").fetchall()
    conn.close()

    return [dict(r) for r in rows]

# ORDERS --------------------------


@app.post("/orders", status_code=201)
def place_order(payload: OrderIn):
    conn = get_conn()
    cursor = conn.cursor()

    total = sum(i["price"] * i["quantity"] for i in payload.items)

    cursor.execute(
        "INSERT INTO orders (cust_id, table_id, total_cost, status) VALUES (?, ?, ?, ?)",
        (payload.cust_id, payload.table_id, total, "Pending"),)
    order_id = cursor.lastrowid

    cursor.executemany(
        "INSERT INTO order_item (order_id, item_id, quantity) VALUES (?, ?, ?)",
        [(order_id, i["item_id"], i["quantity"]) for i in payload.items]
    )

    conn.commit()
    conn.close()
    return {"order_id": order_id, "total_cost": total}


@app.get("/orders")
def get_orders():
    conn = get_conn()
    orders = conn.execute("SELECT * FROM orders").fetchall()
    result = []
    for order in orders:
        items = conn.execute("""
            SELECT oi.quantity, mi.item_name, mi.price
            FROM order_item oi
            JOIN menu_items mi ON oi.item_id = mi.item_id
            WHERE oi.order_id = ?
        """, (order["order_id"],)).fetchall()
        result.append({**dict(order), "items": [dict(i) for i in items]})
    conn.close()
    return result


@app.patch("/orders/{order_id}")
def update_order_status(order_id: int, payload: OrderStatusUpdate):
    conn = get_conn()
    conn.execute(
        "UPDATE orders SET status = ? WHERE order_id = ?",
        (payload.status, order_id)
    )
    conn.commit()
    conn.close()
    return {"order_id": order_id, "status": payload.status}


@app.get("/orders/{order_id}")
def get_order(order_id: int):
    conn = get_conn()
    order = conn.execute(
        "SELECT * FROM orders WHERE order_id = ?", (order_id,)
    ).fetchone()
    conn.close()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return dict(order)


class MenuItemAvailability(BaseModel):
    available: bool


@app.patch("/menu_items/{item_id}")
def update_menu_item_availability(item_id: int, payload: MenuItemAvailability):
    conn = get_conn()
    conn.execute(
        "UPDATE menu_items SET available = ? WHERE item_id = ?",
        (1 if payload.available else 0, item_id)
    )
    conn.commit()
    conn.close()
    return {"item_id": item_id, "available": payload.available}


@app.get("/menu_items")
def get_menu_items():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM menu_items").fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.get("/staff")
def get_staff():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM staff").fetchall()
    conn.close()
    return [dict(r) for r in rows]

# CLEANUP COMPLETED ORDERS --------------------------


@app.delete("/orders/cleanup")
def cleanup_completed_orders():
    conn = get_conn()
    conn.execute(
        "DELETE FROM order_item WHERE order_id IN (SELECT order_id FROM orders WHERE status = 'Completed')"
    )
    conn.execute("DELETE FROM orders WHERE status = 'Completed'")
    conn.commit()
    conn.close()
    return {"message": "Completed orders cleared"}
