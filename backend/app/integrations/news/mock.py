from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta

from app.integrations.news.client import NewsAPIClient
from app.integrations.news.mappers import map_news_payload
from app.integrations.shared_models import NewsArticleData

logger = logging.getLogger(__name__)


class MockNewsAPIClient(NewsAPIClient):
    async def get_latest_sports_news(self, locale: str) -> list[NewsArticleData]:
        logger.info("news_api_call", extra={"provider": "mock", "operation": "get_latest_sports_news"})
        return [map_news_payload(payload) for payload in _build_articles(locale)]

    async def get_related_news(
        self,
        locale: str,
        team_names: list[str] | None = None,
        competition: str | None = None,
        match_context: str | None = None,
    ) -> list[NewsArticleData]:
        logger.info(
            "news_api_call",
            extra={"provider": "mock", "operation": "get_related_news", "competition": competition},
        )
        articles = [map_news_payload(payload) for payload in _build_articles(locale)]
        search_terms = {
            term.lower()
            for term in (team_names or []) + [competition or "", match_context or ""]
            if term
        }
        if not search_terms:
            return articles[:3]

        related = []
        for article in articles:
            haystack = " ".join([article.title, article.summary, article.content, " ".join(article.tags)]).lower()
            if any(term in haystack for term in search_terms):
                related.append(article)

        return related[:3] or articles[:3]

    async def get_article_details(self, identifier: str, locale: str) -> NewsArticleData | None:
        logger.info("news_api_call", extra={"provider": "mock", "operation": "get_article_details", "identifier": identifier})
        for payload in _build_articles(locale):
            if payload["slug"] == identifier or payload["provider_id"] == identifier:
                return map_news_payload(payload)
        return None


def _build_articles(locale: str) -> list[dict]:
    now = datetime.now(UTC)
    return [
        _article(
            locale=locale,
            slug="arsenal-chelsea-preview",
            provider_id="news-1",
            en_title="Arsenal and Chelsea prepare for a decisive derby",
            ar_title="?????? ??????? ??????? ?????? ????",
            en_summary="Key team news ahead of the Premier League fixture.",
            ar_summary="??? ????? ???????? ??? ?????? ?????? ?????????.",
            en_content="Arsenal and Chelsea enter the match with pressure on both managers and major implications in the table.",
            ar_content="???? ?????? ??????? ???????? ???? ???? ??? ???????? ?????? ????? ??? ????? ??????.",
            published_at=now - timedelta(minutes=45),
            tags=["Arsenal", "Chelsea", "Premier League"],
        ),
        _article(
            locale=locale,
            slug="champions-league-quarterfinal-shift",
            provider_id="news-2",
            en_title="Champions League quarterfinal balance shifts after training update",
            ar_title="??????? ?? ??? ????? ???? ??????? ??? ??????? ???????",
            en_summary="Fresh availability updates affect tactical planning.",
            ar_summary="??????? ???????? ???? ??? ????? ??????.",
            en_content="Barcelona and Bayern Munich both adjusted preparations after late fitness concerns in training.",
            ar_content="??? ??????? ?????? ????? ?????? ????????? ??? ????? ????? ?????? ?? ???????.",
            published_at=now - timedelta(hours=2),
            tags=["Barcelona", "Bayern Munich", "UEFA Champions League"],
        ),
        _article(
            locale=locale,
            slug="inter-juventus-form-guide",
            provider_id="news-3",
            en_title="Inter and Juventus form guide before Serie A showdown",
            ar_title="???? ?????? ?????? ????? ???????? ??? ??? ?????? ????????",
            en_summary="Momentum and injuries could define the contest.",
            ar_summary="????? ????????? ?? ?????? ???? ????????.",
            en_content="Inter arrive with defensive consistency while Juventus continue searching for control in midfield.",
            ar_content="???? ???? ????? ????? ????? ????? ??????? ????? ?? ??????? ?? ??? ??????.",
            published_at=now - timedelta(hours=4),
            tags=["Inter", "Juventus", "Serie A"],
        ),
    ]


def _article(
    *,
    locale: str,
    slug: str,
    provider_id: str,
    en_title: str,
    ar_title: str,
    en_summary: str,
    ar_summary: str,
    en_content: str,
    ar_content: str,
    published_at: datetime,
    tags: list[str],
) -> dict:
    return {
        "slug": slug,
        "provider_id": provider_id,
        "title": ar_title if locale == "ar" else en_title,
        "summary": ar_summary if locale == "ar" else en_summary,
        "content": ar_content if locale == "ar" else en_content,
        "source": "Mock Sports News",
        "published_at": published_at,
        "article_url": f"https://example.com/news/{slug}",
        "image_url": "https://example.com/images/sports-news.jpg",
        "tags": tags,
    }
