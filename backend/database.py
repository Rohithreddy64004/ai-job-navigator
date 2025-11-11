from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ✅ Get MongoDB URI from environment
MONGO_URI = os.getenv("MONGO_URI")

# ✅ Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["ai_job_navigator"]

# ✅ Collections
users_collection = db["users"]
jobs_collection = db["jobs"]


# 🟩 Function: Get all users
def get_all_users():
    users = []
    for user in users_collection.find():
        users.append({
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "signup_date": user.get("signup_date", "")
        })
    return users