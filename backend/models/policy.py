from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class PolicyDocument(BaseModel):
    name: str
    content: str
    summary: Optional[str] = None

class WorkflowDefinition(BaseModel):
    name: str
    description: str # The raw JSON or text description

class Verdict(str, Enum):
    PASS = "PASS"
    FAIL = "BLOCK" 
    WARN = "CONDITIONAL"

class Violation(BaseModel):
    policy_name: str
    details: str
    severity: str

class GuardrailResult(BaseModel):
    verdict: Verdict
    reasoning: str
    violations: List[Violation]
