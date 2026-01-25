import asyncio
import os
from dotenv import load_dotenv
import google.generativeai as genai

async def test_gemini():
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")
    print(f"API Key present: {bool(api_key)}")
    if api_key:
        print(f"API Key (first 5 chars): {api_key[:5]}...")
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-pro")
        print("Testing generation...")
        response = await model.generate_content_async("Say 'Connection Successful' if you can hear me.")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
