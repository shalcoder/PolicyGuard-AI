
import os
import google.genai as genai
from config import settings
import asyncio

async def list_models():
    try:
        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        print(f"Listing models for project...")
        # Note: The SDK might use sync or async iterator for list_models
        # We'll try the standard sync iteration first as it's often safer for scripts
        count = 0
        async for m in client.aio.models.list(config={"page_size": 50}):
             if "generateContent" in m.supported_generation_methods:
                print(f"- {m.name} (Display: {m.display_name})")
                count += 1
        
        if count == 0:
            print("No models found with generateContent capability.")

    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    asyncio.run(list_models())
