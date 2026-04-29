"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getRedirectConfig } from "@/lib/api";
import type { RedirectConfig } from "@/lib/api/types";

const interactiveTags = new Set(["A", "INPUT", "TEXTAREA", "SELECT", "OPTION", "BUTTON", "LABEL"]);

export function GlobalClickRedirectProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const configRef = useRef<RedirectConfig | null>(null);
  const configRequestRef = useRef<Promise<RedirectConfig | null> | null>(null);

  useEffect(() => {
    if (pathname.includes("/admin")) {
      return;
    }

    refreshRedirectConfig()
      .then((config) => {
        configRef.current = config;
      })
      .catch(() => {
        configRef.current = null;
      });
  }, [pathname]);

  useEffect(() => {
    if (pathname.includes("/admin")) {
      return;
    }

    const handleClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      if (interactiveTags.has(target.tagName) || target.closest("[data-disable-global-redirect]")) {
        return;
      }

      const config = await refreshRedirectConfig();
      if (!config?.enabled || !config.target_url) {
        return;
      }

      const now = Date.now();
      const lastRedirect = Number(window.localStorage.getItem(siteConfig.redirectStorageKey) || 0);
      if (now - lastRedirect < config.interval_seconds * 1000) {
        return;
      }

      window.localStorage.setItem(siteConfig.redirectStorageKey, String(now));
      if (config.open_in_new_tab) {
        window.open(config.target_url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = config.target_url;
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  async function refreshRedirectConfig() {
    if (!configRequestRef.current) {
      configRequestRef.current = getRedirectConfig()
        .then((config) => {
          configRef.current = config;
          return config;
        })
        .catch(() => {
          configRef.current = null;
          return null;
        })
        .finally(() => {
          configRequestRef.current = null;
        });
    }

    return configRequestRef.current;
  }

  return <>{children}</>;
}
