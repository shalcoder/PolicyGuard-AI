from fastapi import FastAPI
import uvicorn
import os

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "minimal_server_ok", "pid": os.getpid()}

if __name__ == "__main__":
    print("Starting minimal test server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
