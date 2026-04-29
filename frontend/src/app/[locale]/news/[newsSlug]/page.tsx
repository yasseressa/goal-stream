import { notFound } from "next/navigation";

import { NewsArticleView } from "@/features/news/NewsArticleView";
import { getMessages, isLocale } from "@/i18n";
import { getNewsArticle } from "@/lib/api";

export const revalidate = 21600;

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string; newsSlug: string }>;
}) {
  const { locale, newsSlug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const [messages, article] = await Promise.all([getMessages(locale), getNewsArticle(newsSlug, locale)]);
  return <NewsArticleView locale={locale} messages={messages} article={article} />;
}
