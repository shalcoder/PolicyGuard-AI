
import os
import asyncio
from google import genai
from dotenv import load_dotenv

# Path to backend
backend_path = r"d:\PolicyGuard-AI\backend"
os.chdir(backend_path)

# Load .env
load_dotenv(".env")

api_keys = os.getenv("GOOGLE_API_KEYS", "").split(",")
if not any(api_keys):
    api_keys = [os.getenv("GOOGLE_API_KEY", "")]

model_id = os.getenv("MODEL_FLASH", "gemini-2.0-flash")

async def test_key(key, index):
    if not key:
        print(f"Key {index}: NOT SET")
        return
    
    try:
        client = genai.Client(api_key=key)
        response = client.models.generate_content(
            model=model_id,
            contents="hi"
        )
        print(f"Key {index} ({key[:10]}...): SUCCESS")
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            print(f"Key {index} ({key[:10]}...): QUOTA EXHAUSTED (429)")
        elif "404" in error_msg:
            print(f"Key {index} ({key[:10]}...): MODEL NOT FOUND (404) - Check model ID: {model_id}")
        elif "400" in error_msg:
             print(f"Key {index} ({key[:10]}...): INVALID REQUEST (400) - {error_msg}")
        else:
            print(f"Key {index} ({key[:10]}...): FAILED - {error_msg}")

async def main():
    print(f"Testing {len(api_keys)} API keys with model {model_id}...")
    for i, key in enumerate(api_keys):
        await test_key(key.strip(), i)

if __name__ == "__main__":
    asyncio.run(main())
