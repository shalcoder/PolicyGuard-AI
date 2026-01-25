import requests
import json
import time

url = "http://localhost:8000/api/v1/chat"
headers = {"Content-Type": "application/json"}

# Question unlikely to be in the uploaded specific policies
data = {
    "message": "What are the key risk tiers in the EU AI Act?",
    "history": []
}

print(f"Waiting for server...")
time.sleep(3) # Give server a moment to startup

try:
    print(f"Sending message: {data['message']}")
    response = requests.post(url, json=data)
    response.raise_for_status()
    
    result = response.json()
    print("\n--- AI Response ---")
    print(result['answer'])
    print("\n--- Citations ---")
    print("\n".join(result['citations']))
    
    if "This answer is based on general compliance best practices" in result['answer']:
        print("\nSUCCESS: Hybrid fallback disclaimer found.")
    else:
        print("\nWARNING: Hybrid fallback disclaimer NOT found.")
    
except Exception as e:
    print(f"Error: {e}")
    if 'response' in locals():
        print(response.text)
