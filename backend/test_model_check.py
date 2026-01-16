from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    # Try to read from .env if load_dotenv didn't find it (e.g. running from wrong dir)
    # manual parse
    try:
        with open('.env') as f:
            for line in f:
                if line.startswith('GOOGLE_API_KEY='):
                    api_key = line.strip().split('=', 1)[1]
                    break
    except:
        pass

print(f"Testing with API Key: {api_key[:5]}...")

client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents="Hello"
    )
    print("Success!")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
