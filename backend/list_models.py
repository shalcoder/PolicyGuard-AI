from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
print("Listing models...")
for m in client.models.list():
    print(f"- {m.name} (Methods: {m.supported_methods})")
