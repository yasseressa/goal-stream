from __future__ import annotations

import logging
from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import CacheBackend, CacheKeys
from app.core.constants import MATCH_DETAILS_CACHE_TTL_SECONDS
from app.integrations.shared_models import MatchData, NewsArticleData
from app.integrations.sports.client import SportsAPIClient
from app.repositories.stream_link import StreamLinkRepository
from app.services.news_service import NewsService

logger = logging.getLogger(__name__)


class MatchService:
    def __init__(self, session: AsyncSession, sports_client: SportsAPIClient, news_service: NewsService, cache: CacheBackend) -> None:
        self.stream_repository = StreamLinkRepository(session)
        self.sports_client = sports_client
        self.news_service = news_service
        self.cache = cache

    async def get_match_details(self, match_id: str, locale: str) -> tuple[MatchData, object | None, bool, list[NewsArticleData]]:
        match = await self._get_cached_match(match_id, locale)
        stream_link = await self.stream_repository.get_by_external_match_id(match_id)
        can_show_player = self._can_show_player(match, stream_link)
        related_news = await self.news_service.get_related_news(
            match_id=match_id,
            locale=locale,
            team_names=[match.home_team, match.away_team],
            competition=match.competition_name,
            match_context=f"{match.home_team} vs {match.away_team}",
        )
        logger.info(
            "match_details_loaded",
            extra={"match_id": match_id, "locale": locale, "can_show_player": can_show_player},
        )
        return match, stream_link, can_show_player, related_news

    async def _get_cached_match(self, match_id: str, locale: str) -> MatchData:
        cache_key = CacheKeys.match_details(match_id, locale)
        cached = self.cache.get(cache_key)
        if cached is not None:
            return cached

        match = await self.sports_client.get_match_details(match_id, locale)
        if match is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")

        self.cache.set(cache_key, match, MATCH_DETAILS_CACHE_TTL_SECONDS)
        return match

    def _can_show_player(self, match: MatchData, stream_link) -> bool:
        today = datetime.now(UTC).date()
        return bool(
            match.start_time.date() == today
            and stream_link is not None
            and stream_link.show_stream
            and stream_link.stream_url
        )
