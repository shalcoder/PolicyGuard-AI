
import google.generativeai as genai
import os
from dotenv import load_dotenv
import time

load_dotenv("backend/.env")
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

models_to_test = [
    "models/gemini-3-flash-preview", 
    "models/gemini-2.5-flash-lite-preview-09-2025",
    "models/gemini-1.5-flash"
]

print(f"Testing Quota for API Key: {api_key[:10]}...")

for m in models_to_test:
    print(f"\n--- Testing {m} ---")
    try:
        model = genai.GenerativeModel(m)
        response = model.generate_content("Hello, can you hear me?")
        print(f"SUCCESS! Response: {response.text}")
        print(f">> RECOMMENDATION: Switch to {m}")
        break
    except Exception as e:
        print(f"FAILED: {e}")
        if "429" in str(e):
            print(">> Status: Quota Exceeded")
        elif "404" in str(e):
            print(">> Status: Model Not Found")
