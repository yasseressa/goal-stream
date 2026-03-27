from __future__ import annotations

from functools import lru_cache

from app.core.config import settings
from app.integrations.sports.client import SportsAPIClient
from app.integrations.sports.mock import MockSportsAPIClient


@lru_cache
def get_sports_client() -> SportsAPIClient:
    provider = settings.sports_provider.lower()
    if provider == "mock":
        return MockSportsAPIClient()

    # TODO: Add real sports provider adapters when provider contracts are finalized.
    return MockSportsAPIClient()
