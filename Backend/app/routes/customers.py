from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..database import get_conn

router = APIRouter(tags=["customers"])


class CustomerIn(BaseModel):
    name: str  # This will be "Table 1", "Table 2", etc.
    table_id: int


@router.post("/customers", status_code=201)
def add_customer(payload: CustomerIn):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        # Check if table exists
        table = conn.execute(
            "SELECT * FROM tables WHERE table_id = ?", (payload.table_id,)
        ).fetchone()
        if not table:
            raise HTTPException(status_code=404, detail="Table not found")
        
        # Check if customer already exists for this table (optional)
        existing = conn.execute(
            "SELECT * FROM customers WHERE table_id = ? AND name = ?",
            (payload.table_id, payload.name)
        ).fetchone()
        
        if existing:
            # Return existing customer if they're already seated
            return dict(existing)
        
        # Create new customer
        cursor.execute(
            "INSERT INTO customers (name, table_id) VALUES (?, ?)",
            (payload.name, payload.table_id),
        )
        cust_id = cursor.lastrowid
        
        # Update table to occupied
        conn.execute(
            "UPDATE tables SET occupied = 1 WHERE table_id = ?",
            (payload.table_id,)
        )
        
        # Assign a waiter if available
        waiter = conn.execute("""
            SELECT s.staff_id, COUNT(t.table_id) as active_tables
            FROM staff s
            LEFT JOIN tables t ON s.staff_id = t.assigned_waiter AND t.occupied = 1
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
        
        # Return the created customer
        row = conn.execute(
            "SELECT * FROM customers WHERE cust_id = ?", (cust_id,)
        ).fetchone()
        return dict(row)
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get("/customers")
def get_customers(table_id: int | None = None):
    conn = get_conn()
    if table_id:
        rows = conn.execute(
            "SELECT * FROM customers WHERE table_id = ? ORDER BY created_at DESC",
            (table_id,)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM customers ORDER BY created_at DESC"
        ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


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


@router.get("/customers/table/{table_id}")
def get_customer_by_table(table_id: int):
    """Get active customer for a specific table"""
    conn = get_conn()
    row = conn.execute(
        "SELECT * FROM customers WHERE table_id = ? ORDER BY created_at DESC LIMIT 1",
        (table_id,)
    ).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="No active customer for this table")
    return dict(row)


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