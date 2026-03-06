import os
import asyncio
from google import genai
from dotenv import load_dotenv

async def test_location():
    load_dotenv()
    api_keys_str = os.getenv("GOOGLE_API_KEYS", "") or os.getenv("GOOGLE_API_KEY", "")
    if not api_keys_str:
        print("❌ No API keys found.")
        return

    key = api_keys_str.split(",")[0].strip()
    client = genai.Client(api_key=key)
    
    # List of models we want to check for your specific location context
    models_to_test = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.5-pro",
        "gemini-3-pro-preview",
        "gemini-3-flash-preview",
        "gemini-exp-1206",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    ]

    print(f"🌍 Testing Location-Based Availability for Key Snippet: {key[:10]}...\n")
    print(f"{'MODEL':<35} | {'STATUS':<20} | {'REASON'}")
    print("-" * 80)

    for model_name in models_to_test:
        try:
            # We use a tiny prompt to minimize quota impact
            response = client.models.generate_content(
                model=model_name,
                contents="ping"
            )
            print(f"{model_name:<35} | ✅ AVAILABLE      | Worked!")
        except Exception as e:
            error_str = str(e).lower()
            if "location" in error_str or "400" in error_str:
                print(f"{model_name:<35} | ❌ BLOCKED        | Location Not Supported")
            elif "429" in error_str or "quota" in error_str or "resource_exhausted" in error_str:
                print(f"{model_name:<35} | ✅ AVAILABLE      | Hit Quota (but location is OK)")
            elif "404" in error_str or "not found" in error_str:
                print(f"{model_name:<35} | ❓ NOT FOUND      | Not in your project catalog")
            else:
                print(f"{model_name:<35} | ⚠️ ERROR          | {error_str[:30]}...")

if __name__ == "__main__":
    asyncio.run(test_location())
