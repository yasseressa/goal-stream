"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getRedirectConfig } from "@/lib/api";
import type { RedirectConfig } from "@/lib/api/types";

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
      const shouldPrepareNewTab = configRef.current?.open_in_new_tab !== false;
      const redirectTab = shouldPrepareNewTab ? window.open("about:blank", "_blank", "noopener,noreferrer") : null;
      const config = await refreshRedirectConfig();
      if (!config?.enabled || !config.target_url) {
        redirectTab?.close();
        return;
      }

      const now = Date.now();
      const lastRedirect = Number(window.localStorage.getItem(siteConfig.redirectStorageKey) || 0);
      if (now - lastRedirect < config.interval_seconds * 1000) {
        redirectTab?.close();
        return;
      }

      window.localStorage.setItem(siteConfig.redirectStorageKey, String(now));
      event.preventDefault();
      event.stopPropagation();
      if (config.open_in_new_tab) {
        if (redirectTab) {
          redirectTab.location.href = config.target_url;
        } else {
          window.open(config.target_url, "_blank", "noopener,noreferrer");
        }
      } else {
        redirectTab?.close();
        window.location.href = config.target_url;
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
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
