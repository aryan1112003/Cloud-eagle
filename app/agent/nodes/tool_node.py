from ..state import AgentState
from ..tools.countries_api import fetch_country
from ...core.exceptions import CountryNotFoundError, RestCountriesAPIError


async def tool_node(state: AgentState) -> AgentState:
    if not state["is_valid"]:
        return state

    try:
        data = await fetch_country(
            country_name=state["country_name"],
            fields=state["requested_fields"],
        )
        return {**state, "raw_country_data": data, "tool_error": None}

    except CountryNotFoundError as e:
        return {**state, "raw_country_data": None, "tool_error": str(e)}

    except RestCountriesAPIError as e:
        return {**state, "raw_country_data": None, "tool_error": f"Data source error: {e}"}

    except Exception as e:
        return {**state, "raw_country_data": None, "tool_error": f"Unexpected error: {e}"}
