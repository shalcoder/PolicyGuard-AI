import asyncio
import os
import sys

# Mock settings/client setup to match gemini.py imports (assuming installed packages)
from google import genai

api_key = os.environ.get("GOOGLE_API_KEY")
if not api_key:
    print("No API Key")
    sys.exit(1)

client = genai.Client(api_key=api_key)

async def inspect():
    print("Calling generate_content_stream...")
    res = client.models.generate_content_stream(model="gemini-2.0-flash-exp", contents="Hi")
    print(f"Type of result: {type(res)}")
    print(f"Dir of result: {dir(res)}")
    
    try:
        print("Attempting await...")
        x = await res
        print(f"Await succeeded. Type of awaited result: {type(x)}")
    except Exception as e:
        print(f"Await failed: {e}")

    # If await failed, maybe it's iterable directly?
    try:
        print("Attempting async for...")
        async for chunk in res:
            print("Async for yielded chunk")
            break
    except Exception as e:
        print(f"Async for failed: {e}")

if __name__ == "__main__":
    asyncio.run(inspect())
