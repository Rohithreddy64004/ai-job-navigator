from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from datetime import datetime
from bson import ObjectId
from database import users_collection
from routes.email_utils import send_email
from pydantic import BaseModel
import secrets
import os
import requests  # ✅ To verify Google tokens

# ---------------- CONFIG ----------------
auth_router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://ai-job-navigator-1fed0.web.app")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")  # from Firebase project settings

reset_tokens = {}  # in-memory token store (use Redis for production)


# ---------------- MODELS ----------------
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class GoogleAuthRequest(BaseModel):
    token: str  # Firebase ID token


# ---------------- SIGNUP ----------------
@auth_router.post("/signup")
async def signup(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        raise HTTPException(status_code=400, detail="All fields are required.")

    if users_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="User already exists.")

    hashed_password = pwd_context.hash(password)
    user_data = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "auth_type": "manual",
        "signup_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    users_collection.insert_one(user_data)

    # Send welcome email in background
    subject = "🎉 Welcome to AI Job Navigator!"
    body = f"""
    <h2>Hi {name},</h2>
    <p>Welcome to <b>AI Job Navigator</b> — your personalized career assistant.</p>
    <p>Here’s what you can do:</p>
    <ul>
      <li>🧠 Learn with our AI Tutor</li>
      <li>📄 Optimize your resume</li>
      <li>💼 Explore jobs tailored to your skills</li>
    </ul>
    <p>We’re thrilled to have you join us!</p>
    <br>
    <p>Best regards,<br><b>The AI Job Navigator Team</b></p>
    """
    background_tasks.add_task(send_email, email, subject, body)

    return JSONResponse({"message": "✅ Signup successful! Please login now."})


# ---------------- LOGIN ----------------
@auth_router.post("/login")
async def login(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        raise HTTPException(status_code=400, detail="Email and password required.")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    return JSONResponse({
        "message": "✅ Login successful!",
        "user": {"name": user["name"], "email": user["email"]},
    })


# ---------------- GOOGLE SIGN-IN ----------------
@auth_router.post("/google-auth")
async def google_auth(request: GoogleAuthRequest, background_tasks: BackgroundTasks):
    try:
        id_token = request.token

        # Verify Google token using Firebase endpoint
        verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
        response = requests.get(verify_url)
        data = response.json()

        if "error" in data or data.get("aud") != GOOGLE_CLIENT_ID:
            raise HTTPException(status_code=401, detail="Invalid Google token.")

        email = data["email"]
        name = data.get("name", "User")

        # Check if user already exists
        user = users_collection.find_one({"email": email})
        if not user:
            users_collection.insert_one({
                "name": name,
                "email": email,
                "auth_type": "google",
                "signup_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })
            # Send welcome email
            subject = "🎉 Welcome via Google Sign-In!"
            body = f"<h2>Hi {name},</h2><p>Welcome to AI Job Navigator! Thanks for signing in with Google.</p>"
            background_tasks.add_task(send_email, email, subject, body)

        return {"message": "✅ Google authentication successful!", "user": {"name": name, "email": email}}

    except Exception as e:
        print("⚠️ Google Auth Error:", e)
        raise HTTPException(status_code=400, detail="Google authentication failed.")


# ---------------- ADMIN: VIEW USERS ----------------
@auth_router.get("/users")
async def list_users():
    users = [
        {
            "id": str(u["_id"]),
            "name": u["name"],
            "email": u["email"],
            "auth_type": u.get("auth_type", "manual"),
            "signup_date": u.get("signup_date", "")
        }
        for u in users_collection.find()
    ]
    return {"users": users}


# ---------------- FORGOT PASSWORD ----------------
@auth_router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, background_tasks: BackgroundTasks):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    token = secrets.token_urlsafe(32)
    reset_tokens[data.email] = token
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    subject = "🔑 Reset Your AI Job Navigator Password"
    body = f"""
    <h3>Hi {user['name']},</h3>
    <p>Click below to reset your password:</p>
    <a href="{reset_link}" target="_blank" style="color:#4f46e5;font-weight:bold;">Reset Password</a>
    <p>If you didn't request this, ignore this email.</p>
    """
    background_tasks.add_task(send_email, data.email, subject, body)
    return {"message": "✅ Password reset link sent successfully!"}


# ---------------- RESET PASSWORD ----------------
@auth_router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    email = next((e for e, t in reset_tokens.items() if t == data.token), None)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token.")

    hashed_password = pwd_context.hash(data.new_password)
    result = users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Password update failed.")

    del reset_tokens[email]
    return {"message": "✅ Password reset successful!"}
