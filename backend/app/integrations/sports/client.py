from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import date

from app.integrations.shared_models import MatchData


class SportsAPIClient(ABC):
    @abstractmethod
    async def get_matches_for_date(self, target_date: date, locale: str) -> list[MatchData]:
        raise NotImplementedError

    @abstractmethod
    async def get_match_details(self, external_match_id: str, locale: str) -> MatchData | None:
        raise NotImplementedError
