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