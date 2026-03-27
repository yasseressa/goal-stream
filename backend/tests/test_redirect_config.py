from __future__ import annotations

from app.api.deps import get_redirect_service
from app.main import app
from app.schemas.redirect import RedirectConfigResponse


class StubRedirectService:
    async def get_public_config(self) -> RedirectConfigResponse:
        return RedirectConfigResponse(
            enabled=True,
            interval_seconds=45,
            target_url="https://example.com/offer",
            open_in_new_tab=True,
        )


def test_redirect_config_endpoint(client):
    app.dependency_overrides[get_redirect_service] = lambda: StubRedirectService()
    response = client.get("/api/v1/redirect/config")
    app.dependency_overrides.pop(get_redirect_service, None)

    assert response.status_code == 200
    assert response.json()["enabled"] is True
    assert response.json()["interval_seconds"] == 45
