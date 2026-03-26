from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..database import get_conn

router = APIRouter(tags=["customers"])


class CustomerIn(BaseModel):
    name: str
    table_id: int | None = None


@router.get("/customers")
def get_customers():
    conn = get_conn()
    rows = conn.execute(
        "SELECT * FROM customers ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.post("/customers", status_code=201)
def add_customer(payload: CustomerIn):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO customers (name, table_id) VALUES (?, ?)",
            (payload.name, payload.table_id),
        )
        if payload.table_id:
            conn.execute(
                "UPDATE tables SET occupied = 1 WHERE table_id = ?",
                (payload.table_id,)
            )
            waiter = conn.execute("""
                SELECT s.staff_id, COUNT(t.table_id) as active_tables
                FROM staff s
                LEFT JOIN tables t ON s.staff_id = t.assigned_waiter
                WHERE s.role = 'Waiter' AND s.on_shift = 1
                GROUP BY s.staff_id
                ORDER BY active_tables ASC, RANDOM()
                LIMIT 1
            """).fetchone()
            if waiter:
                conn.execute(
                    "UPDATE tables SET assigned_waiter = ? WHERE table_id = ?",
                    (waiter["staff_id"], payload.table_id)
                )
        conn.commit()
        row = conn.execute(
            "SELECT * FROM customers WHERE cust_id = ?", (cursor.lastrowid,)
        ).fetchone()
        return dict(row)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get("/tables/{table_id}/waiter")
def get_table_waiter(table_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT assigned_waiter FROM tables WHERE table_id = ?", (table_id,)
    ).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Table not found")
    return {"table_id": table_id, "assigned_waiter": row["assigned_waiter"]}


@router.delete("/customers/{cust_id}")
def delete_customer(cust_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT table_id FROM customers WHERE cust_id = ?", (cust_id,)
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Customer not found")
    if row["table_id"]:
        conn.execute(
            "UPDATE tables SET occupied = 0, assigned_waiter = NULL WHERE table_id = ?",
            (row["table_id"],)
        )
    conn.execute("DELETE FROM customers WHERE cust_id = ?", (cust_id,))
    conn.commit()
    conn.close()
    return {"deleted": cust_id}
