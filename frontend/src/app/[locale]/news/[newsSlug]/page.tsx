import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsArticleView } from "@/features/news/NewsArticleView";
import { getMessages, isLocale } from "@/i18n";
import { getNewsArticle } from "@/lib/api";
import { newsJsonLd, newsMetadata, safeJsonLd } from "@/lib/seo";

export const revalidate = 21600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; newsSlug: string }>;
}): Promise<Metadata> {
  const { locale, newsSlug } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  try {
    const article = await getNewsArticle(newsSlug, locale);
    return newsMetadata(article, locale);
  } catch {
    return {
      title: "Article not found | Goal Stream",
      robots: { index: false, follow: false },
    };
  }
}

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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(newsJsonLd(article, locale)) }}
      />
      <NewsArticleView locale={locale} messages={messages} article={article} />
    </>
  );
}
