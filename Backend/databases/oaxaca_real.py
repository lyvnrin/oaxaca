from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os

app = FastAPI(title="Oaxaca API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = os.path.join(os.path.dirname(__file__), "oaxaca.db")

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

class MenuItemUpdate(BaseModel):
    available: bool | None = None
    price: float | None = None
    cogs: float | None = None


class OrderIn(BaseModel):
    cust_id: int
    table_id: int
    items: list[dict]  # [{ item_id, quantity, price }]


class OrderStatusUpdate(BaseModel):
    status: str

class LoginIn(BaseModel):
    username: str
    password: str
    role: str

class RestockIn(BaseModel):
    stock_id: int
    level: float

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

@app.post("/orders/{order_id}/pay", status_code=200)
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
    conn.commit()
    conn.close()
    return {"order_id": order_id, "status": "Paid"}


# MENU ITEMS --------------------------

@app.patch("/menu_items/{item_id}")
def update_menu_item(item_id: int, payload: MenuItemUpdate):
    conn = get_conn()
    if payload.available is not None:
        conn.execute(
            "UPDATE menu_items SET available = ? WHERE item_id = ?",
            (1 if payload.available else 0, item_id)
        )
    if payload.price is not None:
        conn.execute(
            "UPDATE menu_items SET price = ? WHERE item_id = ?",
            (payload.price, item_id)
        )
    conn.commit()
    conn.close()
    return {"item_id": item_id}


@app.get("/menu_items")
def get_menu_items():
    conn = get_conn()
    rows = conn.execute(
        "SELECT item_id, item_name, price, cogs, available FROM menu_items").fetchall()
    conn.close()
    return [dict(r) for r in rows]


# STAFF LOGIN --------------------------

@app.get("/staff")
def get_staff():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM staff").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/auth/login")
def login(payload: LoginIn):
    conn = get_conn()
    row = conn.execute(
        "SELECT * FROM staff WHERE name = ? AND password = ? AND role = ?",
        (payload.username, payload.password, payload.role)
    ).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "staff_id": row["staff_id"],
        "name": row["name"],
        "role": row["role"],
    }


# STOCK --------------------------
DISH_DEPLETIONS = {
    1:  [(1, 3), (2, 3), (3, 3)],
    2:  [(29, 3), (30, 3), (22, 3), (24, 3)],
    3:  [(18, 4), (5, 4), (10, 4), (11, 4)],
    4:  [(4, 3), (23, 3)],
    5:  [(20, 4), (35, 4), (32, 4)],
    6:  [(19, 4), (8, 4), (11, 4)],
    7:  [(7, 3), (30, 3), (36, 3), (38, 3)],
    8:  [(18, 5), (14, 5), (15, 5), (16, 5)],
    9:  [(26, 3), (27, 3), (37, 3)],
    10: [(26, 3), (46, 3)],
    11: [(6, 3), (2, 3)],
    12: [(30, 2), (34, 2)],
    13: [(29, 2)],
    14: [(3, 2), (43, 2)],
    15: [(31, 2), (44, 2), (11, 2), (14, 2)],
    16: [(12, 3), (2, 3), (52, 3)],
    17: [(47, 3), (48, 3), (2, 3), (49, 3)],
    18: [(31, 3), (39, 3), (45, 3)],
    19: [(50, 5)],
    20: [(51, 1)],
}


@app.get("/stock")
def get_stock():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM stock ORDER BY stock_id").fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.post("/stock/deplete")
def deplete_stock(payload: OrderIn):
    conn = get_conn()
    for item in payload.items:
        depletions = DISH_DEPLETIONS.get(item["item_id"], [])
        for stock_id, pct in depletions:
            amount = pct * item["quantity"]
            conn.execute(
                "UPDATE stock SET level = MAX(0, level - ?) WHERE stock_id = ?",
                (amount, stock_id)
            )
    conn.commit()
    conn.close()
    return {"message": "Stock depleted"}


@app.post("/stock/restock")
def restock(payload: RestockIn):
    conn = get_conn()
    conn.execute("UPDATE stock SET level = ? WHERE stock_id = ?",
                 (payload.level, payload.stock_id))
    conn.commit()
    conn.close()
    return {"message": "Restocked"}


# CLEANUP COMPLETED ORDERS --------------------------


@app.delete("/orders/{order_id}/cleanup")
def cleanup_single_order(order_id: int):
    conn = get_conn()
    conn.execute(
        "DELETE FROM order_item WHERE order_id = ?", (order_id,)
    )
    conn.execute(
        "DELETE FROM orders WHERE order_id = ? AND status IN ('Paid', 'Cancelled')",
        (order_id,)
    )
    conn.commit()
    conn.close()
    return {"message": "Order cleaned up"}
