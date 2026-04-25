from typing import TypedDict, Optional, List


class AgentState(TypedDict):
    # Input
    user_question: str

    # After intent node
    country_name: Optional[str]
    requested_fields: List[str]
    is_valid: bool
    error_message: Optional[str]

    # After tool node
    raw_country_data: Optional[dict]
    tool_error: Optional[str]

    # After synthesis node
    final_answer: Optional[str]
    sources_used: List[str]
