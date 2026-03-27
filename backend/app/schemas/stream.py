from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.stream_link import StreamType


class StreamLinkBase(BaseModel):
    external_match_id: str = Field(min_length=1, max_length=255)
    stream_url: str = Field(min_length=1, max_length=2048)
    stream_type: StreamType
    show_stream: bool = True


class StreamLinkCreate(StreamLinkBase):
    pass


class StreamLinkUpdate(BaseModel):
    stream_url: str = Field(min_length=1, max_length=2048)
    stream_type: StreamType
    show_stream: bool = True


class StreamLinkAdminResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    external_match_id: str
    stream_url: str
    stream_type: StreamType
    show_stream: bool
    created_at: datetime
    updated_at: datetime


class StreamLinkListResponse(BaseModel):
    items: list[StreamLinkAdminResponse]
