import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    with open("models_output.txt", "w") as f:
        f.write("GOOGLE_API_KEY not found in .env")
else:
    genai.configure(api_key=api_key)
    try:
        with open("models_output.txt", "w") as f:
            f.write("Available models:\n")
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    f.write(f"Name: {m.name}\n")
                    f.write(f"Display Name: {m.display_name}\n")
                    f.write(f"Supported methods: {m.supported_generation_methods}\n")
                    f.write("-" * 20 + "\n")
    except Exception as e:
        with open("models_output.txt", "w") as f:
            f.write(f"Error listing models: {e}")
