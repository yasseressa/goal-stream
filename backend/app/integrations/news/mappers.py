from __future__ import annotations

from datetime import datetime

from app.integrations.shared_models import NewsArticleData


def map_news_payload(payload: dict) -> NewsArticleData:
    return NewsArticleData(
        slug=payload["slug"],
        provider_id=payload["provider_id"],
        title=payload["title"],
        summary=payload["summary"],
        content=payload["content"],
        source=payload["source"],
        published_at=_coerce_datetime(payload["published_at"]),
        article_url=payload["article_url"],
        image_url=payload.get("image_url"),
        tags=list(payload.get("tags", [])),
    )


def _coerce_datetime(value: datetime | str) -> datetime:
    if isinstance(value, datetime):
        return value
    return datetime.fromisoformat(value)
