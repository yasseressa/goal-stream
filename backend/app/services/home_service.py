from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta

from app.core.cache import CacheBackend, CacheKeys
from app.core.constants import HOME_MATCHES_CACHE_TTL_SECONDS
from app.integrations.shared_models import MatchData, NewsArticleData
from app.integrations.sports.client import SportsAPIClient
from app.services.news_service import NewsService

logger = logging.getLogger(__name__)


class HomeService:
    def __init__(self, sports_client: SportsAPIClient, news_service: NewsService, cache: CacheBackend) -> None:
        self.sports_client = sports_client
        self.news_service = news_service
        self.cache = cache

    async def get_home_data(self, locale: str) -> dict[str, list[MatchData] | list[NewsArticleData]]:
        today = datetime.now(UTC).date()
        yesterday_matches = await self._get_matches_for_bucket(today - timedelta(days=1), locale, "yesterday")
        today_matches = await self._get_matches_for_bucket(today, locale, "today")
        tomorrow_matches = await self._get_matches_for_bucket(today + timedelta(days=1), locale, "tomorrow")
        latest_news = await self.news_service.get_latest_news(locale)

        logger.info("home_data_loaded", extra={"locale": locale})
        return {
            "yesterday_matches": yesterday_matches,
            "today_matches": today_matches,
            "tomorrow_matches": tomorrow_matches,
            "latest_news": latest_news,
        }

    async def _get_matches_for_bucket(self, target_date, locale: str, bucket: str) -> list[MatchData]:
        cache_key = CacheKeys.home_matches(locale, bucket)
        cached = self.cache.get(cache_key)
        if cached is not None:
            return cached

        matches = await self.sports_client.get_matches_for_date(target_date, locale)
        self.cache.set(cache_key, matches, HOME_MATCHES_CACHE_TTL_SECONDS)
        return matches
