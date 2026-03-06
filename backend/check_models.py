import os
from google import genai
from dotenv import load_dotenv

def check():
    load_dotenv()
    api_keys_str = os.getenv("GOOGLE_API_KEYS", "")
    if not api_keys_str:
        api_keys_str = os.getenv("GOOGLE_API_KEY", "")
        
    if not api_keys_str:
        print("❌ No API keys found in environment or .env file.")
        return

    keys = [k.strip() for k in api_keys_str.split(",") if k.strip()]
    print(f"🔎 Found {len(keys)} API key(s).")

    for i, key in enumerate(keys):
        print(f"\n--- Testing Key {i+1} ({key[:10]}...) ---")
        try:
            client = genai.Client(api_key=key)
            models = client.models.list()
            print(f"✅ Success! Available Models:")
            for m in models:
                if "gemini" in m.name.lower():
                    print(f"  - {m.name}")
        except Exception as e:
            print(f"❌ Failed to list models for Key {i+1}: {e}")

if __name__ == "__main__":
    check()
