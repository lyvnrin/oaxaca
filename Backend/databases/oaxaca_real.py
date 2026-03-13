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

def get_conn():
    conn = sqlite3.connect(DB_FILE)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.row_factory = sqlite3.Row
    return conn

# SCHEMAS
class CustomerIn(BaseModel):
    name: str
    table_id: int | None = None

# FETCHING ALL CUSTOMERS
@app.get("/customers")
def get_customers():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM customers ORDER BY created_at DESC").fetchall()
    conn.close()

    return [dict(r) for r in rows]


# ADDING A CUSTOMER: POST
@app.post("/customers", status_code=201)
def add_customer(payload: CustomerIn):
    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO customers (name, table_id) VALUES (?, ?)",
        (payload.name, payload.table_id),
    )

    conn.commit()
    row = conn.execute( "SELECT * FROM customers WHERE cust_id = ?", (cursor.lastrowid,) ).fetchone()
    
    conn.close()
    return dict(row)

# DELETING A CUSTOMERS
@app.delete("/customers/{cust_id}")
def delete_customer(cust_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT table_id FROM customers WHERE cust_id = ?", (cust_id,) ).fetchone()
    
    if not row:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    if row["table_id"]:
        conn.execute(
            "UPDATE tables SET occupied = 0 WHERE table_id = ?", (row["table_id"],)
        )
    
    conn.execute("DELETE FROM customers WHERE cust_id = ?", (cust_id,))
    conn.commit()
    conn.close()
    
    return {"deleted": cust_id}

# FETCHING ALL TABLES
@app.get("/tables")
def get_tables():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM tables ORDER BY table_id").fetchall()
    conn.close()

    return [dict(r) for r in rows]

# ADDING /ORDERS POST AND GET SCHEMA
class OrderIn(BaseModel):
    cust_id: int
    table_id: int
    items: list[dict]  # [{ item_id, quantity, price }]

@app.post("/orders", status_code=201)
def place_order(payload: OrderIn):
    conn = get_conn()
    cursor = conn.cursor()

    total = sum(i["price"] * i["quantity"] for i in payload.items)

    cursor.execute(
        "INSERT INTO orders (cust_id, table_id, total_cost) VALUES (?, ?, ?)",
        (payload.cust_id, payload.table_id, total),
    )
    order_id = cursor.lastrowid

    cursor.executemany(
        "INSERT INTO order_item (order_id, item_id, quantity) VALUES (?, ?, ?)",
        [(order_id, i["item_id"], i["quantity"]) for i in payload.items]
    )

    conn.commit()
    conn.close()
    return { "order_id": order_id, "total_cost": total }

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
        result.append({ **dict(order), "items": [dict(i) for i in items] })
    conn.close()
    return result