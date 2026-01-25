
import requests
import sys
import time

API_URL = "http://localhost:8000/api/v1"

def check_persistence():
    print("1. Checking existing policies...")
    res = requests.get(f"{API_URL}/policies")
    policies = res.json()
    
    # Find the policy created by reproduce_bug.py (or any inactive policy)
    # The name was "test_policy.txt"
    target = next((p for p in policies if p['name'] == 'test_policy.txt'), None)
    
    if not target:
        print("❌ Test policy not found. Run reproduce_bug.py first.")
        sys.exit(1)
        
    print(f"   Found policy: {target['id']}, Active={target['is_active']}")
    
    if target['is_active']:
         print("❌ Policy is ACTIVE. Persistence FAILED (expected it to be Inactive from previous run).")
    else:
         print("✅ Policy is INACTIVE. Persistence WORKED.")

if __name__ == "__main__":
    check_persistence()
