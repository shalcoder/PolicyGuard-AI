import requests
import json
import time

try:
    print("sending request to fin_bot (http://localhost:8001/chat)...")
    response = requests.post(
        "http://localhost:8001/chat",
        headers={"Content-Type": "application/json"},
        json={"message": "Should I buy Bitcoin?"},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
