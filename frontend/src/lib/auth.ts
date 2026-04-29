import { siteConfig } from "@/config/site";

const adminSessionDurationMs = 10 * 60 * 1000;
const adminSessionExpiredEvent = "admin-session-expired";

function normalizeApiBaseUrl(value?: string) {
  if (!value) {
    return "";
  }

  return value.startsWith("http://") || value.startsWith("https://") ? value : `http://${value}`;
}

export function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return normalizeApiBaseUrl(
      process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    );
  }

  return "";
}

export function getAdminToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const expiresAt = getAdminSessionExpiresAt();
  if (expiresAt !== null && expiresAt <= Date.now()) {
    clearAdminToken();
    window.dispatchEvent(new Event(adminSessionExpiredEvent));
    return null;
  }

  return window.localStorage.getItem(siteConfig.adminStorageKey);
}

export function setAdminToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(siteConfig.adminStorageKey, token);
    window.localStorage.setItem(siteConfig.adminExpiresStorageKey, String(Date.now() + adminSessionDurationMs));
  }
}

export function clearAdminToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(siteConfig.adminStorageKey);
    window.localStorage.removeItem(siteConfig.adminExpiresStorageKey);
  }
}

export function getAdminSessionExpiresAt() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(siteConfig.adminExpiresStorageKey);
  if (!rawValue) {
    return null;
  }

  const expiresAt = Number(rawValue);
  return Number.isFinite(expiresAt) ? expiresAt : null;
}

export function isAdminSessionExpired() {
  const expiresAt = getAdminSessionExpiresAt();
  return expiresAt !== null && expiresAt <= Date.now();
}

export function notifyAdminSessionExpired() {
  if (typeof window !== "undefined") {
    clearAdminToken();
    window.dispatchEvent(new Event(adminSessionExpiredEvent));
  }
}

export function onAdminSessionExpired(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(adminSessionExpiredEvent, listener);
  return () => window.removeEventListener(adminSessionExpiredEvent, listener);
}
