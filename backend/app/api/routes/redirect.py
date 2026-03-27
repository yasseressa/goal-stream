from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_redirect_service
from app.schemas.redirect import RedirectConfigResponse
from app.services.redirect_service import RedirectService

router = APIRouter()


@router.get("/redirect/config", response_model=RedirectConfigResponse)
async def get_redirect_config(service: RedirectService = Depends(get_redirect_service)) -> RedirectConfigResponse:
    return await service.get_public_config()
