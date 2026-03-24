from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..database import get_conn

router = APIRouter(tags=["staff"])


class LoginIn(BaseModel):
    username: str
    password: str
    role: str


@router.get("/staff")
def get_staff():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM staff").fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.get("/staff/{staff_id}")
def get_staff_member(staff_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT * FROM staff WHERE staff_id = ?", (staff_id,)
    ).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return dict(row)


@router.get("/tables")
def get_tables():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM tables ORDER BY table_id").fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.get("/staff/{staff_id}/tables")
def get_assigned_tables(staff_id: int):
    conn = get_conn()
    rows = conn.execute(
        "SELECT table_id FROM tables WHERE assigned_waiter = ?", (staff_id,)
    ).fetchall()
    conn.close()
    return [r["table_id"] for r in rows]


@router.post("/auth/login")
def login(payload: LoginIn):
    conn = get_conn()
    row = conn.execute(
        "SELECT * FROM staff WHERE name = ? AND password = ? AND role = ?",
        (payload.username, payload.password, payload.role)
    ).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")
    conn.execute(
        "UPDATE staff SET on_shift = 1 WHERE staff_id = ?", (row["staff_id"],)
    )
    if row["role"] == "Waiter":
        unassigned = conn.execute("""
            SELECT table_id FROM tables 
            WHERE occupied = 1 AND assigned_waiter IS NULL
        """).fetchall()
        for table in unassigned:
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
                    (waiter["staff_id"], table["table_id"])
                )
    conn.commit()
    conn.close()
    return {"staff_id": row["staff_id"], "name": row["name"], "role": row["role"]}


@router.post("/auth/logout/{staff_id}")
def logout(staff_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT * FROM staff WHERE staff_id = ?", (staff_id,)
    ).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Staff not found")
    conn.execute(
        "UPDATE staff SET on_shift = 0 WHERE staff_id = ?", (staff_id,)
    )
    conn.commit()
    conn.close()
    return {"staff_id": staff_id, "on_shift": 0}
