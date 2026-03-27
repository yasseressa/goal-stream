from __future__ import annotations


def test_admin_streams_requires_auth(client):
    response = client.get("/api/v1/admin/streams")

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required"
