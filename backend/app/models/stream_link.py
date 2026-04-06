from __future__ import annotations

import enum

from sqlalchemy import Boolean, Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class StreamType(str, enum.Enum):
    HLS = "hls"
    IFRAME = "iframe"
    EMBED = "embed"
    EXTERNAL = "external"


class StreamLink(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "stream_links"

    external_match_id: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    stream_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    stream_type: Mapped[StreamType] = mapped_column(
        Enum(
            StreamType,
            name="streamtype",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        nullable=False,
    )
    show_stream: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
