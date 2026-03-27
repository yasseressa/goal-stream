from __future__ import annotations

import argparse
import asyncio

from sqlalchemy import select

from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.admin_user import AdminUser


async def create_admin(username: str, email: str, password: str, is_superuser: bool) -> None:
    async with SessionLocal() as session:
        existing = await session.execute(
            select(AdminUser).where((AdminUser.username == username) | (AdminUser.email == email))
        )
        if existing.scalar_one_or_none() is not None:
            raise SystemExit("Admin user with the same username or email already exists")

        admin = AdminUser(
            username=username,
            email=email,
            password_hash=get_password_hash(password),
            is_active=True,
            is_superuser=is_superuser,
        )
        session.add(admin)
        await session.commit()


def main() -> None:
    parser = argparse.ArgumentParser(description="Create an admin user")
    parser.add_argument("--username", required=True)
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--superuser", action="store_true")
    args = parser.parse_args()

    asyncio.run(create_admin(args.username, args.email, args.password, args.superuser))


if __name__ == "__main__":
    main()
