import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
keys = os.getenv("GOOGLE_API_KEYS", "").split(",")

for i, k in enumerate(keys):
    k = k.strip()
    if not k: continue
    print(f"Testing Key {i+1}...")
    try:
        client = genai.Client(api_key=k)
        # We use a very light call
        client.models.list()
        # Then we try a tiny content gen
        client.models.generate_content(model="gemini-2.0-flash", contents="hi")
        print(f"RESULT_{i+1}: OK")
    except Exception as e:
        print(f"RESULT_{i+1}: ERROR - {str(e)}")
