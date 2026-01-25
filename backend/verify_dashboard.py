import requests
import time
import sys

print("Waiting for server...")
time.sleep(5)

try:
    response = requests.get("http://127.0.0.1:8000/api/v1/dashboard/stats")
    if response.status_code == 200:
        data = response.json()
        print("✅ Dashboard Stats Endpoint: OK")
        
        if "compliance_trend" in data:
            print(f"✅ Trend Data: Found {len(data['compliance_trend'])} points")
        else:
            print("❌ Trend Data NOT FOUND")
            
        if "risk_distribution" in data:
             print(f"✅ Risk Breakdown: {data['risk_distribution']}")
        else:
             print("❌ Risk Breakdown NOT FOUND")
             
        if data.get('risk_distribution') and data.get('compliance_trend'):
            sys.exit(0)
        else:
            sys.exit(1)
            
    else:
        print(f"❌ Failed: {response.text}")
        sys.exit(1)

except Exception as e:
    print(f"❌ Connection Error: {e}")
    sys.exit(1)
