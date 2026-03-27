from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.stream_link import StreamLink
from app.schemas.stream import StreamLinkCreate, StreamLinkUpdate


class StreamLinkRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_all(self) -> list[StreamLink]:
        result = await self.session.execute(select(StreamLink).order_by(StreamLink.updated_at.desc()))
        return list(result.scalars().all())

    async def get_by_external_match_id(self, external_match_id: str) -> StreamLink | None:
        result = await self.session.execute(
            select(StreamLink).where(StreamLink.external_match_id == external_match_id)
        )
        return result.scalar_one_or_none()

    async def create(self, payload: StreamLinkCreate) -> StreamLink:
        stream_link = StreamLink(**payload.model_dump())
        self.session.add(stream_link)
        await self.session.flush()
        await self.session.refresh(stream_link)
        return stream_link

    async def update(self, stream_link: StreamLink, payload: StreamLinkUpdate) -> StreamLink:
        for field, value in payload.model_dump().items():
            setattr(stream_link, field, value)
        await self.session.flush()
        await self.session.refresh(stream_link)
        return stream_link
