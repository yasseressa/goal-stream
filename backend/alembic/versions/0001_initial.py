"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-03-24 00:00:00
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


stream_type_enum = postgresql.ENUM("hls", "iframe", "embed", "external", name="streamtype")
stream_type_column = postgresql.ENUM("hls", "iframe", "embed", "external", name="streamtype", create_type=False)


def upgrade() -> None:
    stream_type_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "admin_users",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("is_superuser", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("TIMEZONE('utc', NOW())")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("TIMEZONE('utc', NOW())")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("username"),
    )
    op.create_index(op.f("ix_admin_users_email"), "admin_users", ["email"], unique=False)
    op.create_index(op.f("ix_admin_users_username"), "admin_users", ["username"], unique=False)

    op.create_table(
        "redirect_campaigns",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("target_url", sa.String(length=2048), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("cooldown_seconds", sa.Integer(), nullable=False, server_default=sa.text("30")),
        sa.Column("start_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("end_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("TIMEZONE('utc', NOW())")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("TIMEZONE('utc', NOW())")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_redirect_campaigns_name"), "redirect_campaigns", ["name"], unique=False)

    op.create_table(
        "redirect_settings",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("default_cooldown_seconds", sa.Integer(), nullable=False, server_default=sa.text("30")),
        sa.Column("fallback_url", sa.String(length=2048), nullable=True),
        sa.Column("active_campaign_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("TIMEZONE('utc', NOW())")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("TIMEZONE('utc', NOW())")),
        sa.ForeignKeyConstraint(["active_campaign_id"], ["redirect_campaigns.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "stream_links",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("external_match_id", sa.String(length=255), nullable=False),
        sa.Column("stream_url", sa.String(length=2048), nullable=False),
        sa.Column("stream_type", stream_type_column, nullable=False),
        sa.Column("show_stream", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("TIMEZONE('utc', NOW())")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("TIMEZONE('utc', NOW())")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_stream_links_external_match_id"), "stream_links", ["external_match_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_stream_links_external_match_id"), table_name="stream_links")
    op.drop_table("stream_links")
    op.drop_table("redirect_settings")
    op.drop_index(op.f("ix_redirect_campaigns_name"), table_name="redirect_campaigns")
    op.drop_table("redirect_campaigns")
    op.drop_index(op.f("ix_admin_users_username"), table_name="admin_users")
    op.drop_index(op.f("ix_admin_users_email"), table_name="admin_users")
    op.drop_table("admin_users")
    stream_type_enum.drop(op.get_bind(), checkfirst=True)
