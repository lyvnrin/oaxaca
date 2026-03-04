from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List
from ..orders import order_manager

# Create the router.
router = APIRouter()

# Define the model for validation.
class OrderCreate(BaseModel):
    customer_id: int
    table_number: int
    items: List[int]

# Define model for Status Update
class OrderStatusUpdate(BaseModel):
    status: str

# Route to Place an Order
@router.post("/api/orders", status_code=status.HTTP_201_CREATED)
async def place_order(order_data: OrderCreate):
    # FastAPI validates that customer_id, table_number, and items exist.

    try:
        # Create the order
        new_order = order_manager.place_order(
            customer_id=order_data.customer_id,
            table_number=order_data.table_number,
            item_ids=order_data.items
        )        
        return new_order.to_dict()

    except Exception as e:
        # Return a 500 error if something goes wrong within the code.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )

@router.get("/api/orders")
async def get_all_orders():
    # View all orders for tracking and confirming.
    orders = order_manager.get_all_orders()
    return [order.to_dict() for order in orders]

@router.patch("/api/orders/{order_id}/status")
async def update_order_status(order_id: int, status_update: OrderStatusUpdate):
    # Change status of order.
    valid_statuses = ["pending", "in_progress", "ready", "delivered", "completed", "cancelled"]
    
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    updated_order = order_manager.update_order_status(order_id, status_update.status)
    
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    return updated_order.to_dict()