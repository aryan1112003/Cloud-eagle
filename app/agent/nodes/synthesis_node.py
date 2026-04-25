import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from ..state import AgentState
from ...core.config import settings


# Single human message — avoids system-role restriction on some free models
SYNTHESIS_PROMPT = ChatPromptTemplate.from_messages([
    (
        "human",
        """You are a factual assistant for country information.
Answer the user's question using ONLY the data provided below.
Be concise, accurate, and conversational.
If data for a specific field is missing, say so clearly.
Never hallucinate data that was not in the provided payload.

User question: {question}

Country data retrieved from REST Countries API:
{country_data}

Provide a clear, direct answer.""",
    ),
])

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


async def synthesis_node(state: AgentState) -> AgentState:
    if not state["is_valid"]:
        msg = state.get("error_message") or "Please ask a question about a specific country."
        return {**state, "final_answer": f"I can only answer questions about countries. {msg}"}

    if state.get("tool_error"):
        return {**state, "final_answer": f"Sorry, I couldn't retrieve that data: {state['tool_error']}"}

    if not state.get("raw_country_data"):
        return {**state, "final_answer": "No data was found for that country."}

    chain = SYNTHESIS_PROMPT | _llm
    response = await chain.ainvoke({
        "question":     state["user_question"],
        "country_data": json.dumps(state["raw_country_data"], indent=2),
    })

    return {
        **state,
        "final_answer": response.content,
        "sources_used": ["restcountries.com/v3.1"],
    }
