from __future__ import annotations

from datetime import timedelta
from types import SimpleNamespace

from app.core.cache import InMemoryCacheBackend
from app.integrations.shared_models import MatchData
from app.services.match_service import KSA_TIMEZONE, MatchService


class StubSportsClient:
    def __init__(self, match: MatchData) -> None:
        self.match = match

    async def get_match_details(self, external_match_id: str, locale: str) -> MatchData | None:
        return self.match if external_match_id == self.match.external_match_id else None


class StubNewsService:
    async def get_related_news(self, **_kwargs):
        return []


class StubSession:
    pass


def test_match_service_can_show_player_for_today_match():
    from datetime import datetime

    now = datetime.now(KSA_TIMEZONE)
    match = MatchData(
        external_match_id="today-match",
        competition_name="Premier League",
        home_team="Arsenal",
        away_team="Chelsea",
        start_time=now,
        status="live",
    )
    service = MatchService(StubSession(), StubSportsClient(match), StubNewsService(), InMemoryCacheBackend())
    stream = SimpleNamespace(show_stream=True, stream_url="https://stream.example.com/live.m3u8")

    assert service._can_show_player(match, stream) is True


def test_match_service_hides_player_for_non_today_match():
    from datetime import datetime

    now = datetime.now(KSA_TIMEZONE)
    match = MatchData(
        external_match_id="old-match",
        competition_name="Premier League",
        home_team="Arsenal",
        away_team="Chelsea",
        start_time=now - timedelta(days=1),
        status="finished",
    )
    service = MatchService(StubSession(), StubSportsClient(match), StubNewsService(), InMemoryCacheBackend())
    stream = SimpleNamespace(show_stream=True, stream_url="https://stream.example.com/live.m3u8")

    assert service._can_show_player(match, stream) is False
