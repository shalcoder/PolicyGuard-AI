import asyncio
import os
from dotenv import load_dotenv
from google import genai

async def list_models():
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")
    client = genai.Client(api_key=api_key)
    
    try:
        print("Listing models...")
        for m in client.models.list():
            print(f"Model: {m.name}")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(list_models())
