from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from database import get_all_users, users_collection
from bson import ObjectId

admin_router = APIRouter()

ADMIN_EMAIL = "adminsai123@gmail.com"
ADMIN_PASSWORD = "Sai@Admin"

@admin_router.post("/admin/login")
async def admin_login(data: dict):
    email = data.get("email")
    password = data.get("password")

    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        return {"message": "Admin login successful"}

    raise HTTPException(status_code=401, detail="Invalid admin credentials")

@admin_router.get("/admin/users")
async def get_users():
    users = get_all_users()
    return JSONResponse({"users": users})

@admin_router.delete("/admin/delete_user/{user_id}")
async def delete_user(user_id: str):
    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 1:
        return {"message": "User deleted successfully"}
    raise HTTPException(status_code=404, detail="User not found")
