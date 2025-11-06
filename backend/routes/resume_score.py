from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF for PDF text extraction
from groq import Groq
import os, re, json
from dotenv import load_dotenv

resume_router = APIRouter()
load_dotenv()

# ✅ Configure Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_text_from_pdf(file):
    """Extract plain text from uploaded PDF file"""
    pdf = fitz.open(stream=file, filetype="pdf")
    text = ""
    for page in pdf:
        text += page.get_text("text")
    return text


@resume_router.post("/resume_score")
async def resume_score(resume: UploadFile, job_description: str = Form("")):
    if not resume:
        return JSONResponse({"error": "No resume uploaded"}, status_code=400)

    # ✅ Read the resume bytes and extract text
    resume_bytes = await resume.read()
    resume_text = extract_text_from_pdf(resume_bytes)

    # ✅ LLM prompt for Groq
    prompt = f"""
    You are an expert resume evaluator. Analyze the following resume for job readiness.
    Compare it with the provided job description (if available).

    Resume:
    {resume_text}

    Job Description:
    {job_description if job_description else "N/A"}

    Return the result strictly in JSON format as follows:
    {{
      "score": <integer between 0 and 100>,
      "strengths": ["list of key strengths"],
      "weaknesses": ["list of weaknesses"],
      "suggestions": ["list of improvement tips"]
    }}
    """

    try:
        # ✅ Use Groq’s LLM (LLaMA 3)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )

        response_text = completion.choices[0].message.content.strip()

        # ✅ Extract valid JSON response
        match = re.search(r"\{.*\}", response_text, re.DOTALL)
        if not match:
            return JSONResponse({
                "error": "Invalid response format from LLM.",
                "raw_output": response_text
            }, status_code=500)

        data = json.loads(match.group(0))
        return JSONResponse(data)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
