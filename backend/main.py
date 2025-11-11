from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware


# ✅ Import your routers
from routes.auth import auth_router
from routes.jobs import jobs_router
from routes import resume
from routes.tutor import tutor_router
from routes.studentbot import get_ai_response  # <-- import the Groq LLM function
from pydantic import BaseModel
from routes.resume_score import resume_router
from routes.admin_routes import admin_router
from routes.chat_agent import chat_router
from routes.resumetemplates import router as resume_router




# ✅ Initialize FastAPI app
app = FastAPI(title="AI Job Navigator API")

# ✅ Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-job-navigator.web.app",
        "https://ai-job-navigator-1fed0.web.app",
        "https://ai-job-navigator.firebaseapp.com",
        "https://ai-job-navigator.onrender.com", 
        "https://ai-job-navigator.firebaseapp.com",
        "https://ai-job-navigator-1fed0.web.app",
        ],  # Your React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routers
app.add_middleware(HTTPSRedirectMiddleware)
app.include_router(auth_router, prefix="/auth")
app.include_router(jobs_router, prefix="/api")
app.include_router(resume.router)
app.include_router(tutor_router, prefix="/api", tags=["AI Tutor"])
app.include_router(resume_router, prefix="/api")
app.include_router(admin_router,prefix="/api")
app.include_router(chat_router, prefix="/api", tags=["Chat Agent"])
app.include_router(resume_router)




# ✅ Define request model for AI Bot
class Query(BaseModel):
    query: str

# ✅ AI Student Bot endpoint
@app.post("/api/ask")
async def ask_ai(data: Query):
    """
    Route to process user queries and return AI-generated responses.
    """
    response = get_ai_response(data.query)
    return {"response": response}

# ✅ Home route
@app.get("/")
def home():
    return {"message": "Welcome to AI Job Navigator Backend 🚀"}
