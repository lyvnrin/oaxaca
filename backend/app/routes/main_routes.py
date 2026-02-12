from fastapi import APIRouter
from app.services.menu_service import get_filtered_menu

router = APIRouter()

@router.get("/api/menu")
def api_menu(vegetarian: bool = None, gluten_free: bool = None):
    return get_filtered_menu(vegetarian, gluten_free)

@router.get("/health")
def health():
    return {
        "status" : "ok",
        "service" : "restaurant-backend"
    }

