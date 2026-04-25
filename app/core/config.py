from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    OPENROUTER_API_KEY: str
    MODEL_NAME: str = "nvidia/nemotron-3-super-120b-a12b:free"
    APP_URL: str = "http://localhost:8000"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    API_TIMEOUT_SEC: int = 10
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"


settings = Settings()
