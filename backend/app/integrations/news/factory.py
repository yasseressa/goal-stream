from __future__ import annotations

from functools import lru_cache

from app.core.config import settings
from app.integrations.news.client import NewsAPIClient
from app.integrations.news.mock import MockNewsAPIClient


@lru_cache
def get_news_client() -> NewsAPIClient:
    provider = settings.news_provider.lower()
    if provider == "mock":
        return MockNewsAPIClient()

    # TODO: Add real news provider adapters when provider contracts are finalized.
    return MockNewsAPIClient()
