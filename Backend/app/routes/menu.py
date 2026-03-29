from fastapi import APIRouter
from pydantic import BaseModel
from ..database import get_conn

router = APIRouter(tags=["menu"])


class MenuItemUpdate(BaseModel):
    """Request model for updating menu item fields.
    
    All fields are optional to allow partial updates.
    
    Attributes:
        available: New availability status (True/False)
        price: New price in GBP
        cogs: New cost of goods sold in GBP
    """
    available: bool | None = None
    price: float | None = None
    cogs: float | None = None


@router.get("/menu_items")
def get_menu_items():
    """Retrieve all menu items from the database.
    
    Returns:
        List of menu item objects with all fields from menu_items table,
        ordered by item_id ascending.
    
    Example:
        Response: [{"item_id": 1, "name": "Tacos", "price": 12.99, ...}]
    """
    conn = get_conn()
    rows = conn.execute("SELECT * FROM menu_items ORDER BY item_id").fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.patch("/menu_items/{item_id}")
def update_menu_item(item_id: int, payload: MenuItemUpdate):
    """Partially update a menu item's properties.
    
    Updates only the fields provided in the request body. Supports updating
    availability status, price, and cost of goods sold independently.
    
    Args:
        item_id: ID of the menu item to update
        payload: MenuItemUpdate object containing fields to update
    
    Returns:
        Dict with the updated item_id
    
    Example:
        PATCH /menu_items/5
        Body: {"available": false, "price": 14.99}
        Response: {"item_id": 5}
    """
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