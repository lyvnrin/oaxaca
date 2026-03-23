from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..database import get_conn

router = APIRouter(tags=["alerts"])


class AlertIn(BaseModel):
    table_id: int
    raised_by: int | None = None
    message: str


@router.post("/alerts", status_code=201)
def raise_alert(payload: AlertIn):
    conn = get_conn()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO alerts (table_id, raised_by, message) VALUES (?, ?, ?)",
            (payload.table_id, payload.raised_by, payload.message),
        )
        conn.commit()
        return {"alert_id": cursor.lastrowid, "table_id": payload.table_id, "message": payload.message}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()


@router.get("/alerts")
def get_alerts():
    conn = get_conn()
    rows = conn.execute("""
        SELECT a.alert_id, a.table_id, a.message, a.resolved, a.created_at,
               s.name AS raised_by_name
        FROM alerts a
        LEFT JOIN staff s ON a.raised_by = s.staff_id
        WHERE a.resolved = 0
        ORDER BY a.created_at DESC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.patch("/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT alert_id FROM alerts WHERE alert_id = ?", (alert_id,)
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    conn.execute(
        "UPDATE alerts SET resolved = 1 WHERE alert_id = ?", (alert_id,)
    )
    conn.commit()
    conn.close()
    return {"alert_id": alert_id, "resolved": True}