from __future__ import annotations

from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_db_session
from app.main import app


class FakeSession:
    async def execute(self, *_args, **_kwargs):
        return SimpleNamespace()


@pytest.fixture
def client():
    async def override_db_session():
        yield FakeSession()

    app.dependency_overrides[get_db_session] = override_db_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
