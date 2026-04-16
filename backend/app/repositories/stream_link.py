from __future__ import annotations

import logging

from sqlalchemy import select
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.stream_link import StreamLink
from app.schemas.stream import StreamLinkCreate, StreamLinkUpdate

logger = logging.getLogger(__name__)


class StreamLinkRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_all(self) -> list[StreamLink]:
        try:
            result = await self.session.execute(select(StreamLink).order_by(StreamLink.updated_at.desc()))
        except ProgrammingError as exc:
            if _is_missing_stream_links_table(exc):
                logger.warning("stream_links_table_missing")
                return []
            raise
        return list(result.scalars().all())

    async def get_by_external_match_id(self, external_match_id: str) -> StreamLink | None:
        try:
            result = await self.session.execute(
                select(StreamLink).where(StreamLink.external_match_id == external_match_id)
            )
        except ProgrammingError as exc:
            if _is_missing_stream_links_table(exc):
                logger.warning("stream_links_table_missing", extra={"external_match_id": external_match_id})
                return None
            raise
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

    async def delete(self, stream_link: StreamLink) -> None:
        await self.session.delete(stream_link)
        await self.session.flush()


def _is_missing_stream_links_table(exc: ProgrammingError) -> bool:
    return 'relation "stream_links" does not exist' in str(exc)
