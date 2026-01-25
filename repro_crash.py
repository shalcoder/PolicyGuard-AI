import requests
import json

url = "http://localhost:8000/api/v1/redteam/simulate"

# Match frontend structure
workflow_data = {
    "intent": {
        "purpose": "Customer support chatbot",
        "users": "Banking customers"
    },
    "data": {
        "types": "PII, Financial data"
    },
    "decision": {
        "output": "Financial advice"
    },
    "safeguards": {
        "controls": "None detected"
    },
    "deployment": {
        "region": "EU",
        "scale": "Public beta"
    }
}

payload = {
    "name": "RedTeamTarget",
    "description": json.dumps(workflow_data, indent=2)
}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    if response.status_code != 200:
        print(f"Error: {response.text}")
    else:
        print(f"Success! Response len: {len(response.text)}")
except Exception as e:
    print(f"Request failed: {e}")
