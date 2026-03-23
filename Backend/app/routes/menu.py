from fastapi import APIRouter
from pydantic import BaseModel
from ..database import get_conn

router = APIRouter(tags=["menu"])


class MenuItemUpdate(BaseModel):
    available: bool | None = None
    price: float | None = None
    cogs: float | None = None


@router.get("/menu_items")
def get_menu_items():
    conn = get_conn()
    rows = conn.execute(
        "SELECT item_id, item_name, price, cogs, available FROM menu_items"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.patch("/menu_items/{item_id}")
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
    if payload.cogs is not None:
        conn.execute(
            "UPDATE menu_items SET cogs = ? WHERE item_id = ?",
            (payload.cogs, item_id)
        )
    conn.commit()
    conn.close()
    return {"item_id": item_id}