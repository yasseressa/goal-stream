from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_news_service
from app.schemas.common import Locale
from app.schemas.public import NewsArticleDetailResponse
from app.services.news_service import NewsService

router = APIRouter()


@router.get("/news/{news_slug}", response_model=NewsArticleDetailResponse)
async def get_news_article(
    news_slug: str,
    locale: Annotated[Locale, Query()] = "en",
    service: NewsService = Depends(get_news_service),
) -> NewsArticleDetailResponse:
    article = await service.get_article(news_slug, locale)
    return NewsArticleDetailResponse(
        slug=article.slug,
        provider_id=article.provider_id,
        title=article.title,
        summary=article.summary,
        source=article.source,
        published_at=article.published_at,
        image_url=article.image_url,
        content=article.content,
        article_url=article.article_url,
        tags=article.tags,
    )
