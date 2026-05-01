from app.integrations.sports.localization import localize_sports_text


def test_localize_sports_text_uses_csv_for_supported_locales():
    assert localize_sports_text("English Premier League", "ar") == "الدوري الإنجليزي الممتاز"
    assert localize_sports_text("English Premier League", "fr") == "Premier League anglaise"
    assert localize_sports_text("English Premier League", "es") == "Premier League inglesa"


def test_localize_sports_text_matches_names_with_common_prefixes():
    assert localize_sports_text("FC Arsenal", "ar") == "أرسنال"
    assert localize_sports_text("Arsenal FC", "fr") == "Arsenal"
