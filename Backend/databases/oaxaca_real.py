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


# ── Schemas ────────────────────────────────────────────────────────
class CustomerIn(BaseModel):
    name: str
    table_id: int | None = None


# ── GET all customers ──────────────────────────────────────────────
@app.get("/customers")
def get_customers():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM customers ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── POST add a customer ────────────────────────────────────────────
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


# ── DELETE a customer ──────────────────────────────────────────────
@app.delete("/customers/{cust_id}")
def delete_customer(cust_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT table_id FROM customers WHERE cust_id = ?", (cust_id,)
    ).fetchone()
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


# ── GET all tables ─────────────────────────────────────────────────
@app.get("/tables")
def get_tables():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM tables ORDER BY table_id").fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── Run with: uvicorn backend:app --reload --port 5000 ─────────────