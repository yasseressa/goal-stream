from __future__ import annotations

from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_cache_backend, get_current_admin_user
from app.core.cache import CacheBackend, CacheKeys
from app.core.time import current_sports_date, sports_refresh_slot_key
from app.integrations.sports import get_sports_client

router = APIRouter(prefix="/admin/fixtures-cache")

_LOCALES = ("ar", "en", "fr", "es")
_BUCKETS = (
    ("yesterday", -1),
    ("today", 0),
    ("tomorrow", 1),
)


@router.post("/refresh", dependencies=[Depends(get_current_admin_user)])
async def refresh_fixtures_cache(
    sports_client: Any = Depends(get_sports_client),
    cache: CacheBackend = Depends(get_cache_backend),
) -> dict[str, Any]:
    refresh = getattr(sports_client, "refresh_fixture_cache", None)
    if refresh is None:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="The active sports provider does not support manual fixture refresh.",
        )

    _clear_home_match_cache(cache)
    result = await refresh()
    _clear_home_match_cache(cache)
    return {
        "status": "refreshed",
        **result,
    }


def _clear_home_match_cache(cache: CacheBackend) -> None:
    sports_date = current_sports_date()
    refresh_slot = sports_refresh_slot_key()
    for locale in _LOCALES:
        for bucket, offset in _BUCKETS:
            match_date = (sports_date + timedelta(days=offset)).isoformat()
            cache.delete(CacheKeys.home_matches(locale, bucket, f"{match_date}:{refresh_slot}"))
