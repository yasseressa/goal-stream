from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RedirectCampaignBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    target_url: str = Field(min_length=1, max_length=2048)
    is_active: bool = True
    cooldown_seconds: int = Field(ge=0, le=86400, default=30)
    start_at: datetime | None = None
    end_at: datetime | None = None


class RedirectCampaignCreate(RedirectCampaignBase):
    pass


class RedirectCampaignUpdate(RedirectCampaignBase):
    pass


class RedirectCampaignResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    target_url: str
    is_active: bool
    cooldown_seconds: int
    start_at: datetime | None
    end_at: datetime | None
    created_at: datetime
    updated_at: datetime


class RedirectCampaignListResponse(BaseModel):
    items: list[RedirectCampaignResponse]


class RedirectSettingUpdate(BaseModel):
    enabled: bool
    default_cooldown_seconds: int = Field(ge=0, le=86400)
    open_in_new_tab: bool = False
    fallback_url: str | None = Field(default=None, max_length=2048)
    facebook_url: str | None = Field(default=None, max_length=2048)
    youtube_url: str | None = Field(default=None, max_length=2048)
    instagram_url: str | None = Field(default=None, max_length=2048)
    telegram_url: str | None = Field(default=None, max_length=2048)
    whatsapp_url: str | None = Field(default=None, max_length=2048)
    active_campaign_id: str | None = None


class RedirectSettingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    enabled: bool
    default_cooldown_seconds: int
    open_in_new_tab: bool
    fallback_url: str | None
    facebook_url: str | None
    youtube_url: str | None
    instagram_url: str | None
    telegram_url: str | None
    whatsapp_url: str | None
    active_campaign_id: str | None
    created_at: datetime
    updated_at: datetime


class RedirectConfigResponse(BaseModel):
    enabled: bool
    interval_seconds: int
    target_url: str | None
    open_in_new_tab: bool


class SocialLinkItem(BaseModel):
    label: str
    href: str


class SocialLinksResponse(BaseModel):
    items: list[SocialLinkItem]
