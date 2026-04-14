from __future__ import annotations

import logging

from sqlalchemy import select

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.admin_user import AdminUser

logger = logging.getLogger(__name__)


async def ensure_bootstrap_admin() -> None:
    if not settings.should_bootstrap_admin:
        return

    async with SessionLocal() as session:
        existing = await session.execute(
            select(AdminUser).where(
                (AdminUser.username == settings.admin_bootstrap_username)
                | (AdminUser.email == settings.admin_bootstrap_email)
            )
        )
        if existing.scalar_one_or_none() is not None:
            logger.info("bootstrap_admin_exists")
            return

        admin = AdminUser(
            username=settings.admin_bootstrap_username,
            email=settings.admin_bootstrap_email,
            password_hash=get_password_hash(settings.admin_bootstrap_password),
            is_active=True,
            is_superuser=True,
        )
        session.add(admin)
        await session.commit()
        logger.info("bootstrap_admin_created", extra={"username": settings.admin_bootstrap_username})
