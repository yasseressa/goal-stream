from __future__ import annotations

import logging
import sys

from pythonjsonlogger.json import JsonFormatter

from app.core.config import settings


def configure_logging() -> None:
    handler = logging.StreamHandler(sys.stdout)
    formatter = (
        JsonFormatter("%(asctime)s %(levelname)s %(name)s %(message)s")
        if settings.log_json
        else logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s")
    )
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.setLevel(settings.log_level.upper())
    root_logger.addHandler(handler)
