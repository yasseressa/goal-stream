from __future__ import annotations

import asyncio
import logging
from contextlib import suppress

from app.core.cache import CacheBackend
from app.core.constants import HOME_MATCHES_CACHE_TTL_SECONDS
from app.integrations.news.client import NewsAPIClient
from app.integrations.sports.client import SportsAPIClient
from app.services.home_service import HomeService
from app.services.news_service import NewsService

logger = logging.getLogger(__name__)
REFRESH_LOCALES = ("ar", "en", "fr", "es")


class PublicCacheRefreshService:
    def __init__(self, sports_client: SportsAPIClient, news_client: NewsAPIClient, cache: CacheBackend) -> None:
        news_service = NewsService(client=news_client, cache=cache)
        self.home_service = HomeService(sports_client=sports_client, news_service=news_service, cache=cache)
        self.interval_seconds = HOME_MATCHES_CACHE_TTL_SECONDS
        self._task: asyncio.Task | None = None

    def start(self) -> None:
        if self._task is None or self._task.done():
            self._task = asyncio.create_task(self._run(), name="public-cache-refresh")

    async def stop(self) -> None:
        if self._task is None:
            return

        self._task.cancel()
        with suppress(asyncio.CancelledError):
            await self._task

    async def _run(self) -> None:
        while True:
            await self.refresh_once()
            await asyncio.sleep(self.interval_seconds)

    async def refresh_once(self) -> None:
        for locale in REFRESH_LOCALES:
            try:
                await self.home_service.get_home_data(locale)
                logger.info("public_cache_refreshed", extra={"locale": locale})
            except Exception:
                logger.exception("public_cache_refresh_failed", extra={"locale": locale})
