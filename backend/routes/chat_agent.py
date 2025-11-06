from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv() 

chat_router = APIRouter()

# ✅ Initialize Groq client using your API key from environment
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@chat_router.post("/chat")
async def chat_with_agent(data: ChatRequest):
    """
    AI-powered customer support using Groq LLM.
    Responds to queries related to the AI Job Navigator website.
    """
    try:
        prompt = f"""
        You are an AI support assistant for the website 'AI Job Navigator'.
        The user is asking: {data.message}

        The website offers:
        - AI Tutor for learning and interview preparation.
        - Resume Scoring & Optimization.
        - Job Search and Employer connections.
        - Admin panel for managing users and jobs.

        Respond clearly and politely to help the user with website-related questions.
        Keep responses short (2–3 sentences) and easy to understand.
        """

        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful website assistant."},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile",  # Groq LLM
        )

        reply = completion.choices[0].message.content.strip()
        return {"response": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with Groq API: {str(e)}")
