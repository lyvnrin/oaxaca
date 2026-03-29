from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..database import get_conn

router = APIRouter(tags=["customers"])

class CustomerIn(BaseModel):
    """Request model for creating a new customer session.
    
    Attributes:
        name: Customer identifier (format: "Table X")
        table_id: Table number the customer is seated at
    """
    name: str
    table_id: int


@router.post("/customers", status_code=201)
def add_customer(payload: CustomerIn):
    """Create a new customer session or return existing one.
    
    Validates table exists, creates customer record, marks table as occupied,
    and automatically assigns the table to the least busy available waiter.
    
    Args:
        payload: Customer name and table ID
    
    Returns:
        Customer record with cust_id, name, table_id, and created_at
    
    Raises:
        HTTPException 404: If table not found
        HTTPException 500: On database error
    """
    conn = get_conn()
    cursor = conn.cursor()
    try:
        table = conn.execute(
            "SELECT * FROM tables WHERE table_id = ?", (payload.table_id,)
        ).fetchone()
        if not table:
            raise HTTPException(status_code=404, detail="Table not found")
        
        existing = conn.execute(
            "SELECT * FROM customers WHERE table_id = ? AND name = ?",
            (payload.table_id, payload.name)
        ).fetchone()
        
        if existing:
            return dict(existing)
        
        cursor.execute(
            "INSERT INTO customers (name, table_id) VALUES (?, ?)",
            (payload.name, payload.table_id),
        )
        cust_id = cursor.lastrowid
        
        conn.execute(
            "UPDATE tables SET occupied = 1 WHERE table_id = ?",
            (payload.table_id,)
        )
        
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
    """Retrieve customers with optional table filtering.
    
    Args:
        table_id: Optional - filter customers by table number
    
    Returns:
        List of customer records ordered by creation date (newest first)
    """
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
    """Get the waiter assigned to a specific table.
    
    Args:
        table_id: Table number to query
    
    Returns:
        Dict with table_id and assigned_waiter ID (or null if unassigned)
    
    Raises:
        HTTPException 404: If table not found
    """
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
    """Get active customer for a specific table.
    
    Args:
        table_id: Table number to find active customer for
    
    Returns:
        Most recent customer record for the table
    
    Raises:
        HTTPException 404: If no active customer found for the table
    """
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
    """Delete a customer session and free up their table.
    
    Marks table as unoccupied and removes waiter assignment.
    
    Args:
        cust_id: Customer ID to delete
    
    Returns:
        Dict with deleted customer ID
    
    Raises:
        HTTPException 404: If customer not found
    """
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