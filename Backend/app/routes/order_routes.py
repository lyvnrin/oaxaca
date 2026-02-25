from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List
from ..orders import order_manager

# Create the router.
router = APIRouter()

# Define the data model for validation.
class OrderCreate(BaseModel):
    customer_id: int
    table_number: int
    items: List[int]

# Route to Place an Order
@router.post("/api/orders", status_code=status.HTTP_201_CREATED)
async def place_order(order_data: OrderCreate):
    # FastAPI validates that customer_id, table_number, and items exist.
    # If they are missing, it sends a 422 entity error.

    try:
        # Create the order
        new_order = order_manager.place_order(
            customer_id=order_data.customer_id,
            table_number=order_data.table_number,
            item_ids=order_data.items
        )
        
        # Return the dictionary directly which is converted to JSON automatically.
        return new_order.to_dict()

    except Exception as e:
        # Return a 500 error if something goes wrong within the code.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )