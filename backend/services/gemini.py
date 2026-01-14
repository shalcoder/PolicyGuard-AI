from google import genai
from config import settings
import os

class GeminiService:
    def __init__(self):
        if not settings.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY not found in environment variables. Please check your .env file.")
        
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        self.model_name = settings.GEMINI_MODEL
        print(f"DEBUG: GeminiService initialized with model: {self.model_name}")
        
    def get_prompt_template(self) -> str:
        # Returns the core system prompt for hashing 
        # (excluding dynamic inputs for stable template fingerprinting)
        return """
        You are PolicyGuard AI, a Senior AI Governance Auditor conducting a DEMONSTRATIVE COMPLIANCE ANALYSIS.
        Identify plausible failure modes where the PROPOSED AI WORKFLOW semantically conflicts with CORPORATE POLICIES.
        Analyses are presented as ANALOGIES to known failure classes, not as certain predictions.
        --- AUDITOR INSTRUCTIONS (CRITICAL) ---
        1. **Semantic Conflict Detection**
        2. **Relational Risk Modeling**
        3. **Forensic Evidence**
        4. **Governance Traceability**
        """

    async def analyze_policy_conflict(self, policy_text: str, workflow_desc: str) -> str:
        import hashlib
        import datetime
        
        timestamp = datetime.datetime.utcnow().isoformat()
        report_id = hashlib.sha256(f"{policy_text}{workflow_desc}{timestamp}".encode()).hexdigest()[:16]

        prompt = f"""
        You are an ADVERSARIAL GOVERNANCE AUDITOR specializing in FINANCIAL DECISION AGENTS.
        
        YOUR MISSION:
        Act as a pre-deployment FIDUCIARY SHIELD. You do not decide what to build; you generate the FORENSIC PROOF of what the organization knew before the system was deployed.
        
        --- AUDITOR PHILOSOPHY ---
        1. **Pre-Deployment Awareness**: Your goal is to eliminate "plausible deniability" by documenting semantic risks before they manifest in production.
        2. **Cross-Policy Contradiction**: Detect when the workflow violates multiple policies simultaneously, leveraging contradictions that could be legally toxic.
        3. **Semantic Proxy Bias**: Identify innocent-sounding features (e.g., "shopping velocity") that act as illegal proxies for protected demographics (Redlining).
        4. **Catastrophic Consequence Analysis**: Link every violation to its specific real-world fallout—precision-fines, class-action lawsuits, or regulatory shutdown.
        
        INPUT CONTEXT:
        --- CORPORATE POLICIES ---
        {policy_text}
        
        --- PROPOSED AI WORKFLOW ---
        {workflow_desc}
        
        OUTPUT FORMAT (Strict JSON, no markdown fences):
        {{
            "report_id": "{report_id}",
            "timestamp": "{timestamp}",
            "system_spec": {{
                "summary": "Technical summary.",
                "primary_purpose": "...",
                "decision_authority": "...",
                "automation_level": "...",
                "deployment_stage": "...",
                "geographic_exposure": ["Region"]
            }},
            "data_map": {{
                "data_categories_detected": ["List"],
                "data_flow_source": "Source",
                "data_storage_retention": "Retention",
                "cross_border_transfer": "Transfer"
            }},
            "policy_matrix": [
                {{
                    "policy_area": "Policy Name",
                    "status": "Compliant" | "Non-Compliant" | "At Risk",
                    "reason": "..."
                }}
            ],
            "risk_assessment": {{
                "overall_score": 0-100,
                "overall_rating": "High" | "Medium" | "Low",
                "breakdown": {{ "Regulatory": "High", "Financial": "High", "User Harm": "High", "Reputational": "Low" }},
                "confidence_score": "High"
            }},
            "evidence": [
                {{
                    "source_doc": "Workflow",
                    "policy_section": "...",
                    "workflow_component": "...",
                    "issue_description": "...",
                    "severity": "Critical" | "High" | "Medium" | "Low",
                    "snippet": "..."
                }}
            ],
            "risk_simulations": [
                {{
                    "scenario_title": "Short title",
                    "failure_mode": "Plausible Failure Class",
                    "description": "How the fail mode manifests via analogy.",
                    "plausibility_grounding": "Why this specific architecture is susceptible.",
                    "severity": "Critical" | "High" | "Medium" | "Low",
                    "violated_clause": "Linking policy section",
                    "confidence_level": "High"
                }}
            ],
            "recommendations": [
                {{
                    "title": "...",
                    "type": "Blocking" | "Advisory",
                    "description": "...",
                    "related_policy": "..."
                }}
            ],
            "verdict": {{
                "approved": boolean,
                "status_label": "Approved" | "Not Approved",
                "approval_conditions": ["Condition"],
                "catastrophic_consequence": "Explicit real-world fallout (e.g. 'This triggers a $200M CFPB fine for proxy-based redlining.')"
            }}
        }}
        """
        
        # New SDK usage
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={'response_mime_type': 'application/json'}
            )
            return response.text
        except Exception as e:
            if "429" in str(e):
                raise Exception(f"AI Service Unavailable: 429 RESOURCE_EXHAUSTED. The Google AI Studio quota for {self.model_name} has been reached. Please try again in 60 seconds.")
            raise e

    async def summarize_policy(self, text: str) -> str:
        prompt = f"Summarize the following corporate policy in one concise sentence (max 20 words). Focus on what is restricted:\n\n{text[:5000]}"
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text
