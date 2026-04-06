"""add social link urls to redirect settings

Revision ID: 0003_social_links
Revises: 0002_redirect_streams
Create Date: 2026-04-06 12:00:00
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0003_social_links"
down_revision = "0002_redirect_streams"
branch_labels = None
depends_on = None


SOCIAL_COLUMNS = [
    ("facebook_url", sa.String(length=2048)),
    ("youtube_url", sa.String(length=2048)),
    ("instagram_url", sa.String(length=2048)),
    ("telegram_url", sa.String(length=2048)),
    ("whatsapp_url", sa.String(length=2048)),
]


def upgrade() -> None:
    for column_name, column_type in SOCIAL_COLUMNS:
        op.add_column("redirect_settings", sa.Column(column_name, column_type, nullable=True))


def downgrade() -> None:
    for column_name, _ in reversed(SOCIAL_COLUMNS):
        op.drop_column("redirect_settings", column_name)
