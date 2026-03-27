import { notFound } from "next/navigation";

import { HomePageView } from "@/features/home/HomePageView";
import { getMessages, isLocale } from "@/i18n";
import { getHomePageData } from "@/lib/api";

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const [messages, data] = await Promise.all([getMessages(locale), getHomePageData(locale)]);
  return <HomePageView locale={locale} messages={messages} data={data} />;
}
