from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, verify_password
from app.repositories.admin_user import AdminUserRepository
from app.schemas.auth import LoginRequest, TokenResponse


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repository = AdminUserRepository(session)

    async def login(self, payload: LoginRequest) -> TokenResponse:
        user = await self.repository.get_by_login(payload.login)
        if user is None or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        await self.repository.update_last_login(user)
        await self.session.commit()

        return TokenResponse(access_token=create_access_token(user.id))
