from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_admin_user, get_stream_service
from app.schemas.stream import StreamLinkAdminResponse, StreamLinkCreate, StreamLinkListResponse, StreamLinkUpdate
from app.services.stream_service import StreamService

router = APIRouter(prefix="/admin/streams")


@router.get("", response_model=StreamLinkListResponse, dependencies=[Depends(get_current_admin_user)])
async def list_streams(service: StreamService = Depends(get_stream_service)) -> StreamLinkListResponse:
    streams = await service.list_streams()
    return StreamLinkListResponse(items=[StreamLinkAdminResponse.model_validate(stream) for stream in streams])


@router.get("/{external_match_id}", response_model=StreamLinkAdminResponse, dependencies=[Depends(get_current_admin_user)])
async def get_stream(
    external_match_id: str,
    service: StreamService = Depends(get_stream_service),
) -> StreamLinkAdminResponse:
    stream = await service.get_stream(external_match_id)
    return StreamLinkAdminResponse.model_validate(stream)


@router.post(
    "",
    response_model=StreamLinkAdminResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin_user)],
)
async def create_stream(
    payload: StreamLinkCreate,
    service: StreamService = Depends(get_stream_service),
) -> StreamLinkAdminResponse:
    stream = await service.create_stream(payload)
    return StreamLinkAdminResponse.model_validate(stream)


@router.put("/{external_match_id}", response_model=StreamLinkAdminResponse, dependencies=[Depends(get_current_admin_user)])
async def update_stream(
    external_match_id: str,
    payload: StreamLinkUpdate,
    service: StreamService = Depends(get_stream_service),
) -> StreamLinkAdminResponse:
    stream = await service.update_stream(external_match_id, payload)
    return StreamLinkAdminResponse.model_validate(stream)


@router.delete("/{external_match_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin_user)])
async def delete_stream(
    external_match_id: str,
    service: StreamService = Depends(get_stream_service),
) -> None:
    await service.delete_stream(external_match_id)
