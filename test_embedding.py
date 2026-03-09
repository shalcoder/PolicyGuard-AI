import os
from google import genai
from dotenv import load_dotenv

load_dotenv("backend/.env")

def test_models():
    api_key = os.getenv("GEMINI_API_KEY_1")
    client = genai.Client(api_key=api_key)
    
    print("Available models containing 'embed':")
    for model in client.models.list():
        if 'embed' in model.name.lower():
            print(f"- {model.name}")
            
if __name__ == "__main__":
    test_models()
