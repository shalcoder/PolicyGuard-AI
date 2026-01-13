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
        You are PolicyGuard AI, an expert AI Governance Officer.
        
        YOUR GOAL:
        Analyze the PROPOSED AI WORKFLOW against the provided CORPORATE POLICIES.
        Produce a comprehensive "AI Deployment Risk & Compliance Report" as a structured JSON object.
        
        INPUT CONTEXT:
        
        --- CORPORATE POLICIES ---
        {policy_text}
        
        --- PROPOSED AI WORKFLOW (USER INPUT) ---
        {workflow_desc}
        
        --- INSTRUCTIONS ---
        1. INFER the system specification from the user input (even if brief).
        2. DETECT all data categories and flows.
        3. MAP system behavior to policy clauses.
        4. ASSESS risk severity.
        5. EXTRACT specific evidence quotes from input.
        6. RECOMMEND actionable headers.
        
        OUTPUT FORMAT (Strict JSON):
        {{
            "system_spec": {{
                "summary": "One sentence summary of what the system does.",
                "primary_purpose": "...",
                "decision_authority": "...",
                "automation_level": "...",
                "deployment_stage": "...",
                "geographic_exposure": ["List of regions"]
            }},
            "data_map": {{
                "data_categories_detected": ["List specific data types"],
                "data_flow_source": "...",
                "data_storage_retention": "...",
                "cross_border_transfer": "..."
            }},
            "policy_matrix": [
                {{
                    "policy_area": "Name of policy/area (e.g. Data Minimization)",
                    "status": "Compliant" | "Partial Compliance" | "At Risk" | "Non-Compliant",
                    "reason": "Why?"
                }}
            ],
            "risk_assessment": {{
                "overall_score": 0-100, #(100 = Safe, 0 = Critical Risk)
                "overall_rating": "High" | "Medium" | "Low",
                "breakdown": {{
                    "Regulatory": "High" | "Medium" | "Low",
                    "User Harm": "High" | "Medium" | "Low",
                    "Reputational": "High" | "Medium" | "Low"
                }},
                "confidence_score": "High" | "Medium" | "Low"
            }},
            "evidence": [
                {{
                    "source_doc": "Workflow Input" | "Policy",
                    "snippet": "Exact text quote supporting findings"
                }}
            ],
            "recommendations": [
                {{
                    "title": "Short generic title",
                    "type": "Blocking" | "Advisory" | "Informational",
                    "description": "Specific action required",
                    "related_policy": "Policy name"
                }}
            ],
            "verdict": {{
                "approved": boolean,
                "status_label": "Approved for Pilot" | "Not Approved",
                "approval_conditions": ["Condition 1", "Condition 2"]
            }}
        }}
        """
        
        # New SDK usage
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        return response.text

    async def summarize_policy(self, text: str) -> str:
        prompt = f"Summarize the following corporate policy in one concise sentence (max 20 words). Focus on what is restricted:\n\n{text[:5000]}"
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text
