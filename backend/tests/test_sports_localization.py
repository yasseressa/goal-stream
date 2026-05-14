from app.integrations.sports.localization import localize_sports_text


def test_localize_sports_text_keeps_english_for_en_locale():
    assert localize_sports_text("Arsenal", "en") == "Arsenal"


def test_localize_sports_text_translates_known_names_for_ar_locale():
    assert localize_sports_text("Arsenal", "ar") == "أرسنال"
    assert localize_sports_text("Premier League", "ar", entity_type="league", country="England") == "الدوري الإنجليزي الممتاز"


def test_localize_sports_text_does_not_generate_translations_for_unknown_phrases():
    phrase = "Arsenal vs Chelsea in Premier League"

    assert localize_sports_text(phrase, "ar") == phrase
