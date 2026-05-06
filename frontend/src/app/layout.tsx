import type { Metadata } from "next";
import { cookies } from "next/headers";

import "./globals.css";
import { defaultLocale, getDirection, isLocale } from "@/i18n";

export const metadata: Metadata = {
  title: "King Live",
  description: "Multilingual football matches and news platform",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("kinglive-locale")?.value ?? defaultLocale;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return (
    <html lang={locale} dir={getDirection(locale)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var theme=localStorage.getItem("kinglive-theme");document.documentElement.dataset.theme=theme==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
