import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "PolicyGuard AI"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # AI Config
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GEMINI_MODEL: str = "gemini-1.5-flash" # Valid model from list
    
    # DB Config
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/policyguard")
    WEAVIATE_URL: str = os.getenv("WEAVIATE_URL", "http://localhost:8080")

settings = Settings()
