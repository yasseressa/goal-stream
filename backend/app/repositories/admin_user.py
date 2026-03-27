from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.admin_user import AdminUser


class AdminUserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, user_id: UUID | str) -> AdminUser | None:
        normalized_user_id = UUID(str(user_id))
        statement = select(AdminUser).where(AdminUser.id == normalized_user_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_login(self, login: str) -> AdminUser | None:
        statement = select(AdminUser).where(
            or_(AdminUser.email == login, AdminUser.username == login)
        )
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def update_last_login(self, user: AdminUser) -> None:
        user.last_login_at = datetime.now(UTC)
        await self.session.flush()
