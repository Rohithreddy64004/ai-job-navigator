from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from datetime import datetime
from bson import ObjectId
from database import users_collection
from routes.email_utils import send_email  # ✅ Email sender (SMTP)
from pydantic import BaseModel
import secrets

# ---------------- CONFIG ----------------
auth_router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Temporary in-memory store for password reset tokens
reset_tokens = {}

# ---------------- MODELS ----------------
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ---------------- SIGNUP ----------------
@auth_router.post("/signup")
async def signup(request: Request):
    data = await request.json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        raise HTTPException(status_code=400, detail="All fields are required.")

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists.")

    hashed_password = pwd_context.hash(password)
    user_data = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "signup_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    users_collection.insert_one(user_data)

    # ✅ Send welcome email
    try:
        subject = "🎉 Welcome to AI Job Navigator!"
        body = f"""
        <h2>Hi {name},</h2>
        <p>Welcome to <b>AI Job Navigator</b> — your personalized career assistant.</p>
        <p>Here’s what you can do:</p>
        <ul>
          <li>🧠 Learn with our AI Tutor</li>
          <li>📄 Optimize your resume for top jobs</li>
          <li>💼 Explore job opportunities tailored to your skills</li>
        </ul>
        <p>We’re thrilled to have you join us!</p>
        <br>
        <p>Best regards,<br><b>The AI Job Navigator Team</b></p>
        """
        send_email(email, subject, body)
    except Exception as e:
        print(f"⚠️ Email sending failed: {e}")

    return JSONResponse({"message": "✅ User registered successfully and welcome email sent!"})

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
        "user": {"name": user["name"], "email": user["email"]}
    })

# ---------------- ADMIN: VIEW USERS ----------------
@auth_router.get("/users")
async def list_users():
    users = []
    for user in users_collection.find():
        users.append({
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "signup_date": user.get("signup_date", "")
        })
    return {"users": users}

# ---------------- FORGOT PASSWORD ----------------
@auth_router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Generate secure reset token
    token = secrets.token_urlsafe(32)
    reset_tokens[data.email] = token

    # Reset link for frontend
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    subject = "🔑 Reset Your AI Job Navigator Password"
    body = f"""
    <h3>Hi {user['name']},</h3>
    <p>We received a request to reset your password.</p>
    <p>Click the link below to reset it:</p>
    <p><a href="{reset_link}" target="_blank"
        style="color:#4f46e5;text-decoration:none;font-weight:bold;">
        Reset Your Password
    </a></p>
    <p>If you didn't request this, please ignore this email.</p>
    <br>
    <p>Best regards,<br><b>AI Job Navigator Team</b></p>
    """

    try:
        send_email(data.email, subject, body)
        return {"message": "✅ Password reset link sent successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")

# ---------------- RESET PASSWORD ----------------
@auth_router.post("/reset-password")
async def reset_password(request: Request):
    try:
        # Parse JSON data safely
        data = await request.json()
        print("📩 Received reset-password data:", data)

        token = data.get("token")
        new_password = data.get("new_password")

        if not token or not new_password:
            raise HTTPException(status_code=400, detail="Token and new password required.")

        # Find email associated with the token
        email = next((email for email, t in reset_tokens.items() if t == token), None)
        if not email:
            raise HTTPException(status_code=400, detail="Invalid or expired token.")

        # Hash new password
        hashed_password = pwd_context.hash(new_password)
        result = users_collection.update_one(
            {"email": email},
            {"$set": {"password": hashed_password}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Password update failed.")

        # Remove used token
        del reset_tokens[email]
        print(f"✅ Password updated for {email}")

        return JSONResponse({"message": "✅ Password reset successful!"})

    except Exception as e:
        print("⚠️ Error in reset-password route:", e)
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
