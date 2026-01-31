import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "PolicyGuard AI"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # AI Config
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    # Using Gemini 1.5 Flash 001 for stability
    GEMINI_MODEL: str = "gemini-1.5-flash-001"
    EMBEDDING_MODEL: str = "text-embedding-004"
    
    # DB Config
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/policyguard")
    WEAVIATE_URL: str = os.getenv("WEAVIATE_URL", "http://localhost:8080")
    
    # SLA Config
    # Using Gemini 1.5 Pro 001 for stability
    SLA_MODEL: str = "gemini-1.5-pro-001"
    
    # Firestore Config
    # Can be a path to JSON or the raw JSON string itself
    FIREBASE_CREDENTIALS: str = os.getenv("FIREBASE_CREDENTIALS", "serviceAccountKey.json")
    USE_FIREBASE: bool = os.getenv("USE_FIREBASE", "true").lower() == "true"

settings = Settings()
