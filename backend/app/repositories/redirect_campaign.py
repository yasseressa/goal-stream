from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.redirect_campaign import RedirectCampaign
from app.schemas.redirect import RedirectCampaignCreate, RedirectCampaignUpdate


class RedirectCampaignRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_all(self) -> list[RedirectCampaign]:
        result = await self.session.execute(
            select(RedirectCampaign).order_by(RedirectCampaign.updated_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, redirect_id: UUID | str) -> RedirectCampaign | None:
        result = await self.session.execute(
            select(RedirectCampaign).where(RedirectCampaign.id == UUID(str(redirect_id)))
        )
        return result.scalar_one_or_none()

    async def get_active_campaign(self) -> RedirectCampaign | None:
        now = datetime.now(UTC)
        result = await self.session.execute(
            select(RedirectCampaign).where(
                RedirectCampaign.is_active.is_(True),
                or_(RedirectCampaign.start_at.is_(None), RedirectCampaign.start_at <= now),
                or_(RedirectCampaign.end_at.is_(None), RedirectCampaign.end_at >= now),
            )
        )
        return result.scalars().first()

    async def create(self, payload: RedirectCampaignCreate) -> RedirectCampaign:
        campaign = RedirectCampaign(**payload.model_dump())
        self.session.add(campaign)
        await self.session.flush()
        await self.session.refresh(campaign)
        return campaign

    async def update(self, campaign: RedirectCampaign, payload: RedirectCampaignUpdate) -> RedirectCampaign:
        for field, value in payload.model_dump().items():
            setattr(campaign, field, value)
        await self.session.flush()
        await self.session.refresh(campaign)
        return campaign

    async def delete(self, campaign: RedirectCampaign) -> None:
        await self.session.delete(campaign)
        await self.session.flush()
