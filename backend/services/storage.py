import json
import os
from typing import List
from models.policy import PolicyDocument

STORAGE_FILE = "policy_store.json"

class PolicyStorage:
    def __init__(self):
        self._policies: List[PolicyDocument] = []
        self._load_from_disk()

    def _load_from_disk(self):
        if os.path.exists(STORAGE_FILE):
            try:
                with open(STORAGE_FILE, 'r') as f:
                    data = json.load(f)
                    self._policies = [PolicyDocument(**item) for item in data]
            except Exception as e:
                print(f"Failed to load policies: {e}")
                self._policies = []

    def _save_to_disk(self):
        try:
            with open(STORAGE_FILE, 'w') as f:
                json.dump([p.model_dump() for p in self._policies], f)
        except Exception as e:
            print(f"Failed to save policies: {e}")

    def add_policy(self, policy: PolicyDocument):
        self._policies.append(policy)
        self._save_to_disk()

    def get_all_policies(self) -> List[PolicyDocument]:
        return self._policies

    def clear(self):
        self._policies = []
        self._save_to_disk()

# Global instance
policy_db = PolicyStorage()
