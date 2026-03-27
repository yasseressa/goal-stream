from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class RedirectCampaign(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "redirect_campaigns"

    name: Mapped[str] = mapped_column(String(150), index=True, nullable=False)
    target_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    cooldown_seconds: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    start_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    end_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
