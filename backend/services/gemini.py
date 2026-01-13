from google import genai
from config import settings
import os

class GeminiService:
    def __init__(self):
        if not settings.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY not found in environment variables. Please check your .env file.")
        
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        self.model_name = settings.GEMINI_MODEL
        
    async def analyze_policy_conflict(self, policy_text: str, workflow_desc: str) -> str:
        prompt = f"""
        You are PolicyGuard AI, a strict compliance officer.
        
        POLICY:
        {policy_text}
        
        PROPOSED AI WORKFLOW:
        {workflow_desc}
        
        TASK:
        Determine if the workflow violates the policy.
        Return a JSON object with:
        - status: "PASS" | "BLOCK" | "CONDITIONAL"
        - reasoning: "Explanation..."
        - violations: ["List of specific violations..."]
        """
        
        # New SDK usage
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text

    async def summarize_policy(self, text: str) -> str:
        prompt = f"Summarize the following corporate policy in one concise sentence (max 20 words). Focus on what is restricted:\n\n{text[:5000]}"
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text
