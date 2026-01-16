import json
import os
from typing import List
from models.policy import PolicyDocument
from models.settings import PolicySettings
from config import settings
import firebase_admin
from firebase_admin import credentials, firestore

STORAGE_FILE = "policy_store.json"
SETTINGS_FILE = "settings_store.json"
EVALUATIONS_FILE = "evaluations_store.json"

class PolicyStorage:
    def __init__(self):
        self._policies: List[PolicyDocument] = []
        self._evaluations: List[dict] = []
        self.use_firebase = False
        self.db = None
        
        # Init Firebase if creds exist
        if os.path.exists(settings.FIREBASE_CREDENTIALS):
            try:
                if not firebase_admin._apps:
                    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
                    firebase_admin.initialize_app(cred)
                self.db = firestore.client()
                self.use_firebase = True
                print("✅ Connected to Firebase Firestore")
                # Initial Load
                self._load_from_firebase()
            except Exception as e:
                print(f"❌ Firebase Init Failed: {e}")
                self._load_from_disk()
        else:
            print("⚠️ Firebase Key not found. Using local JSON storage.")
            self._load_from_disk()
            self._load_evaluations()

    # --- Loading Logic ---
    def _load_from_firebase(self):
        try:
            # Load Policies
            policy_ref = self.db.collection('policies')
            self._policies = []
            for doc in policy_ref.stream():
                data = doc.to_dict()
                if "id" not in data: data["id"] = doc.id
                self._policies.append(PolicyDocument(**data))
            
            # Load Evaluations (Limit 100 for startup performance)
            eval_ref = self.db.collection('evaluations').order_by('timestamp', direction=firestore.Query.DESCENDING).limit(100)
            self._evaluations = []
            for doc in eval_ref.stream():
                self._evaluations.append(doc.to_dict())
            self._evaluations.reverse() # Keep internal order chronological if needed, or handle in getters
                
        except Exception as e:
            print(f"Error loading from Firebase: {e}")

    def _load_from_disk(self):
        if os.path.exists(STORAGE_FILE):
            try:
                with open(STORAGE_FILE, 'r') as f:
                    data = json.load(f)
                    self._policies = [PolicyDocument(**item) for item in data]
            except Exception as e:
                print(f"Failed to load policies: {e}")
                self._policies = []
        
        if os.path.exists(EVALUATIONS_FILE):
             try:
                with open(EVALUATIONS_FILE, 'r') as f:
                    self._evaluations = json.load(f)
             except: self._evaluations = []

    def _save_to_disk(self):
        if not self.use_firebase:
            try:
                with open(STORAGE_FILE, 'w') as f:
                    json.dump([p.model_dump() for p in self._policies], f)
            except Exception as e:
                print(f"Failed to save policies: {e}")

    def _save_evaluations_disk(self):
        if not self.use_firebase:
            try:
                with open(EVALUATIONS_FILE, 'w') as f:
                    json.dump(self._evaluations, f)
            except Exception as e:
                print(f"Failed to save evaluations: {e}")

    # --- CRUD Operations ---
    def add_policy(self, policy: PolicyDocument):
        self._policies.append(policy)
        if self.use_firebase:
            try:
                self.db.collection('policies').document(policy.id).set(policy.model_dump())
            except Exception as e: print(f"Firebase Error: {e}")
        else:
            self._save_to_disk()

    def get_all_policies(self) -> List[PolicyDocument]:
        # For MVP we keep in-memory sync, but in prod we'd fetch.
        # Since we load on startup and add via this class, self._policies should be consistent.
        # Ideally, we should fetch fresh from DB? For Hackathon, in-memory cache is faster.
        return self._policies

    def clear(self):
        self._policies = []
        if self.use_firebase:
            # Not implemented for safety
            pass
        else:
            self._save_to_disk()

    def delete_policy(self, policy_id: str) -> bool:
        initial_count = len(self._policies)
        self._policies = [p for p in self._policies if p.id != policy_id]
        
        if len(self._policies) < initial_count:
            if self.use_firebase:
                self.db.collection('policies').document(policy_id).delete()
            else:
                self._save_to_disk()
            return True
        return False

    def update_policy(self, policy_id: str, updates: dict) -> PolicyDocument | None:
        for p in self._policies:
            if p.id == policy_id:
                updated_data = p.model_dump()
                updated_data.update(updates)
                new_policy = PolicyDocument(**updated_data)
                
                index = self._policies.index(p)
                self._policies[index] = new_policy
                
                if self.use_firebase:
                    self.db.collection('policies').document(policy_id).update(updates)
                else:
                    self._save_to_disk()
                return new_policy
        return None

    # --- Evaluation History ---
    def add_evaluation(self, report: dict):
        import datetime
        record = {
            "timestamp": datetime.datetime.now().isoformat(),
            "report": report
        }
        self._evaluations.append(record)
        
        if self.use_firebase:
            try:
                self.db.collection('evaluations').add(record)
            except Exception as e: print(f"Firebase Add Error: {e}")
        else:
            self._save_evaluations_disk()

    def get_dashboard_stats(self):
        active_policies = len([p for p in self._policies if p.is_active])
        total_evaluations = len(self._evaluations)
        
        violations = 0
        for entry in self._evaluations:
            report = entry.get('report', {})
            risk = report.get('risk_assessment', {})
            if risk.get('overall_rating') == 'High':
                violations += 1

        recent = []
        # Sort by timestamp (assuming self._evaluations is mixed if we did lazy loading? 
        # But we load latest 100 on start. For hackathon, assume memory list is truth source for stats)
        sorted_evals = sorted(self._evaluations, key=lambda x: x['timestamp'])
        
        for entry in reversed(sorted_evals[-5:]):
            report = entry.get('report', {})
            spec = report.get('system_spec', {})
            risk = report.get('risk_assessment', {})
            recent.append({
                "workflow_name": spec.get('primary_purpose', 'Unknown Workflow'),
                "verdict": "PASS" if risk.get('overall_rating') != 'High' else "FAIL", 
                "timestamp": entry.get('timestamp')
            })

        return {
            "traces_analyzed": total_evaluations, 
            "violations": violations,
            "active_policies": active_policies,
            "system_health": 100 if violations == 0 else 98.5, 
            "recent_evaluations": recent
        }

    def get_monitor_data(self):
        import datetime
        now = datetime.datetime.now()
        active_policies = len([p for p in self._policies if p.is_active])
        
        sorted_evals = sorted(self._evaluations, key=lambda x: x['timestamp'])
        
        five_mins_ago = now - datetime.timedelta(minutes=5)
        recent_count = sum(1 for e in self._evaluations if datetime.datetime.fromisoformat(e['timestamp']) > five_mins_ago)
        traces_per_min = round(recent_count / 5, 1) if recent_count > 0 else 0

        total = len(self._evaluations)
        blocked = sum(1 for e in self._evaluations if e['report']['risk_assessment']['overall_rating'] == 'High')
        blocking_rate = round((blocked / total * 100), 1) if total > 0 else 0

        traces = []
        for idx, entry in enumerate(reversed(sorted_evals[-20:])):
            report = entry.get('report', {})
            risk = report.get('risk_assessment', {})
            spec = report.get('system_spec', {})
            verdict = report.get('verdict', {})
            
            rating = risk.get('overall_rating', 'Low')
            status = 'pass'
            if rating == 'High': status = 'block'
            elif rating == 'Medium': status = 'warn'
             
            traces.append({
                "id": f"TR-{1000 + idx}",
                "timestamp": datetime.datetime.fromisoformat(entry['timestamp']).strftime("%H:%M:%S"),
                "agent": spec.get('primary_purpose', 'AI Agent')[:20],
                "action": "Policy Scan",
                "status": status,
                "details": verdict.get('status_label', 'Evaluated')
            })
            
        return {
            "traces_per_min": traces_per_min,
            "blocking_rate": blocking_rate,
            "active_policies": active_policies,
            "traces": traces
        }

    # --- Settings Management ---
    def get_settings(self) -> PolicySettings:
        if self.use_firebase:
            try:
                doc = self.db.collection('settings').document('global').get()
                if doc.exists:
                    return PolicySettings(**doc.to_dict())
            except: pass
            return PolicySettings()
        else:
            if os.path.exists(SETTINGS_FILE):
                try:
                    with open(SETTINGS_FILE, 'r') as f:
                        data = json.load(f)
                        return PolicySettings(**data)
                except: pass
            return PolicySettings()

    def save_settings(self, settings: PolicySettings):
        if self.use_firebase:
            self.db.collection('settings').document('global').set(settings.model_dump())
        else:
            try:
                with open(SETTINGS_FILE, 'w') as f:
                    json.dump(settings.model_dump(), f, indent=2)
            except Exception as e:
                print(f"Failed to save settings: {e}")

# Global instance
policy_db = PolicyStorage()
