import os
import json
import tempfile
import asyncio
import aiohttp
from fastapi import APIRouter, UploadFile, HTTPException, Query
from PyPDF2 import PdfReader
from groq import Groq
from dotenv import load_dotenv

# =====================================================
# 🔹 Environment Setup
# =====================================================
load_dotenv()

jobs_router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

JSEARCH_URL = "https://jsearch.p.rapidapi.com/search"
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = "jsearch.p.rapidapi.com"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CX_ID = os.getenv("GOOGLE_CX_ID")

required_env = ["GROQ_API_KEY", "RAPIDAPI_KEY", "GOOGLE_API_KEY", "GOOGLE_CX_ID"]
missing = [v for v in required_env if not os.getenv(v)]
if missing:
    raise RuntimeError(f"❌ Missing environment variables: {', '.join(missing)}")


# =====================================================
# 🔹 Helper: Extract text from resume
# =====================================================
def extract_resume_text(file_path: str) -> str:
    reader = PdfReader(file_path)
    return "".join([page.extract_text() or "" for page in reader.pages])


# =====================================================
# 🔹 Helper: Extract skills using Groq LLM
# =====================================================
async def extract_skills_with_llm(resume_text: str):
    prompt = f"""
    Extract a concise JSON array of technical and soft skills from this resume.
    Output only JSON array, e.g. ["Python", "Machine Learning", "SQL", "Leadership"].
    Resume:
    {resume_text[:4000]}
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are an AI that extracts and identifies skills accurately."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )

    text = response.choices[0].message.content.strip()
    try:
        return json.loads(text)
    except:
        return [s.strip() for s in text.replace("\n", ",").split(",") if s.strip()]


# =====================================================
# 🔹 Helper: LLM-based job ranking
# =====================================================
async def rank_jobs_with_llm(skills: list, jobs: list):
    job_text = json.dumps(jobs[:10], indent=2)
    prompt = f"""
    Given these skills: {', '.join(skills)},
    rank the following jobs from most to least relevant.
    Output JSON array of job titles in ranked order.
    Jobs:
    {job_text}
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are an expert in resume-job relevance scoring."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
    )

    try:
        ranking = json.loads(response.choices[0].message.content)
        ranked = [j for title in ranking for j in jobs if title.lower() in j["job_title"].lower()]
        return ranked + [j for j in jobs if j not in ranked]
    except:
        return jobs


# =====================================================
# 🔹 Helper: Fetch Jobs from APIs (Async)
# =====================================================
async def fetch_jsearch_jobs(session, skills, title, location, remote):
    headers = {"x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": RAPIDAPI_HOST}
    search_query = f"{title or 'developer'} {', '.join(skills[:3])}"
    params = {
        "query": search_query,
        "page": "1",
        "num_pages": "1",
        "country": "in",
        "date_posted": "all"
    }
    if location:
        params["query"] += f" {location}"
    if remote:
        params["query"] += " remote"

    async with session.get(JSEARCH_URL, headers=headers, params=params) as resp:
        if resp.status != 200:
            print(f"⚠️ JSearch API failed: {resp.status}")
            return []
        data = await resp.json()
        jobs = data.get("data", [])
        return [
            {
                "source": "JSearch",
                "job_title": j.get("job_title", "Not specified"),
                "company_name": j.get("employer_name", "Not specified"),
                "location": j.get("job_city") or j.get("job_country") or "Not specified",
                "job_link": j.get("job_apply_link") or j.get("job_google_link") or "#",
                "posted_date": j.get("job_posted_at_datetime_utc", "N/A"),
            }
            for j in jobs[:10]
        ]


async def fetch_google_jobs(session, skills, title, location, remote):
    job_sites = [
        "site:naukri.com",
        "site:linkedin.com/jobs",
        "site:indeed.com",
        "site:apna.co",
        "site:foundit.in",
        "site:timesjobs.com",
        "site:internshala.com",
        "site:unstop.com",
        "site:glassdoor.co.in",
        "site:wipro.com/careers",
        "site:infosys.com/careers",
        "site:tcs.com/careers",
        "site:accenture.com/in-en/careers",
        "site:microsoft.com/en-in/careers",
        "site:amazon.jobs",
        "site:google.com/about/careers"
    ]
    query = f"{title or 'developer'} {', '.join(skills[:3])} jobs " + " OR ".join(job_sites)
    if location:
        query += f" in {location}"
    if remote:
        query += " remote"

    google_url = (
        f"https://www.googleapis.com/customsearch/v1?q={query}"
        f"&key={GOOGLE_API_KEY}&cx={GOOGLE_CX_ID}&num=10"
    )

    async with session.get(google_url) as resp:
        if resp.status != 200:
            print(f"⚠️ Google API failed: {resp.status}")
            return []
        data = await resp.json()
        items = data.get("items", [])
        return [
            {
                "source": "Google",
                "job_title": item.get("title", "Not specified"),
                "company_name": item.get("displayLink", "Unknown"),
                "location": location or "India",
                "job_link": item.get("link", "#"),
                "posted_date": "N/A"
            }
            for item in items[:10]
        ]


# =====================================================
# 🔹 Main Endpoint
# =====================================================
@jobs_router.post("/upload_resume/")
async def upload_resume(
    file: UploadFile,
    title: str = Query(None, description="Optional job title to search for"),
    location: str = Query(None, description="Preferred job location"),
    remote: bool = Query(False, description="Include remote jobs")
):
    try:
        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Extract resume text
        resume_text = extract_resume_text(tmp_path)
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="No readable text found in resume.")

        # Extract skills using LLM
        skills = await extract_skills_with_llm(resume_text)
        if not skills:
            raise HTTPException(status_code=500, detail="Skill extraction failed.")

        async with aiohttp.ClientSession() as session:
            # Run both job searches in parallel
            jsearch_task = fetch_jsearch_jobs(session, skills, title, location, remote)
            google_task = fetch_google_jobs(session, skills, title, location, remote)
            jsearch_jobs, google_jobs = await asyncio.gather(jsearch_task, google_task)

        # Combine and deduplicate
        combined = jsearch_jobs + google_jobs
        unique = []
        seen = set()
        for job in combined:
            if job["job_link"] not in seen:
                unique.append(job)
                seen.add(job["job_link"])

        # Rank jobs with LLM
        ranked_jobs = await rank_jobs_with_llm(skills, unique)

        return {
            "status": "success",
            "skills_extracted": skills,
            "filters": {"title": title, "location": location, "remote": remote},
            "total_jobs": len(ranked_jobs),
            "jobs": ranked_jobs
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"⚠️ Internal Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
