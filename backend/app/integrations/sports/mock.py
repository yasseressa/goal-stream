from __future__ import annotations

import logging
from datetime import UTC, date, datetime, time, timedelta

from app.integrations.shared_models import MatchData
from app.integrations.sports.client import SportsAPIClient
from app.integrations.sports.mappers import map_sports_payload

logger = logging.getLogger(__name__)


class MockSportsAPIClient(SportsAPIClient):
    async def get_matches_for_date(self, target_date: date, locale: str) -> list[MatchData]:
        logger.info(
            "sports_api_call",
            extra={"provider": "mock", "operation": "get_matches_for_date", "date": target_date.isoformat()},
        )
        return [map_sports_payload(payload) for payload in _build_match_payloads(target_date, locale)]

    async def get_match_details(self, external_match_id: str, locale: str) -> MatchData | None:
        logger.info(
            "sports_api_call",
            extra={"provider": "mock", "operation": "get_match_details", "external_match_id": external_match_id},
        )
        for offset in (-1, 0, 1):
            target_date = datetime.now(UTC).date() + timedelta(days=offset)
            for payload in _build_match_payloads(target_date, locale):
                if payload["external_match_id"] == external_match_id:
                    return map_sports_payload(payload)
        return None


def _build_match_payloads(target_date: date, locale: str) -> list[dict]:
    competition = _localize("Premier League", "?????? ????????? ???????", locale)
    champions = _localize("UEFA Champions League", "???? ????? ??????", locale)
    teams = [
        (_localize("Arsenal", "??????", locale), _localize("Chelsea", "??????", locale), competition),
        (_localize("Barcelona", "???????", locale), _localize("Bayern Munich", "????? ?????", locale), champions),
        (_localize("Inter", "????", locale), _localize("Juventus", "???????", locale), _localize("Serie A", "?????? ????????", locale)),
    ]
    payloads: list[dict] = []
    for index, (home_team, away_team, competition_name) in enumerate(teams, start=1):
        match_time = datetime.combine(target_date, time(hour=14 + (index * 2), tzinfo=UTC))
        payloads.append(
            {
                "external_match_id": f"{target_date.isoformat()}-match-{index}",
                "competition_name": competition_name,
                "home_team": home_team,
                "away_team": away_team,
                "start_time": match_time,
                "status": _status_for_date(target_date),
                "venue": _localize("National Stadium", "?????? ??????", locale),
                "description": _localize(
                    f"{home_team} vs {away_team} in {competition_name}",
                    f"{home_team} ?? {away_team} ?? {competition_name}",
                    locale,
                ),
            }
        )
    return payloads


def _localize(en_value: str, ar_value: str, locale: str) -> str:
    return ar_value if locale == "ar" else en_value


def _status_for_date(target_date: date) -> str:
    today = datetime.now(UTC).date()
    if target_date < today:
        return "finished"
    if target_date > today:
        return "scheduled"
    return "live"
