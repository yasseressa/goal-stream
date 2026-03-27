from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_home_service
from app.schemas.common import Locale
from app.schemas.public import HomeResponse, MatchSummaryResponse, NewsArticleSummaryResponse
from app.services.home_service import HomeService

router = APIRouter()


@router.get("/home", response_model=HomeResponse)
async def get_home(
    locale: Annotated[Locale, Query()] = "en",
    service: HomeService = Depends(get_home_service),
) -> HomeResponse:
    data = await service.get_home_data(locale)
    return HomeResponse(
        yesterday_matches=[
            MatchSummaryResponse(
                external_match_id=match.external_match_id,
                competition_name=match.competition_name,
                home_team=match.home_team,
                away_team=match.away_team,
                start_time=match.start_time,
                status=match.status,
            )
            for match in data["yesterday_matches"]
        ],
        today_matches=[
            MatchSummaryResponse(
                external_match_id=match.external_match_id,
                competition_name=match.competition_name,
                home_team=match.home_team,
                away_team=match.away_team,
                start_time=match.start_time,
                status=match.status,
            )
            for match in data["today_matches"]
        ],
        tomorrow_matches=[
            MatchSummaryResponse(
                external_match_id=match.external_match_id,
                competition_name=match.competition_name,
                home_team=match.home_team,
                away_team=match.away_team,
                start_time=match.start_time,
                status=match.status,
            )
            for match in data["tomorrow_matches"]
        ],
        latest_news=[
            NewsArticleSummaryResponse(
                slug=article.slug,
                provider_id=article.provider_id,
                title=article.title,
                summary=article.summary,
                source=article.source,
                published_at=article.published_at,
                image_url=article.image_url,
            )
            for article in data["latest_news"]
        ],
    )
