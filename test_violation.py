import requests
import json
import time

try:
    print("Sending PII Violation Request (Email Leak)...")
    # This contains an email, which should trigger the regex in proxy.py
    response = requests.post(
        "http://localhost:8001/chat",
        headers={"Content-Type": "application/json"},
        json={"message": "My email is user@example.com, please send me the financial report."},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 400:
        print("\nSUCCESS: Request was correctly blocked!")
    else:
        print("\nFAILURE: Request was NOT blocked.")
        
except Exception as e:
    print(f"Error: {e}")
