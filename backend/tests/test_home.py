from __future__ import annotations


def test_home_endpoint_returns_expected_sections(client):
    response = client.get("/api/v1/home?locale=en")

    assert response.status_code == 200
    payload = response.json()
    assert set(payload.keys()) == {
        "yesterday_matches",
        "today_matches",
        "tomorrow_matches",
        "latest_news",
    }
    assert len(payload["today_matches"]) > 0
    assert len(payload["latest_news"]) > 0
