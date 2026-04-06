from __future__ import annotations

import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class RedirectSetting(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "redirect_settings"

    enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    default_cooldown_seconds: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    open_in_new_tab: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    fallback_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    facebook_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    youtube_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    instagram_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    telegram_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    whatsapp_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    active_campaign_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("redirect_campaigns.id", ondelete="SET NULL"),
        nullable=True,
    )

    active_campaign: Mapped["RedirectCampaign | None"] = relationship("RedirectCampaign", lazy="joined")
