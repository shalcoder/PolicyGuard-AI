import requests
import json

url = "http://localhost:8000/api/v1/remediate/code"

payload = {
    "policy_summary": "Data must be encrypted at rest. PII must need explicit user consent.",
    "language": "python"
}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, json=payload, stream=True)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("Response (Streamed):")
        for chunk in response.iter_content(chunk_size=128):
            print(chunk.decode(), end="")
        print("\nDone.")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
