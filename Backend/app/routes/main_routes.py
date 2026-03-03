from fastapi import APIRouter
from app.services.menu_service import get_filtered_menu

<<<<<<< HEAD
'''
Defines the FastAPI routes for the restaurant backend. Includes:

- /api/menu
  - GET endpoint that returns filtered menu items
  - Accepts optional query parameters:
    - vegetarian (bool): filter vegetarian items if True
    - gluten_free (bool): filter gluten-free items if True
  - Calls get_filtered_menu from menu_service to retrieve data for the frontend
  - You can add more query parameters or filters here as needed

- /health
  - Simple health check endpoint
  - Returns a JSON confirming the service is running

- You can:
  - Add new API endpoints here for additional features (e.g., orders, staff management)
  - Ensure each route calls your Python service functions for data
  - The frontend HTML page can query /api/menu to test filtering functionality
'''

router = APIRouter()

@router.get("/api/menu")
def api_menu(vegetarian: bool = None, gluten_free: bool = None):
    return get_filtered_menu(vegetarian, gluten_free)
=======
router = APIRouter()

@router.get("/api/menu/{category}")
def api_menu(category: str, role: str = None, vegetarian: bool = None, gluten_free: bool = None):
    return get_filtered_menu(category=category, vegetarian=vegetarian, gluten_free=gluten_free)
>>>>>>> main

@router.get("/health")
def health():
    return {
<<<<<<< HEAD
        "status" : "ok",
        "service" : "restaurant-backend"
    }

=======
        "status": "ok",
        "service": "restaurant-Backend"
    }
>>>>>>> main
