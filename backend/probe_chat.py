import requests
import json
import traceback

try:
    url = 'http://localhost:8001/chat'
    data = {'message': 'hi', 'conversation_id': None}
    r = requests.post(url, json=data, timeout=15)
    print(f'Status: {r.status_code}')
    print(f'Response: {r.text}')
except Exception as e:
    print(f'Probe Error: {e}')
    traceback.print_exc()
