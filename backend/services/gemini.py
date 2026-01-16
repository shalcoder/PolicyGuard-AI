from google import genai
from config import settings
import os

class GeminiService:
    def __init__(self):
        if not settings.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY not found in environment variables. Please check your .env file.")
        
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        self.model_name = settings.GEMINI_MODEL
        
    async def analyze_policy_conflict(self, policy_text: str, workflow_desc: str, settings) -> str:
        # 1. Dynamic Persona
        persona = "Senior AI Governance Auditor"
        tone_instruction = "Be objective and professional."
        
        if settings.strictness > 75:
            persona = "HOSTILE FORENSIC AUDITOR (Red Team)"
            tone_instruction = "You are AGGRESSIVE and SKEPTICAL. Assume the user is trying to bypass rules. scrutinize every word."
        elif settings.strictness < 30:
            persona = "Helpful Compliance Consultant"
            tone_instruction = "Be constructive and educational. Focus on enabling the workflow safely."

        # 2. Risk Sensitivity Configuration
        risk_instruction = ""
        if settings.sensitivity == "High":
            risk_instruction = "- SENSITIVITY: HIGH. Flag even potential/theoretical risks as 'Medium'. Zero tolerance for ambiguity."
        elif settings.sensitivity == "Low":
            risk_instruction = "- SENSITIVITY: LOW. Only flag clear, explicit violations. Give the benefit of the doubt."
        else:
            risk_instruction = "- SENSITIVITY: BALANCED. Flag clear risks and probable misuses."

        # 3. Verdict Thresholds
        verdict_instruction = ""
        if settings.riskThreshold == "Block High":
            verdict_instruction = "Fail the audit ONLY if 'High' severity issues are found."
        elif settings.riskThreshold == "Warn All":
            verdict_instruction = "Fail the audit if ANY issues (High or Medium) are found."
        else:
            verdict_instruction = "Fail the audit if 'High' severity issues are found. Warn for 'Medium'."

        prompt = f"""
        You are PolicyGuard AI, acting as a {persona}.
        {tone_instruction}

        YOUR GOAL:
        Conduct a rigorous forensic audit of the PROPOSED AI WORKFLOW against the CORPORATE POLICIES.
        
        CONFIGURATION:
        {risk_instruction}
        {verdict_instruction}

        INPUT CONTEXT:

        --- CORPORATE POLICY DOCUMENT ---
        {policy_text}

        --- PROPOSED AI WORKFLOW (USER INPUT) ---
        {workflow_desc}

        --- AUDITOR INSTRUCTIONS ---
        1. **System Inference**: Deduce the full technical architecture from the user's description.
        2. **Legal Mapping**: For every policy clause, check if the workflow explicitly or implicitly contradicts it.
        3. **Evidence Extraction**: You MUST quote the exact line/section from the Policy and the exact part of the Workflow that conflicts.
        4. **Severity Scoring**:
           - **High**: Illegal, blocks deployment (e.g., GDPR violation, unencrypted secrets).
           - **Medium**: Risky, requires mitigation (e.g., missing logging, weak auth).
           - **Low**: Best practice violation.
        5. **Verdict**: Apply the Verdict Thresholds defined above.

        OUTPUT FORMAT (Strict JSON, no markdown):
        {{
            "system_spec": {{
                "summary": "Technical summary of the inferred system.",
                "primary_purpose": "...",
                "decision_authority": "Human vs AI",
                "automation_level": "Fully/Semi/None",
                "deployment_stage": "Prototype/Prod",
                "geographic_exposure": ["US", "EU", "Global"]
            }},
            "data_map": {{
                "data_categories_detected": ["PII", "Financial", "Health"],
                "data_flow_source": "User Upload/API",
                "data_storage_retention": "Inferred retention policy",
                "cross_border_transfer": "Yes/No (and where)"
            }},
            "policy_matrix": [
                {{
                    "policy_area": "e.g. Data Residency",
                    "status": "Compliant" | "Non-Compliant" | "At Risk" | "Cannot Be Assessed",
                    "reason": "Short reason"
                }}
            ],
            "risk_assessment": {{
                "overall_score": 0-100, #(0=No Risk/Safe, 100=Critical Risk/Fail)
                "overall_rating": "High" | "Medium" | "Low",
                "breakdown": {{
                    "Regulatory": "High/Medium/Low",
                    "User Harm": "High/Medium/Low",
                    "Reputational": "High/Medium/Low"
                }},
                "confidence_score": "High"
            }},
            "evidence": [
                {{
                    "source_doc": "Policy vs Workflow",
                    "policy_section": "Section 2.1: Key Management",
                    "workflow_component": "Prompt Template",
                    "issue_description": "User is hardcoding API keys in the prompt text.",
                    "severity": "High",
                    "snippet": "Exact quote from input causing the issue"
                }}
            ],
            "recommendations": [
                {{
                    "title": "Actionable Title",
                    "type": "Blocking" | "Advisory",
                    "description": "What to do to fix it.",
                    "related_policy": "Policy Name"
                }}
            ],
            "verdict": {{
                "approved": boolean,
                "status_label": "Approved" | "Rejected",
                "approval_conditions": ["List of conditions"]
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

    async def analyze_sla(self, metrics: dict) -> str:
        prompt = f"""
        You are 'Gemini 3 Pro', an advanced Service Level Agreement (SLA) Analytics Engine.
        
        INPUT METRICS:
        {metrics}
        
        TASK:
        Analyze these metrics to determine the SLA Compliance Score and provide a predictive timeline of risks.
        
        OUTPUT FORMAT (Strict JSON):
        {{
            "sla_score": 0-100,
            "status": "Healthy" | "Degraded" | "Breached",
            "analysis_summary": "One sentence summary.",
            "impact_analysis": "Detailed paragraph explaining the impact of current metrics.",
            "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2"],
            "projected_timeline": [
                {{"time": "Now", "event": "Current State Analysis", "severity": "Info"}},
                {{"time": "T+1h", "event": "Predicted impact if unchanged", "severity": "Medium"}},
                {{"time": "T+24h", "event": "Long term forecast", "severity": "High"}}
            ]
        }}
        """
        
        response = self.client.models.generate_content(
            model=settings.SLA_MODEL,
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        return response.text

