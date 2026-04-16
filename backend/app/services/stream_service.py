from __future__ import annotations

import logging

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.stream_link import StreamLinkRepository
from app.schemas.stream import StreamLinkCreate, StreamLinkUpdate

logger = logging.getLogger(__name__)


class StreamService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repository = StreamLinkRepository(session)

    async def list_streams(self):
        return await self.repository.list_all()

    async def get_stream(self, external_match_id: str):
        stream_link = await self.repository.get_by_external_match_id(external_match_id)
        if stream_link is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stream link not found")
        return stream_link

    async def create_stream(self, payload: StreamLinkCreate):
        existing = await self.repository.get_by_external_match_id(payload.external_match_id)
        if existing is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Stream link already exists")

        stream_link = await self.repository.create(payload)
        await self.session.commit()
        logger.info("admin_stream_created", extra={"external_match_id": payload.external_match_id})
        return stream_link

    async def update_stream(self, external_match_id: str, payload: StreamLinkUpdate):
        stream_link = await self.get_stream(external_match_id)
        updated = await self.repository.update(stream_link, payload)
        await self.session.commit()
        logger.info("admin_stream_updated", extra={"external_match_id": external_match_id})
        return updated

    async def delete_stream(self, external_match_id: str) -> None:
        stream_link = await self.get_stream(external_match_id)
        await self.repository.delete(stream_link)
        await self.session.commit()
        logger.info("admin_stream_deleted", extra={"external_match_id": external_match_id})
