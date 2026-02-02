import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("GOOGLE_API_KEY not found in .env")
else:
    genai.configure(api_key=api_key)
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content("Hello, are you working correctly?")
        print(f"Response from gemini-2.0-flash: {response.text}")
    except Exception as e:
        print(f"Error calling gemini-2.0-flash: {e}")
