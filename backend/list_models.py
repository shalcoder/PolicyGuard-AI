from dotenv import load_dotenv
import sys
import os

# Load env vars first
load_dotenv()

import google.generativeai as genai

# Ensure backend path is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from config import settings

if not settings.GOOGLE_API_KEY:
    with open("models_output.txt", "w") as f:
        f.write("GOOGLE_API_KEY not found in settings")
else:
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    try:
        with open("models_output.txt", "w") as f:
            f.write("Available models:\n")
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    f.write(f"Name: {m.name}\n")
                    f.write(f"Display Name: {m.display_name}\n")
                    f.write("-" * 20 + "\n")
            f.write("\nNote: Experimental models like gemini-2.0-pro-exp might not appear in this list but are often invocable by name.\n")
    except Exception as e:
        with open("models_output.txt", "w") as f:
            f.write(f"Error listing models: {e}")
