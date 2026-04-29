from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.api.deps import cache_backend
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.integrations.news import get_news_client
from app.integrations.sports import get_sports_client
from app.services.bootstrap_service import ensure_bootstrap_admin
from app.services.cache_refresh_service import PublicCacheRefreshService
from app.services.schema_service import ensure_database_schema

configure_logging()

app = FastAPI(
    title=settings.app_name,
    debug=settings.app_debug,
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.on_event("startup")
async def bootstrap_admin_user() -> None:
    await ensure_database_schema()
    await ensure_bootstrap_admin()
    app.state.public_cache_refresh_service = PublicCacheRefreshService(
        sports_client=get_sports_client(),
        news_client=get_news_client(),
        cache=cache_backend,
    )
    app.state.public_cache_refresh_service.start()


@app.on_event("shutdown")
async def stop_public_cache_refresh() -> None:
    service = getattr(app.state, "public_cache_refresh_service", None)
    if service is not None:
        await service.stop()


@app.api_route("/", methods=["GET", "HEAD"])
async def root() -> dict[str, str]:
    return {
        "service": settings.app_name,
        "status": "ok",
        "api": settings.api_v1_prefix,
        "home": f"{settings.api_v1_prefix}/home",
        "health": f"{settings.api_v1_prefix}/health",
        "docs": "/docs",
    }
