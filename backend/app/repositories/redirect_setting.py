from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.redirect_setting import RedirectSetting
from app.schemas.redirect import RedirectSettingUpdate


class RedirectSettingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_settings(self) -> RedirectSetting | None:
        result = await self.session.execute(select(RedirectSetting).limit(1))
        return result.scalar_one_or_none()

    async def upsert(self, payload: RedirectSettingUpdate) -> RedirectSetting:
        data = payload.model_dump()
        if data["active_campaign_id"] is not None:
            data["active_campaign_id"] = UUID(data["active_campaign_id"])

        settings = await self.get_settings()
        if settings is None:
            settings = RedirectSetting(**data)
            self.session.add(settings)
        else:
            for field, value in data.items():
                setattr(settings, field, value)
        await self.session.flush()
        await self.session.refresh(settings)
        return settings
