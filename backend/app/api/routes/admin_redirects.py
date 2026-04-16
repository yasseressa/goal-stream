from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_admin_user, get_redirect_service
from app.schemas.redirect import RedirectCampaignCreate, RedirectCampaignListResponse, RedirectCampaignResponse, RedirectCampaignUpdate
from app.services.redirect_service import RedirectService

router = APIRouter(prefix="/admin/redirects")


@router.get("", response_model=RedirectCampaignListResponse, dependencies=[Depends(get_current_admin_user)])
async def list_redirects(service: RedirectService = Depends(get_redirect_service)) -> RedirectCampaignListResponse:
    campaigns = await service.list_campaigns()
    return RedirectCampaignListResponse(items=[RedirectCampaignResponse.model_validate(campaign) for campaign in campaigns])


@router.post(
    "",
    response_model=RedirectCampaignResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin_user)],
)
async def create_redirect(
    payload: RedirectCampaignCreate,
    service: RedirectService = Depends(get_redirect_service),
) -> RedirectCampaignResponse:
    campaign = await service.create_campaign(payload)
    return RedirectCampaignResponse.model_validate(campaign)


@router.put("/{redirect_id}", response_model=RedirectCampaignResponse, dependencies=[Depends(get_current_admin_user)])
async def update_redirect(
    redirect_id: str,
    payload: RedirectCampaignUpdate,
    service: RedirectService = Depends(get_redirect_service),
) -> RedirectCampaignResponse:
    campaign = await service.update_campaign(redirect_id, payload)
    return RedirectCampaignResponse.model_validate(campaign)


@router.delete("/{redirect_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin_user)])
async def delete_redirect(
    redirect_id: str,
    service: RedirectService = Depends(get_redirect_service),
) -> None:
    await service.delete_campaign(redirect_id)
