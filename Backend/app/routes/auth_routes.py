from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter()

# 1. Define the data model for Login
class LoginRequest(BaseModel):
    username: str
    password: str

# 2. Temporary Database of Staff
fake_staff_db = [
    {"id": 1, "username": "waiter1", "password": "password123", "role": "Waiter"},
    {"id": 2, "username": "chef1", "password": "password123", "role": "Kitchen_Staff"},
    {"id": 3, "username": "manager", "password": "adminpassword", "role": "Manager"}
]

@router.post("/api/login")
async def login(credentials: LoginRequest):
    # Replicates logging in. Returns user info if successful.
    # Search for user in the fake list
    user = next((u for u in fake_staff_db if u["username"] == credentials.username), None)

    if not user or user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # Return the user info (except password)
    return {
        "staff_id": user["id"],
        "username": user["username"],
        "role": user["role"],
        "message": "Login successful"
    }