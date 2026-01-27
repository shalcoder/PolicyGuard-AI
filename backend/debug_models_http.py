
import os
import requests
import json
from config import settings
from dotenv import load_dotenv

load_dotenv() # Load env vars from .env file

def list_models_http():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("Error: No API Key found.")
        return

    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        print(f"--- Available Models for current API Key ---")
        found = False
        if "models" in data:
            for m in data["models"]:
                if "generateContent" in m.get("supportedGenerationMethods", []):
                    print(f"- {m['name']} (Version: {m['version']})")
                    found = True
        
    except Exception as e:
        print(f"HTTP Request Failed: {e}")

    # Write logic moved inside for safety
    if "models" in data:
         with open("models_list_safe.txt", "w", encoding="utf-8") as f:
            for m in data["models"]:
                if "generateContent" in m.get("supportedGenerationMethods", []):
                    f.write(f"- {m['name']} (Version: {m['version']})\n")

if __name__ == "__main__":
    list_models_http()
