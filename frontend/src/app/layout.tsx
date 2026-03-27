import type { Metadata } from "next";
import { cookies } from "next/headers";

import "./globals.css";
import { defaultLocale, getDirection, isLocale } from "@/i18n";

export const metadata: Metadata = {
  title: "Melbet Live",
  description: "Bilingual sports platform frontend",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("melbet-locale")?.value ?? defaultLocale;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return (
    <html lang={locale} dir={getDirection(locale)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
