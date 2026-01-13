from fastapi import APIRouter, UploadFile, File, HTTPException
from models.policy import PolicyDocument, WorkflowDefinition, GuardrailResult, Verdict, Violation
from services.ingest import PolicyIngestor
from services.gemini import GeminiService
from services.storage import policy_db
import json

router = APIRouter()
ingestor = PolicyIngestor()
gemini = GeminiService()

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
    
    policy = PolicyDocument(
        name=file.filename,
        content=cleaned_text,
        summary=summary
    )
    
    # Save to In-Memory DB
    policy_db.add_policy(policy)
    
    return policy

@router.get("/policies", response_model=list[PolicyDocument])
async def get_policies():
    return policy_db.get_all_policies()

@router.post("/evaluate", response_model=GuardrailResult)
async def evaluate_workflow(workflow: WorkflowDefinition):
    try:
        print(f"Evaluating workflow: {workflow.name}")
        # Retrieve active policies
        policies = policy_db.get_all_policies()
        print(f"Active policies count: {len(policies)}")
        
        if not policies:
            print("No policies found returning WARN")
            # If no policies, warn the user
            return GuardrailResult(
                verdict=Verdict.WARN,
                reasoning="No active policies found. The workflow passes by default, but this is unsafe.",
                violations=[]
            )

        # context construction (Concatenate all policies)
        policy_context = "\n\n".join([f"Policy '{p.name}':\n{p.content}" for p in policies])
        
        # Real Gemini Analysis
        print("Calling Gemini...")
        try:
            analysis_json_str = await gemini.analyze_policy_conflict(policy_context, workflow.description)
        except Exception as e:
            print(f"Gemini API Error: {e}")
            raise HTTPException(status_code=503, detail=f"AI Service Unavailable: {str(e)}")
            
        print(f"Gemini Response: {analysis_json_str[:100]}...")
        
        # Clean JSON string (remove markdown fences if present)
        clean_json = analysis_json_str.replace("```json", "").replace("```", "").strip()
        
        try:
            result_data = json.loads(clean_json)
            
            # Map response to model
            verdict_str = result_data.get("status", "CONDITIONAL").upper()
            verdict = Verdict.PASS
            if verdict_str == "BLOCK" or verdict_str == "FAIL":
                verdict = Verdict.FAIL
            elif verdict_str == "CONDITIONAL":
                verdict = Verdict.WARN
                
            violations = []
            for v in result_data.get("violations", []):
                violations.append(Violation(
                    policy_name="General", 
                    details=v, 
                    severity="High"
                ))

            return GuardrailResult(
                verdict=verdict,
                reasoning=result_data.get("reasoning", "Analysis complete."),
                violations=violations
            )
            
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")
            # Fallback if LLM returns bad JSON
            return GuardrailResult(
                verdict=Verdict.WARN,
                reasoning=f"Raw Analysis: {analysis_json_str}",
                violations=[]
            )
    except Exception as e:
        print(f"Server Error during evaluation: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
