from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="PolicyGuard AI Control Plane",
    description="Backend for PolicyGuard AI - Pre-deployment Policy Governance",
    version="0.1.0",
)

from api.routes import router as api_router
app.include_router(api_router, prefix="/api/v1")

# CORS - Allow everything for Hackathon MVP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PolicyGuard AI Control Plane Online", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
