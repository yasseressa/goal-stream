"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import type { Locale, Messages } from "@/i18n";
import { clearAdminToken, getAdminToken, isAdminSessionExpired, onAdminSessionExpired } from "@/lib/auth";

export function AdminShell({ children, locale, messages }: { children: React.ReactNode; locale: Locale; messages: Messages }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname.endsWith("/admin/login");
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    function sendToLogin(expired = false) {
      const query = expired ? "?expired=1" : "";
      router.replace(`/${locale}/admin/login${query}`);
    }

    function verifySession() {
      const expired = isAdminSessionExpired();
      const token = getAdminToken();
      setAuthenticated(Boolean(token));
      setReady(true);
      if (!token && !isLoginPage) {
        sendToLogin(expired);
      }
    }

    verifySession();

    const intervalId = window.setInterval(verifySession, 1000);
    const removeSessionListener = onAdminSessionExpired(() => {
      setAuthenticated(false);
      setReady(true);
      if (!isLoginPage) {
        sendToLogin(true);
      }
    });

    return () => {
      window.clearInterval(intervalId);
      removeSessionListener();
    };
  }, [isLoginPage, locale, router]);

  const links = useMemo(
    () => [
      { href: `/${locale}/admin`, label: messages.dashboard },
      { href: `/${locale}/admin/streams`, label: messages.streamLinks },
      { href: `/${locale}/admin/redirects`, label: messages.redirects },
      { href: `/${locale}/admin/socials`, label: messages.socialLinks },
      { href: `/${locale}`, label: messages.publicSite },
    ],
    [locale, messages.dashboard, messages.publicSite, messages.redirects, messages.socialLinks, messages.streamLinks],
  );

  if (isLoginPage) {
    return <div className="min-h-screen bg-[var(--background)]">{children}</div>;
  }

  if (!ready || !authenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-[#eceef2] text-[#931800]">{messages.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-[#eceef2] text-[#222]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-lg bg-white p-5 text-[#222] shadow-[0_0_4px_rgba(0,0,0,0.3)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#931800]">{siteConfig.name}</p>
          <div className="mt-4 flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher locale={locale} />
          </div>
          <nav className="mt-8 space-y-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-lg px-4 py-3 text-sm font-semibold transition hover:bg-[#eceef2] hover:text-[#931800]">
                {link.label}
              </Link>
            ))}
          </nav>
          <Button
            className="mt-8 w-full"
            variant="secondary"
            onClick={() => {
              clearAdminToken();
              router.replace(`/${locale}/admin/login`);
            }}
          >
            {messages.logout}
          </Button>
        </aside>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}


