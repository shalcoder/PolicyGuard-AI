
import requests
import json
import time

API_URL = "http://localhost:8000/api/v1"

def test_toggle():
    print("1. Uploading Test Policy...")
    files = {'file': ('test_policy.txt', 'All AI responses must contain the word "MAGIC".')}
    res = requests.post(f"{API_URL}/policies/upload", files=files)
    if res.status_code != 200:
        print(f"Upload failed: {res.text}")
        return
    
    policy = res.json()
    policy_id = policy['id']
    print(f"   Policy Created: {policy_id} (Active: {policy['is_active']})")

    # 2. Check if it appears in active list (simulating proxy logic)
    res = requests.get(f"{API_URL}/policies")
    policies = res.json()
    p_obj = next((p for p in policies if p['id'] == policy_id), None)
    print(f"   Verification (List): Active={p_obj['is_active']}")

    # 3. Toggle to Inactive
    print("\n2. Deactivating Policy...")
    res = requests.patch(f"{API_URL}/policies/{policy_id}/toggle")
    updated_policy = res.json()
    print(f"   Toggle Response: Active={updated_policy['is_active']}")

    # 4. Check list again
    res = requests.get(f"{API_URL}/policies")
    policies = res.json()
    p_obj = next((p for p in policies if p['id'] == policy_id), None)
    print(f"   Verification (List after toggle): Active={p_obj['is_active']}")

    if p_obj['is_active'] == False:
        print("\n✅ Backend Logic seems correct. The list returns is_active=False.")
    else:
        print("\n❌ Backend Logic FAILED. The list still returns is_active=True.")

if __name__ == "__main__":
    test_toggle()
