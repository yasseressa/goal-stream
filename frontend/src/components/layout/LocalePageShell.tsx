"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { Locale, Messages } from "@/i18n";

export function LocalePageShell({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: Locale;
  messages: Messages;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.includes(`/${locale}/admin`);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#040404]">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto min-h-[calc(100vh-180px)] w-full max-w-[1400px] px-2.5 py-3 min-[380px]:px-3 min-[420px]:py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
        {children}
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
