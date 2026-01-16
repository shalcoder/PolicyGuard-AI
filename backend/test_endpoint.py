import requests
import json

url = "http://localhost:8000/api/v1/sla/analyze"
data = {
    "latency_ms": 150,
    "error_rate_percent": 0.05,
    "uptime_percent": 99.95,
    "support_response_time_hours": 2,
    "service_name": "Test Service"
}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Connection Error: {e}")
