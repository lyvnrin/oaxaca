from fastapi import APIRouter, status

router = APIRouter()

active_alerts = []

@router.post("/api/tables/{table_id}/assist", status_code=status.HTTP_200_OK)
async def call_waiter(table_id: int):

    """
    Endpoint for a customer to call a waiter to their table.
    """
    # Check if an alert already exists for this table
    for alert in active_alerts:
        if alert["table"] == table_id and alert["type"] == "Help_Needed":
            return {
                "message": f"Help has already been requested for table {table_id}.",
                "alert": alert
            }
    
    # Create a new alert based on the AlertType structure in restaurant.py
    new_alert = {
        "table": table_id,
        "type": "Help_Needed",
        "status": "pending" # pending until a waiter settles it
    }
    
    active_alerts.append(new_alert)
    
    return {
        "message": f"Waiter called to table {table_id} successfully.",
        "alert": new_alert
    }

@router.get("/api/alerts")
async def get_active_alerts():
    """
    Endpoint for waiters to view all active table alerts.
    """
    return active_alerts

@router.delete("/api/tables/{table_id}/assist", status_code=status.HTTP_200_OK)
async def resolve_assistance(table_id: int):
    """
    Endpoint for a waiter to clear the help request once settled.
    """
    global active_alerts
    active_alerts = [alert for alert in active_alerts if alert["table"] != table_id]
    
    return {"message": f"Assistance request for table {table_id} resolved."}