from fastapi import APIRouter
from app.services.menu_service import get_filtered_menu

router = APIRouter()

@router.get("/api/menu/{category}")
def api_menu(category: str, role: str = None, vegetarian: bool = None, gluten_free: bool = None):
    return get_filtered_menu(category=category, vegetarian=vegetarian, gluten_free=gluten_free)

@router.get("/health")
def health():
    return {
        "status": "ok",
        "service": "restaurant-backend"
    }
