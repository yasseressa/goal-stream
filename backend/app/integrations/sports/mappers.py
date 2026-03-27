from __future__ import annotations

from datetime import datetime

from app.integrations.shared_models import MatchData


def map_sports_payload(payload: dict) -> MatchData:
    return MatchData(
        external_match_id=str(payload["external_match_id"]),
        competition_name=payload["competition_name"],
        home_team=payload["home_team"],
        away_team=payload["away_team"],
        start_time=_coerce_datetime(payload["start_time"]),
        status=payload["status"],
        venue=payload.get("venue"),
        description=payload.get("description"),
    )


def _coerce_datetime(value: datetime | str) -> datetime:
    if isinstance(value, datetime):
        return value
    return datetime.fromisoformat(value)
