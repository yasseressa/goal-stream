from __future__ import annotations

import logging
import pickle
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from threading import RLock
from typing import Any

from app.core.config import settings

logger = logging.getLogger(__name__)


class CacheBackend(ABC):
    @abstractmethod
    def get(self, key: str) -> Any | None:
        raise NotImplementedError

    @abstractmethod
    def get_stale(self, key: str) -> Any | None:
        raise NotImplementedError

    @abstractmethod
    def set(self, key: str, value: Any, ttl_seconds: int) -> None:
        raise NotImplementedError

    @abstractmethod
    def delete(self, key: str) -> None:
        raise NotImplementedError


@dataclass
class CacheEntry:
    value: Any
    expires_at: datetime


class InMemoryCacheBackend(CacheBackend):
    def __init__(self) -> None:
        self._store: dict[str, CacheEntry] = {}
        self._lock = RLock()

    def get(self, key: str) -> Any | None:
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                logger.info("cache_miss", extra={"cache_key": key})
                return None

            if entry.expires_at <= datetime.now(UTC):
                logger.info("cache_expired", extra={"cache_key": key})
                return None

            logger.info("cache_hit", extra={"cache_key": key})
            return entry.value

    def get_stale(self, key: str) -> Any | None:
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                logger.info("cache_stale_miss", extra={"cache_key": key})
                return None

            logger.info("cache_stale_hit", extra={"cache_key": key})
            return entry.value

    def set(self, key: str, value: Any, ttl_seconds: int) -> None:
        expires_at = datetime.now(UTC) + timedelta(seconds=ttl_seconds)
        with self._lock:
            self._store[key] = CacheEntry(value=value, expires_at=expires_at)
        logger.info("cache_set", extra={"cache_key": key, "ttl_seconds": ttl_seconds})

    def delete(self, key: str) -> None:
        with self._lock:
            self._store.pop(key, None)
        logger.info("cache_delete", extra={"cache_key": key})


class RedisCacheBackend(CacheBackend):
    def __init__(
        self,
        redis_url: str,
        *,
        key_prefix: str,
        stale_ttl_seconds: int,
        fallback: CacheBackend | None = None,
    ) -> None:
        from redis import Redis
        from redis.exceptions import RedisError

        self._redis_error = RedisError
        self._client = Redis.from_url(redis_url, socket_connect_timeout=2, socket_timeout=2)
        self._key_prefix = key_prefix.strip(":") or "cache"
        self._stale_ttl_seconds = stale_ttl_seconds
        self._fallback = fallback

    def get(self, key: str) -> Any | None:
        entry = self._get_entry(key)
        if entry is None:
            return self._fallback.get(key) if self._fallback is not None else None

        if entry.expires_at <= datetime.now(UTC):
            logger.info("cache_expired", extra={"cache_key": key, "cache_backend": "redis"})
            return None

        logger.info("cache_hit", extra={"cache_key": key, "cache_backend": "redis"})
        return entry.value

    def get_stale(self, key: str) -> Any | None:
        entry = self._get_entry(key)
        if entry is None:
            return self._fallback.get_stale(key) if self._fallback is not None else None

        logger.info("cache_stale_hit", extra={"cache_key": key, "cache_backend": "redis"})
        return entry.value

    def set(self, key: str, value: Any, ttl_seconds: int) -> None:
        if self._fallback is not None:
            self._fallback.set(key, value, ttl_seconds)

        entry = CacheEntry(value=value, expires_at=datetime.now(UTC) + timedelta(seconds=ttl_seconds))
        redis_ttl_seconds = max(ttl_seconds + self._stale_ttl_seconds, ttl_seconds)
        try:
            self._client.setex(self._redis_key(key), redis_ttl_seconds, pickle.dumps(entry))
        except self._redis_error:
            logger.exception("redis_cache_set_failed", extra={"cache_key": key})
            return

        logger.info("cache_set", extra={"cache_key": key, "ttl_seconds": ttl_seconds, "cache_backend": "redis"})

    def delete(self, key: str) -> None:
        if self._fallback is not None:
            self._fallback.delete(key)

        try:
            self._client.delete(self._redis_key(key))
        except self._redis_error:
            logger.exception("redis_cache_delete_failed", extra={"cache_key": key})
            return

        logger.info("cache_delete", extra={"cache_key": key, "cache_backend": "redis"})

    def ping(self) -> None:
        self._client.ping()

    def _get_entry(self, key: str) -> CacheEntry | None:
        try:
            raw_value = self._client.get(self._redis_key(key))
        except self._redis_error:
            logger.exception("redis_cache_get_failed", extra={"cache_key": key})
            return None

        if raw_value is None:
            logger.info("cache_miss", extra={"cache_key": key, "cache_backend": "redis"})
            return None

        try:
            entry = pickle.loads(raw_value)
        except (pickle.PickleError, AttributeError, EOFError, TypeError, ValueError):
            logger.exception("redis_cache_decode_failed", extra={"cache_key": key})
            self.delete(key)
            return None

        if not isinstance(entry, CacheEntry):
            logger.warning("redis_cache_unexpected_entry", extra={"cache_key": key})
            self.delete(key)
            return None

        return entry

    def _redis_key(self, key: str) -> str:
        return f"{self._key_prefix}:{key}"


def create_cache_backend() -> CacheBackend:
    fallback = InMemoryCacheBackend()
    redis_url = settings.redis_url.strip()
    if not redis_url:
        logger.info("cache_backend_selected", extra={"cache_backend": "memory"})
        return fallback

    try:
        backend = RedisCacheBackend(
            redis_url,
            key_prefix=settings.redis_key_prefix,
            stale_ttl_seconds=settings.cache_stale_ttl_seconds,
            fallback=fallback,
        )
        backend.ping()
    except Exception:
        logger.exception("redis_cache_unavailable_using_memory")
        return fallback

    logger.info("cache_backend_selected", extra={"cache_backend": "redis"})
    return backend


class CacheKeys:
    @staticmethod
    def home_matches(locale: str, bucket: str, match_date: str | None = None) -> str:
        suffix = f":{match_date}" if match_date else ""
        return f"home:matches:{locale}:{bucket}{suffix}"

    @staticmethod
    def home_news(locale: str) -> str:
        return f"home:news:{locale}"

    @staticmethod
    def match_details(match_id: str, locale: str) -> str:
        return f"match:details:{match_id}:{locale}"

    @staticmethod
    def related_news(match_id: str, locale: str) -> str:
        return f"match:related-news:{match_id}:{locale}"

    @staticmethod
    def article(identifier: str, locale: str) -> str:
        return f"news:article:{identifier}:{locale}"

    @staticmethod
    def latest_news(locale: str) -> str:
        return f"news:latest:{locale}"

    @staticmethod
    def redirect_config() -> str:
        return "redirect:config"
