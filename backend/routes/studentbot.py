import os
import requests
from dotenv import load_dotenv
from groq import Groq

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def test_connection():
    """
    Optional: Test Groq API connection & available models.
    """
    try:
        url = "https://api.groq.com/openai/v1/models"
        headers = {"Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}"}
        resp = requests.get(url, headers=headers)
        if resp.status_code == 200:
            print("✅ Groq API Connected Successfully!")
            print("Available Models:", [m["id"] for m in resp.json().get("data", [])])
        else:
            print("⚠️ Groq API Connection Failed:", resp.text)
    except Exception as e:
        print("⚠️ Error connecting to Groq API:", e)


def get_ai_response(user_query: str) -> str:
    """
    Get an AI-generated response from the Groq Llama3 model.
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an intelligent and friendly AI tutor. "
                        "You explain concepts clearly, provide real-world examples, "
                        "and help students understand complex topics in simple terms."
                    ),
                },
                {"role": "user", "content": user_query},
            ],
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"⚠️ Sorry, I ran into an error while processing your question: {str(e)}"


# ✅ Optional: Uncomment to test locally
# if __name__ == "__main__":
#     test_connection()
#     query = input("Ask something: ")
#     print(get_ai_response(query))
