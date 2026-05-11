from __future__ import annotations

from datetime import UTC, date, datetime, time, timedelta, timezone, tzinfo
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from app.core.config import settings


def sports_timezone() -> tzinfo:
    try:
        return ZoneInfo(settings.football_data_timezone)
    except ZoneInfoNotFoundError:
        return timezone(timedelta(hours=3), "Asia/Riyadh")


def current_sports_date() -> date:
    return datetime.now(sports_timezone()).date()


def utc_dates_for_sports_date(target_date: date) -> list[date]:
    timezone = sports_timezone()
    local_start = datetime.combine(target_date, time.min, tzinfo=timezone)
    local_end = local_start + timedelta(days=1) - timedelta(microseconds=1)
    start_date = local_start.astimezone(UTC).date()
    end_date = local_end.astimezone(UTC).date()
    dates: list[date] = []
    current = start_date
    while current <= end_date:
        dates.append(current)
        current += timedelta(days=1)
    return dates


def is_on_sports_date(value: datetime, target_date: date) -> bool:
    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)
    return value.astimezone(sports_timezone()).date() == target_date
