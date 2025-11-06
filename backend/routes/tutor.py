from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import requests
import os
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

tutor_router = APIRouter()

# ✅ YouTube API Config
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


# 🎯 1. Dynamic YouTube Video Search
@tutor_router.get("/youtube_videos")
def get_youtube_videos(q: str = Query(..., description="Search term for YouTube videos")):
    """
    Fetch YouTube videos dynamically from YouTube Data API v3.
    """
    try:
        params = {
            "part": "snippet",
            "q": q,
            "type": "video",
            "maxResults": 6,
            "key": YOUTUBE_API_KEY,
        }
        response = requests.get(YOUTUBE_SEARCH_URL, params=params)
        response.raise_for_status()

        data = response.json()
        videos = [
            {
                "id": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                "channel": item["snippet"]["channelTitle"],
            }
            for item in data.get("items", [])
        ]

        return JSONResponse(content={"videos": videos or []})

    except requests.exceptions.RequestException as e:
        return JSONResponse(
            content={"error": "Failed to fetch videos", "details": str(e)},
            status_code=500,
        )


# 🌟 2. Static Recommended Videos
@tutor_router.get("/recommended_videos")
def get_recommended_videos():
    """
    Return a list of static recommended YouTube videos.
    """
    videos = [
        {"id": "rfscVS0vtbw", "title": "Python Full Course for Beginners"},
        {"id": "GwIo3gDZCVQ", "title": "Machine Learning Tutorial for Beginners"},
        {"id": "RBSGKlAvoiM", "title": "React JS Crash Course"},
        {"id": "aircAruvnKk", "title": "Deep Learning with Python - Full Course"},
        {"id": "XKHEtdqhLK8", "title": "Data Science Roadmap 2025"},
        {"id": "f02mOEt11OQ", "title": "AI Explained in Simple Terms"},
    ]
    return JSONResponse(content={"videos": videos})


# 📚 3. Dynamic + Static Recommended Courses
@tutor_router.get("/recommended_courses")
def get_recommended_courses(q: str = Query(None, description="Optional search query for filtering courses")):
    """
    Return a curated list of recommended courses.
    Filters based on topic (e.g., 'python', 'ai', 'data science') if provided.
    """
    courses = [
        {
            "title": "Python for Everybody",
            "description": "University of Michigan’s beginner-friendly course covering Python basics to advanced concepts.",
            "url": "https://www.coursera.org/specializations/python",
        },
        {
            "title": "Machine Learning by Andrew Ng",
            "description": "Stanford’s world-famous ML course teaching algorithms, supervised and unsupervised learning.",
            "url": "https://www.coursera.org/learn/machine-learning",
        },
        {
            "title": "Deep Learning Specialization",
            "description": "Comprehensive 5-course program by Andrew Ng to master neural networks and deep learning.",
            "url": "https://www.coursera.org/specializations/deep-learning",
        },
        {
            "title": "Frontend Development with React",
            "description": "Learn React.js, components, and state management through interactive lessons.",
            "url": "https://www.freecodecamp.org/learn/front-end-development-libraries/",
        },
        {
            "title": "Introduction to Data Science",
            "description": "IBM’s Data Science foundation course covering Python, data analysis, and visualization.",
            "url": "https://www.coursera.org/learn/what-is-datascience",
        },
        {
            "title": "AI For Everyone",
            "description": "A non-technical introduction to AI for students, business professionals, and curious minds.",
            "url": "https://www.coursera.org/learn/ai-for-everyone",
        },
    ]

    # 🎯 Optional filtering by search query
    if q:
        q = q.lower()
        filtered_courses = [
            course
            for course in courses
            if q in course["title"].lower() or q in course["description"].lower()
        ]
        return JSONResponse(content={"courses": filtered_courses or courses})

    return JSONResponse(content={"courses": courses})
