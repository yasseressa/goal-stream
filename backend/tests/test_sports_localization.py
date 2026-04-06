from app.integrations.sports.localization import localize_sports_text


def test_localize_sports_text_keeps_english_for_en_locale():
    assert localize_sports_text("Arsenal", "en") == "Arsenal"


def test_localize_sports_text_translates_known_names_for_ar_locale():
    assert localize_sports_text("Arsenal", "ar") == "أرسنال"
    assert localize_sports_text("Premier League", "ar") == "الدوري الإنجليزي الممتاز"


def test_localize_sports_text_translates_known_phrases_inside_sentences():
    assert localize_sports_text("Arsenal vs Chelsea in Premier League", "ar") == "أرسنال ضد تشيلسي في الدوري الإنجليزي الممتاز"
