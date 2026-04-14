from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.services.bootstrap_service import ensure_bootstrap_admin

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
    await ensure_bootstrap_admin()


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
