from __future__ import annotations

import logging

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import CacheBackend, CacheKeys
from app.core.config import settings
from app.repositories.redirect_campaign import RedirectCampaignRepository
from app.repositories.redirect_setting import RedirectSettingRepository
from app.schemas.redirect import RedirectCampaignCreate, RedirectCampaignUpdate, RedirectConfigResponse, RedirectSettingUpdate

logger = logging.getLogger(__name__)


class RedirectService:
    def __init__(self, session: AsyncSession, cache: CacheBackend) -> None:
        self.session = session
        self.cache = cache
        self.campaign_repository = RedirectCampaignRepository(session)
        self.setting_repository = RedirectSettingRepository(session)

    async def list_campaigns(self):
        return await self.campaign_repository.list_all()

    async def create_campaign(self, payload: RedirectCampaignCreate):
        campaign = await self.campaign_repository.create(payload)
        await self.session.commit()
        self.cache.delete(CacheKeys.redirect_config())
        logger.info("redirect_campaign_created", extra={"redirect_id": str(campaign.id)})
        return campaign

    async def update_campaign(self, redirect_id: str, payload: RedirectCampaignUpdate):
        campaign = await self.campaign_repository.get_by_id(redirect_id)
        if campaign is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Redirect campaign not found")
        updated = await self.campaign_repository.update(campaign, payload)
        await self.session.commit()
        self.cache.delete(CacheKeys.redirect_config())
        logger.info("redirect_campaign_updated", extra={"redirect_id": redirect_id})
        return updated

    async def get_settings(self):
        settings_row = await self.setting_repository.get_settings()
        if settings_row is None:
            payload = RedirectSettingUpdate(
                enabled=False,
                default_cooldown_seconds=30,
                open_in_new_tab=False,
                fallback_url=None,
                active_campaign_id=None,
            )
            settings_row = await self.setting_repository.upsert(payload)
            await self.session.commit()
        return settings_row

    async def update_settings(self, payload: RedirectSettingUpdate):
        settings_row = await self.setting_repository.upsert(payload)
        await self.session.commit()
        self.cache.delete(CacheKeys.redirect_config())
        logger.info("redirect_settings_updated", extra={"active_campaign_id": payload.active_campaign_id})
        return settings_row

    async def get_public_config(self) -> RedirectConfigResponse:
        cache_key = CacheKeys.redirect_config()
        cached = self.cache.get(cache_key)
        if cached is not None:
            return cached

        settings_row = await self.get_settings()
        active_campaign = None
        if settings_row.active_campaign_id is not None:
            active_campaign = await self.campaign_repository.get_by_id(settings_row.active_campaign_id)
        if active_campaign is None:
            active_campaign = await self.campaign_repository.get_active_campaign()

        target_url = active_campaign.target_url if active_campaign else settings_row.fallback_url
        interval_seconds = active_campaign.cooldown_seconds if active_campaign else settings_row.default_cooldown_seconds
        config = RedirectConfigResponse(
            enabled=settings_row.enabled and bool(target_url),
            interval_seconds=interval_seconds,
            target_url=target_url,
            open_in_new_tab=settings_row.open_in_new_tab,
        )
        self.cache.set(cache_key, config, settings.cache_redirect_config_ttl_seconds)
        logger.info("redirect_config_loaded", extra={"enabled": config.enabled})
        return config
