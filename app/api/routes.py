from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from ..agent.graph import agent
from ..agent.state import AgentState

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str


class AgentResponse(BaseModel):
    answer: str
    country_detected: Optional[str]
    fields_requested: List[str]
    sources: List[str]


@router.post("/ask", response_model=AgentResponse)
async def ask(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(status_code=422, detail="Question cannot be empty.")

    initial_state: AgentState = {
        "user_question":    request.question,
        "country_name":     None,
        "requested_fields": [],
        "is_valid":         True,
        "error_message":    None,
        "raw_country_data": None,
        "tool_error":       None,
        "final_answer":     None,
        "sources_used":     [],
    }

    result = await agent.ainvoke(initial_state)

    return AgentResponse(
        answer=result["final_answer"] or "No answer generated.",
        country_detected=result.get("country_name") or None,
        fields_requested=result.get("requested_fields", []),
        sources=result.get("sources_used", []),
    )
