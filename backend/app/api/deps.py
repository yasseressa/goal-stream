from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import CacheBackend, create_cache_backend
from app.core.security import decode_access_token
from app.db.session import get_db_session
from app.integrations.news import get_news_client
from app.integrations.news.client import NewsAPIClient
from app.integrations.sports import get_sports_client
from app.integrations.sports.client import SportsAPIClient
from app.repositories.admin_user import AdminUserRepository
from app.services.home_service import HomeService
from app.services.match_service import MatchService
from app.services.news_service import NewsService
from app.services.redirect_service import RedirectService
from app.services.stream_service import StreamService

bearer_scheme = HTTPBearer(auto_error=False)
cache_backend = create_cache_backend()

DbSession = Annotated[AsyncSession, Depends(get_db_session)]


async def get_current_admin_user(
    session: DbSession,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
):
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    payload = decode_access_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    repository = AdminUserRepository(session)
    user = await repository.get_by_id(user_id)
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin user not found or inactive")

    return user


def get_cache_backend() -> CacheBackend:
    return cache_backend


def get_news_service(
    cache: Annotated[CacheBackend, Depends(get_cache_backend)],
    client: Annotated[NewsAPIClient, Depends(get_news_client)],
) -> NewsService:
    return NewsService(client=client, cache=cache)


def get_home_service(
    cache: Annotated[CacheBackend, Depends(get_cache_backend)],
    sports_client: Annotated[SportsAPIClient, Depends(get_sports_client)],
    news_service: Annotated[NewsService, Depends(get_news_service)],
) -> HomeService:
    return HomeService(sports_client=sports_client, news_service=news_service, cache=cache)


def get_match_service(
    session: DbSession,
    cache: Annotated[CacheBackend, Depends(get_cache_backend)],
    sports_client: Annotated[SportsAPIClient, Depends(get_sports_client)],
    news_service: Annotated[NewsService, Depends(get_news_service)],
) -> MatchService:
    return MatchService(session=session, sports_client=sports_client, news_service=news_service, cache=cache)


def get_stream_service(session: DbSession) -> StreamService:
    return StreamService(session=session)


def get_redirect_service(
    session: DbSession,
    cache: Annotated[CacheBackend, Depends(get_cache_backend)],
) -> RedirectService:
    return RedirectService(session=session, cache=cache)
