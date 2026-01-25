import requests

url = "http://localhost:8000/api/v1/remediate/doc"
payload = {
    "original_text": "Spec v1.0",
    "violations": ["GDPR"]
}

try:
    print(f"Testing {url}...")
    with requests.post(url, json=payload, stream=True) as r:
        if r.status_code == 200:
            print("Status 200 OK. Content Preview:")
            content = ""
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:
                    text = chunk.decode()
                    content += text
                    print(text, end="")
            
            if "[ERROR]" in content:
                print("\n\nFAILED: Error message detected in stream.")
                exit(1)
            else:
                print("\n\nSUCCESS: Stream finished without error wrapper.")
        else:
            print(f"FAILED: Status {r.status_code}")
            print(r.text)
except Exception as e:
    print(f"FAILED: Connection error {e}")
