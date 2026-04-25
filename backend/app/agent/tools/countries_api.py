import httpx
from ...core.exceptions import CountryNotFoundError, RestCountriesAPIError

BASE_URL = "https://restcountries.com/v3.1"

FIELD_MAP = {
    "population":   "population",
    "capital":      "capital",
    "currency":     "currencies",
    "language":     "languages",
    "area":         "area",
    "region":       "region",
    "flag":         "flags",
    "timezone":     "timezones",
    "borders":      "borders",
    "calling_code": "idd",
    "subregion":    "subregion",
    "independent":  "independent",
    "landlocked":   "landlocked",
    "un_member":    "unMember",
}


async def fetch_country(country_name: str, fields: list[str]) -> dict:
    api_fields = list({FIELD_MAP.get(f, f) for f in fields}) + ["name"]
    params = {"fields": ",".join(api_fields)}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{BASE_URL}/name/{country_name}",
                params=params,
            )
    except httpx.TimeoutException:
        raise RestCountriesAPIError("The data source timed out. Please try again.")
    except httpx.RequestError as e:
        raise RestCountriesAPIError(f"Network error: {e}")

    if response.status_code == 404:
        raise CountryNotFoundError(f"Country '{country_name}' not found in the database.")

    if response.status_code != 200:
        raise RestCountriesAPIError(f"REST Countries API returned {response.status_code}.")

    results = response.json()
    return _pick_best_match(results, country_name)


def _pick_best_match(results: list, query: str) -> dict:
    query_lower = query.lower()
    for r in results:
        official = r.get("name", {}).get("official", "").lower()
        common   = r.get("name", {}).get("common", "").lower()
        if query_lower in (official, common):
            return r
    return results[0]
