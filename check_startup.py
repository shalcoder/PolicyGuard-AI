
import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'backend'))

print("Attempting to import config...")
try:
    from backend.config import settings
    print(f"Config loaded. USE_FIREBASE={settings.USE_FIREBASE}")
except Exception as e:
    print(f"Config import failed: {e}")

print("Attempting to import services.storage...")
try:
    from backend.services.storage import policy_db
    print("Storage loaded.")
except Exception as e:
    print(f"Storage import failed: {e}")

print("Attempting to import main...")
try:
    from backend.main import app
    print("Main app loaded successfully.")
except Exception as e:
    print(f"Main import failed: {e}")
