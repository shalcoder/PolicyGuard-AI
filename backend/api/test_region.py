"""
Region Compatibility Test Endpoint
This will be deployed to Render and reports which models work in Render's actual region.
"""
from fastapi import APIRouter
from google import genai
from config import settings
import os

router = APIRouter()

@router.get("/test-region")
async def test_region():
    """Test which Gemini models are available in the current deployment region."""
    
    api_keys = settings.GOOGLE_API_KEYS if settings.GOOGLE_API_KEYS else [settings.GOOGLE_API_KEY]
    if not api_keys or not api_keys[0]:
        return {"error": "No API keys configured"}
    
    key = api_keys[0]
    client = genai.Client(api_key=key)
    
    models_to_test = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.5-pro",
        "gemini-3-pro-preview",
        "gemini-3-flash-preview",
        "gemini-exp-1206",
    ]
    
    results = {}
    
    for model_name in models_to_test:
        try:
            # Minimal test to avoid quota drain
            response = client.models.generate_content(
                model=model_name,
                contents="ping"
            )
            results[model_name] = {
                "status": "AVAILABLE",
                "reason": "Success"
            }
        except Exception as e:
            error_str = str(e).lower()
            if "location" in error_str or "400" in error_str or "failed_precondition" in error_str:
                results[model_name] = {
                    "status": "BLOCKED",
                    "reason": "Location not supported"
                }
            elif "429" in error_str or "quota" in error_str:
                results[model_name] = {
                    "status": "AVAILABLE",
                    "reason": "Quota hit (but model is supported)"
                }
            elif "404" in error_str or "not found" in error_str:
                results[model_name] = {
                    "status": "NOT_FOUND",
                    "reason": "Not in catalog"
                }
            else:
                results[model_name] = {
                    "status": "ERROR",
                    "reason": str(e)[:100]
                }
    
    return {
        "server_location": os.getenv("RENDER_REGION", "unknown"),
        "tested_models": results,
        "recommendation": [
            model for model, data in results.items() 
            if data["status"] == "AVAILABLE"
        ]
    }
