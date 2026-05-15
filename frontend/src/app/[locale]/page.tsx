import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomePageView } from "@/features/home/HomePageView";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { getHomePageData } from "@/lib/api";
import type { HomeResponse } from "@/lib/api/types";
import { basePageMetadata, safeJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const emptyHomePageData: HomeResponse = {
  yesterday_matches: [],
  today_matches: [],
  tomorrow_matches: [],
  latest_news: [],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return basePageMetadata(locale);
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const [messages, data] = await Promise.all([
    getMessages(locale),
    getHomePageData(locale).catch((error) => {
      console.error("home_page_data_load_failed", error);
      return emptyHomePageData;
    }),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd(locale as Locale)) }}
      />
      <HomePageView locale={locale} messages={messages} data={data} />
    </>
  );
}
