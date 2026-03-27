from fastapi import APIRouter

from app.api.routes.admin_redirect_settings import router as admin_redirect_settings_router
from app.api.routes.admin_redirects import router as admin_redirects_router
from app.api.routes.admin_streams import router as admin_streams_router
from app.api.routes.auth import router as auth_router
from app.api.routes.health import router as health_router
from app.api.routes.home import router as home_router
from app.api.routes.matches import router as matches_router
from app.api.routes.news import router as news_router
from app.api.routes.redirect import router as redirect_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(home_router, tags=["public"])
api_router.include_router(matches_router, tags=["public"])
api_router.include_router(news_router, tags=["public"])
api_router.include_router(redirect_router, tags=["public"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(admin_streams_router, tags=["admin"])
api_router.include_router(admin_redirects_router, tags=["admin"])
api_router.include_router(admin_redirect_settings_router, tags=["admin"])
