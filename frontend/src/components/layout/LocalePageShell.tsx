"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopSocialBar } from "@/components/layout/TopSocialBar";
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
    <div className="flex min-h-screen flex-col bg-[#050505]">
      <TopSocialBar locale={locale} messages={messages} />
      <Header locale={locale} messages={messages} />
      <main className="mx-auto min-h-[calc(100vh-220px)] w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
