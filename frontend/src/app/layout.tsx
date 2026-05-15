import type { Metadata } from "next";
import { cookies } from "next/headers";

import "./globals.css";
import { defaultLocale, getDirection, isLocale } from "@/i18n";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Goal Stream",
  title: {
    default: "Goal Stream - Live football matches and sports news",
    template: "%s",
  },
  description: "Follow live football fixtures, match streams, schedules, scores, and the latest sports news on Goal Stream.",
  category: "sports",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Goal Stream",
  },
  twitter: {
    card: "summary",
    site: "Goal Stream",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("goal-stream-locale")?.value ?? defaultLocale;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return (
    <html lang={locale} dir={getDirection(locale)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var theme=localStorage.getItem("goal-stream-theme");document.documentElement.dataset.theme=theme==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
