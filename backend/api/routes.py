from fastapi import APIRouter, UploadFile, File, HTTPException
from models.policy import PolicyDocument, WorkflowDefinition, ComplianceReport
from models.settings import PolicySettings
from services.ingest import PolicyIngestor
from services.gemini import GeminiService
from services.storage import policy_db
import json

router = APIRouter()
ingestor = PolicyIngestor()
gemini = GeminiService()
import datetime

@router.post("/policies/upload", response_model=PolicyDocument)
async def upload_policy(file: UploadFile = File(...)):
    if not file.filename.endswith(('.txt', '.pdf', '.docx', '.md', '.json')):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    content = await file.read()
    # Basic decoding
    text_content = content.decode('utf-8', errors='ignore')
    
    # Ingest
    cleaned_text = await ingestor.ingest_text(file.filename, text_content)

    # Analyze with Gemini (Immediate Feedback)
    try:
        print(f"Summarizing policy: {file.filename}")
        summary = await gemini.summarize_policy(cleaned_text)
    except Exception as e:
        print(f"Gemini Error during summary: {e}")
        # import traceback
        # traceback.print_exc()
        summary = "Summary unavailable (AI Error)"
    
    import uuid
    policy_id = str(uuid.uuid4())
    
    policy = PolicyDocument(
        id=policy_id,
        name=file.filename,
        content=cleaned_text,
        summary=summary,
        status="Pending Review", # Require human confirmation
        last_updated=datetime.datetime.utcnow().isoformat()
    )
    
    # Save to In-Memory DB
    policy_db.add_policy(policy)
    
    return policy

@router.get("/policies", response_model=list[PolicyDocument])
async def get_policies():
    return policy_db.get_all_policies()

@router.delete("/policies/{policy_id}")
async def delete_policy(policy_id: str):
    success = policy_db.delete_policy(policy_id)
    if not success:
        raise HTTPException(status_code=404, detail="Policy not found")
    return {"status": "deleted", "id": policy_id}

@router.put("/policies/{policy_id}/status")
async def update_policy_status(policy_id: str, status: str):
    success = policy_db.update_policy_status(policy_id, status)
    if not success:
        raise HTTPException(status_code=404, detail="Policy not found")
    return {"status": "updated", "id": policy_id, "new_status": status}

@router.post("/evaluate", response_model=ComplianceReport)
async def evaluate_workflow(workflow: WorkflowDefinition):
    try:
        print(f"Evaluating workflow: {workflow.name}")
        # Retrieve active policies
        policies = policy_db.get_all_policies()
        print(f"Active policies count: {len(policies)}")
        
        if not policies:
            print("No policies found returning Error")
            # If no policies, cannot generate report
            raise HTTPException(status_code=400, detail="No active policies found. Please upload a policy first.")

        # context construction (Concatenate all policies)
        policy_context = "\n\n".join([f"Policy '{p.name}':\n{p.content}" for p in policies])
        
        # Real Gemini Analysis
        print("Calling Gemini...")
        print(f"Workflow Desc: {workflow.description[:100]}...")
        try:
            analysis_json_str = await gemini.analyze_policy_conflict(policy_context, workflow.description)
        except Exception as e:
            print(f"Gemini API Error: {e}")
            raise HTTPException(status_code=503, detail=f"AI Service Unavailable: {str(e)}")
            
        print(f"Gemini Response Length: {len(analysis_json_str)}")
        
        # Clean JSON string (remove markdown fences if present - though handled by SDK mostly)
        # Robust cleaning using regex
        import re
        # Find the first JSON object or array
        match = re.search(r'(\{.*\}|\[.*\])', analysis_json_str, re.DOTALL)
        if match:
            clean_json = match.group(1)
        else:
            clean_json = analysis_json_str.strip()
            
        print(f"Cleaned JSON Preview: {clean_json[:100]}...")
        
        try:
            result_data = json.loads(clean_json)
            
            # --- Forensic Segment Generation ---
            import hashlib
            p_hash = hashlib.sha256(policy_context.encode()).hexdigest()[:12]
            w_hash = hashlib.sha256(workflow.description.encode()).hexdigest()[:12]
            t_hash = hashlib.sha256(gemini.get_prompt_template().encode()).hexdigest()[:12]
            m_ver = gemini.model_name
            
            # Combined for tamper-evidence
            combined_raw = f"{p_hash}|{w_hash}|{t_hash}|{m_ver}"
            c_digest = hashlib.sha256(combined_raw.encode()).hexdigest()
            
            result_data["forensic_digest"] = {
                "policy_hash": p_hash,
                "workflow_hash": w_hash,
                "model_version": m_ver,
                "prompt_hash": t_hash,
                "combined_digest": c_digest
            }
            
            # Direct Pydantic validation
            report = ComplianceReport(**result_data)
            return report
            
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")
            print(f"Bad JSON: {analysis_json_str}")
            raise HTTPException(status_code=500, detail="AI returned invalid JSON format")
        except Exception as e:
            print(f"Validation Error: {e}")
            raise HTTPException(status_code=500, detail=f"Report Validation Failed: {str(e)}")

    except Exception as e:
        print(f"Server Error during evaluation: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/settings", response_model=PolicySettings)
async def get_settings():
    return policy_db.get_settings()

@router.post("/settings", response_model=PolicySettings)
async def update_settings(settings: PolicySettings):
    policy_db.save_settings(settings)
    return settings

@router.post("/simulate")
async def run_simulation():
    # In a real scenario, this would trigger a test eval against a known "bad" input
    # For the MVP, we mock the delay and return the structured result for the frontend
    import asyncio
    await asyncio.sleep(2) # Simulate processing time
    
    return {
        "status": "completed",
        "risks_found": 2,
        "details": [
            "Data Privacy Violation: PII detected in prompt template without encryption flag.",
            "Region Mismatch: Accessing EU user data from US server region."
        ]
    }
