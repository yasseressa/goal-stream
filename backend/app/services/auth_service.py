from __future__ import annotations

import logging

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.core.security import get_password_hash
from app.models.admin_user import AdminUser
from app.repositories.admin_user import AdminUserRepository
from app.schemas.auth import LoginRequest, TokenResponse

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repository = AdminUserRepository(session)

    async def login(self, payload: LoginRequest) -> TokenResponse:
        normalized_login = _normalize_value(payload.login)
        normalized_password = _normalize_value(payload.password)

        user = await self.repository.get_by_login(normalized_login)
        if user is not None and user.is_active and verify_password(normalized_password, user.password_hash):
            logger.info("admin_login_success", extra={"login": normalized_login, "mode": "database"})
            await self.repository.update_last_login(user)
            await self.session.commit()
            return TokenResponse(access_token=create_access_token(user.id))

        bootstrap_user = await self._try_bootstrap_login(normalized_login, normalized_password)
        if bootstrap_user is None or not bootstrap_user.is_active:
            logger.warning("admin_login_failed", extra={"login": normalized_login})
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        logger.info("admin_login_success", extra={"login": normalized_login, "mode": "bootstrap_fallback"})
        await self.repository.update_last_login(bootstrap_user)
        await self.session.commit()

        return TokenResponse(access_token=create_access_token(bootstrap_user.id))

    async def _try_bootstrap_login(self, login: str, password: str) -> AdminUser | None:
        bootstrap_username = _normalize_value(settings.admin_bootstrap_username)
        bootstrap_email = _normalize_email(settings.admin_bootstrap_email)
        bootstrap_password = _normalize_value(settings.admin_bootstrap_password)

        logger.info(
            "bootstrap_login_check",
            extra={
                "login": login,
                "bootstrap_username_present": bool(bootstrap_username),
                "bootstrap_email_present": bool(bootstrap_email),
                "password_present": bool(bootstrap_password),
                "login_matches_username": login == bootstrap_username,
                "login_matches_email": login == bootstrap_email,
                "password_matches_bootstrap": password == bootstrap_password,
            },
        )

        if not bootstrap_username or not bootstrap_email or not bootstrap_password:
            return None

        if password != bootstrap_password:
            return None

        if login not in {bootstrap_username, bootstrap_email}:
            return None

        user = await self.repository.get_by_login(bootstrap_username)
        if user is None:
            user = await self.repository.get_by_login(bootstrap_email)
        if user is None:
            user = AdminUser(
                username=bootstrap_username,
                email=bootstrap_email,
                password_hash=get_password_hash(bootstrap_password),
                is_active=True,
                is_superuser=True,
            )
            self.session.add(user)
            await self.session.flush()
            logger.info("bootstrap_login_created_admin", extra={"login": login})
            return user

        user.username = bootstrap_username
        user.email = bootstrap_email
        user.password_hash = get_password_hash(bootstrap_password)
        user.is_active = True
        user.is_superuser = True
        await self.session.flush()
        logger.info("bootstrap_login_updated_admin", extra={"login": login})
        return user


def _normalize_value(value: str | None) -> str:
    return (value or "").strip().strip('"').strip("'").strip()


def _normalize_email(value: str | None) -> str:
    return _normalize_value(value).lower()
