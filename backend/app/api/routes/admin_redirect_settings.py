from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_current_admin_user, get_redirect_service
from app.schemas.redirect import RedirectSettingResponse, RedirectSettingUpdate
from app.services.redirect_service import RedirectService

router = APIRouter(prefix="/admin/redirect-settings")


@router.get("", response_model=RedirectSettingResponse, dependencies=[Depends(get_current_admin_user)])
async def get_redirect_settings(
    service: RedirectService = Depends(get_redirect_service),
) -> RedirectSettingResponse:
    settings_row = await service.get_settings()
    return RedirectSettingResponse.model_validate(settings_row)


@router.put("", response_model=RedirectSettingResponse, dependencies=[Depends(get_current_admin_user)])
async def update_redirect_settings(
    payload: RedirectSettingUpdate,
    service: RedirectService = Depends(get_redirect_service),
) -> RedirectSettingResponse:
    settings_row = await service.update_settings(payload)
    return RedirectSettingResponse.model_validate(settings_row)
