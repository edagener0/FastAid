from functools import lru_cache
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "FastAid API"
    frontend_base_url: str = "http://localhost:5173"
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:5173", "http://localhost:4173"]
    database_url: str | None = None
    database_host : str | None = None
    postgres_user: str | None = None
    postgres_password: str | None = None
    postgres_db: str | None = None
    gemini_api_key: str | None = None
    twilio_account_sid: str | None = None
    twilio_auth_token: str | None = None
    twilio_sender_number: str | None = None
    brisa_url: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
