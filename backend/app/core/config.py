from __future__ import annotations

from functools import lru_cache

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env", "backend/.env.example"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Melbet Live API"
    app_env: str = "development"
    app_debug: bool = True
    api_v1_prefix: str = "/api/v1"

    secret_key: str = "change-me-to-a-long-random-secret"
    access_token_expire_minutes: int = 60

    log_level: str = "INFO"
    log_json: bool = False
    sports_provider: str = "mock"
    news_provider: str = "mock"
    cache_default_ttl_seconds: int = 300
    cache_redirect_config_ttl_seconds: int = 30

    database_host: str = "localhost"
    database_port: int = 5432
    database_name: str = "melbet_live"
    database_user: str = "melbet"
    database_password: str = "melbet"

    @computed_field
    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.database_user}:{self.database_password}"
            f"@{self.database_host}:{self.database_port}/{self.database_name}"
        )

    @computed_field
    @property
    def sync_database_url(self) -> str:
        return (
            f"postgresql+psycopg://{self.database_user}:{self.database_password}"
            f"@{self.database_host}:{self.database_port}/{self.database_name}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
