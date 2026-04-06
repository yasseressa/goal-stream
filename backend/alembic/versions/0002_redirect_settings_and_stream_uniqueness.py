"""add redirect setting tab behavior and stream uniqueness

Revision ID: 0002_redirect_streams
Revises: 0001_initial
Create Date: 2026-03-24 00:30:00
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0002_redirect_streams"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "redirect_settings",
        sa.Column("open_in_new_tab", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.create_unique_constraint(
        "uq_stream_links_external_match_id",
        "stream_links",
        ["external_match_id"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_stream_links_external_match_id", "stream_links", type_="unique")
    op.drop_column("redirect_settings", "open_in_new_tab")
