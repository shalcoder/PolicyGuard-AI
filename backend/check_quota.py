import os
from google import genai
from dotenv import load_dotenv

def check_quota():
    load_dotenv()
    api_keys_str = os.getenv("GOOGLE_API_KEYS", "")
    if not api_keys_str:
        api_keys_str = os.getenv("GOOGLE_API_KEY", "")
        
    if not api_keys_str:
        print("❌ No API keys found in environment or .env file.")
        return

    keys = [k.strip() for k in api_keys_str.split(",") if k.strip()]
    print(f"🔎 Testing {len(keys)} API key(s) for Quota/Rate Limits...\n")

    # Use a highly available model for the test
    test_model = "gemini-2.0-flash" 

    for i, key in enumerate(keys):
        print(f"--- Key {i+1} ({key[:10]}...) ---")
        try:
            client = genai.Client(api_key=key)
            # Try a tiny generation to check quota
            response = client.models.generate_content(
                model=test_model,
                contents="ping"
            )
            print(f"✅ Key {i+1} is ACTIVE and has quota.")
            print(f"   Response received: {response.text[:20]}...")
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str or "quota" in error_str.lower():
                print(f"📊 Key {i+1} is OUT OF QUOTA (429 Resource Exhausted).")
            elif "401" in error_str or "403" in error_str:
                print(f"🔑 Key {i+1} has AUTH ERRORS (Invalid or Expired).")
            elif "404" in error_str:
                print(f"❌ Key {i+1} returned 404 (Model {test_model} not found for this key/project).")
            else:
                print(f"⚠️  Key {i+1} failed with unexpected error: {error_str[:150]}")
        print("-" * 40)

if __name__ == "__main__":
    check_quota()
