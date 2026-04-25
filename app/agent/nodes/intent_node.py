from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List
from ..state import AgentState
from ...core.config import settings


class IntentResult(BaseModel):
    country_name: str = Field(description="The country being asked about. Empty string if not country-related.")
    requested_fields: List[str] = Field(
        description=(
            "Fields being requested. Choose ONLY from: "
            "population, capital, currency, language, area, region, flag, "
            "timezone, borders, calling_code, subregion"
        )
    )
    is_valid: bool = Field(description="True if the question is about a country's factual data.")
    error_message: str = Field(default="", description="Reason if is_valid is False.")


_parser = PydanticOutputParser(pydantic_object=IntentResult)

# Single human message — avoids system-role restriction on some free models
INTENT_PROMPT = ChatPromptTemplate.from_messages([
    (
        "human",
        """You are an intent extraction engine for a country information service.
Extract the country name and which data fields the user is asking about.
If no specific fields are mentioned, default to: capital, population, region.
If the question is not about a country's factual data, set is_valid=False and country_name to empty string.
Return ONLY a valid JSON object matching this schema:

{format_instructions}

User question: {question}""",
    ),
]).partial(format_instructions=_parser.get_format_instructions())

_llm = ChatOpenAI(
    model=settings.MODEL_NAME,
    temperature=0,
    api_key=settings.OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
    default_headers={
        "HTTP-Referer": settings.APP_URL,
        "X-Title": "Country Info Agent",
    },
)


async def intent_node(state: AgentState) -> AgentState:
    chain = INTENT_PROMPT | _llm | _parser
    try:
        result: IntentResult = await chain.ainvoke({"question": state["user_question"]})
    except Exception as e:
        return {
            **state,
            "country_name":     "",
            "requested_fields": [],
            "is_valid":         False,
            "error_message":    f"Intent extraction failed: {e}",
        }

    return {
        **state,
        "country_name":     result.country_name,
        "requested_fields": result.requested_fields,
        "is_valid":         result.is_valid,
        "error_message":    result.error_message if not result.is_valid else None,
    }
