from __future__ import annotations

from abc import ABC, abstractmethod

from app.integrations.shared_models import NewsArticleData


class NewsAPIClient(ABC):
    @abstractmethod
    async def get_latest_sports_news(self, locale: str) -> list[NewsArticleData]:
        raise NotImplementedError

    @abstractmethod
    async def get_related_news(
        self,
        locale: str,
        team_names: list[str] | None = None,
        competition: str | None = None,
        match_context: str | None = None,
    ) -> list[NewsArticleData]:
        raise NotImplementedError

    @abstractmethod
    async def get_article_details(self, identifier: str, locale: str) -> NewsArticleData | None:
        raise NotImplementedError
