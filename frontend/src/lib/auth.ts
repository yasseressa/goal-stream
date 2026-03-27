import { siteConfig } from "@/config/site";

export function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
}

export function getAdminToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(siteConfig.adminStorageKey);
}

export function setAdminToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(siteConfig.adminStorageKey, token);
  }
}

export function clearAdminToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(siteConfig.adminStorageKey);
  }
}
