from __future__ import annotations

from app.models.stream_link import StreamLink


def test_stream_type_enum_uses_database_values():
    enum_type = StreamLink.__table__.c.stream_type.type

    assert enum_type.enums == ["hls", "iframe", "embed", "external"]
