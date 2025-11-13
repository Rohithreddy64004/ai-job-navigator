from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from datetime import datetime, timedelta
from bson import ObjectId
from pydantic import BaseModel, EmailStr
from database import users_collection
from routes.email_utils import send_email
import secrets
import os
import requests
from dotenv import load_dotenv
from typing import Dict
import json

# ✅ Firebase imports
import firebase_admin
from firebase_admin import auth, credentials

# ---------------- CONFIG ----------------
load_dotenv()
auth_router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://ai-job-navigator-1fed0.web.app")

# ✅ Initialize Firebase Admin using credentials from .env
if not firebase_admin._apps:
    firebase_json = os.getenv("FIREBASE_CREDENTIALS")
    if not firebase_json:
        raise RuntimeError("❌ FIREBASE_CREDENTIALS not found in environment variables.")
    cred = credentials.Certificate(json.loads(firebase_json))
    firebase_admin.initialize_app(cred)

# ✅ In-memory token store with expiry tracking
reset_tokens: Dict[str, Dict[str, any]] = {}  # {email: {"token": str, "expires": datetime}}

# ---------------- MODELS ----------------
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class GoogleAuthRequest(BaseModel):
    token: str  # Firebase ID token

# ---------------- HELPER FUNCTIONS ----------------
def create_reset_token(email: str) -> str:
    token = secrets.token_urlsafe(32)
    reset_tokens[email] = {
        "token": token,
        "expires": datetime.utcnow() + timedelta(hours=1)
    }
    return token

def verify_reset_token(token: str) -> str:
    for email, data in list(reset_tokens.items()):
        if data["token"] == token:
            if datetime.utcnow() > data["expires"]:
                del reset_tokens[email]
                raise HTTPException(status_code=400, detail="Token expired.")
            return email
    raise HTTPException(status_code=400, detail="Invalid or expired token.")

# ---------------- SIGNUP ----------------
@auth_router.post("/signup")
async def signup(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    name = data.get("name", "").strip()
    email = data.get("email", "").lower().strip()
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
        "signup_date": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
    }
    users_collection.insert_one(user_data)

    subject = "🎉 Welcome to AI Job Navigator!"
    body = f"""
    <h2>Hi {name},</h2>
    <p>Welcome to <b>AI Job Navigator</b> — your personalized career assistant.</p>
    <ul>
      <li>🧠 Learn with our AI Tutor</li>
      <li>📄 Optimize your resume</li>
      <li>💼 Explore jobs tailored to your skills</li>
    </ul>
    <p>We’re thrilled to have you join us!</p>
    <p>Best regards,<br><b>The AI Job Navigator Team</b></p>
    """
    background_tasks.add_task(send_email, email, subject, body)

    return JSONResponse({"message": "✅ Signup successful! Please login now."})

# ---------------- LOGIN ----------------
@auth_router.post("/login")
async def login(request: Request):
    data = await request.json()
    email = data.get("email", "").lower().strip()
    password = data.get("password")

    if not all([email, password]):
        raise HTTPException(status_code=400, detail="Email and password are required.")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if not pwd_context.verify(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    return JSONResponse({
        "message": "✅ Login successful!",
        "user": {"name": user["name"], "email": user["email"]},
    })

# ---------------- GOOGLE SIGN-IN (Firebase token verify) ----------------
@auth_router.post("/google-auth")
async def google_auth(request: GoogleAuthRequest, background_tasks: BackgroundTasks):
    try:
        token = request.token

        # ✅ Verify Firebase ID token
        decoded_token = auth.verify_id_token(token)
        email = decoded_token.get("email").lower()
        name = decoded_token.get("name", "User")

        user = users_collection.find_one({"email": email})
        if not user:
            users_collection.insert_one({
                "name": name,
                "email": email,
                "auth_type": "google",
                "signup_date": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
            })
            subject = "🎉 Welcome via Google Sign-In!"
            body = f"<h2>Hi {name},</h2><p>Welcome to AI Job Navigator! Thanks for signing in with Google.</p>"
            background_tasks.add_task(send_email, email, subject, body)

        return {"message": "✅ Google authentication successful!", "user": {"name": name, "email": email}}

    except firebase_admin._auth_utils.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid Firebase token.")
    except firebase_admin._auth_utils.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Expired Firebase token.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Firebase authentication failed: {str(e)}")

# ---------------- ADMIN: VIEW USERS ----------------
@auth_router.get("/users")
async def list_users():
    try:
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

# ---------------- FORGOT PASSWORD ----------------
@auth_router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, background_tasks: BackgroundTasks):
    user = users_collection.find_one({"email": data.email.lower()})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    token = create_reset_token(data.email)
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    subject = "🔑 Reset Your AI Job Navigator Password"
    body = f"""
    <h3>Hi {user['name']},</h3>
    <p>Click below to reset your password:</p>
    <a href="{reset_link}" target="_blank" style="color:#4f46e5;font-weight:bold;">Reset Password</a>
    <p>This link will expire in <b>1 hour</b>.</p>
    <p>If you didn't request this, ignore this email.</p>
    """
    background_tasks.add_task(send_email, data.email, subject, body)
    return {"message": "✅ Password reset link sent successfully!"}

# ---------------- RESET PASSWORD ----------------
@auth_router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    email = verify_reset_token(data.token)
    hashed_password = pwd_context.hash(data.new_password)
    result = users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Password update failed.")

    del reset_tokens[email]
    return {"message": "✅ Password reset successful!"}
