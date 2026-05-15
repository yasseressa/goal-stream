import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MatchDetailsView } from "@/features/matches/MatchDetailsView";
import { getMessages, isLocale } from "@/i18n";
import { getMatchDetails } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { matchJsonLd, matchMetadata, safeJsonLd } from "@/lib/seo";

export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; matchSlug: string }>;
}): Promise<Metadata> {
  const { locale, matchSlug } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  try {
    const data = await getMatchDetails(decodeURIComponent(matchSlug), locale);
    return matchMetadata(data, locale);
  } catch {
    return {
      title: "Match not found | Goal Stream",
      robots: { index: false, follow: false },
    };
  }
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ locale: string; matchSlug: string }>;
}) {
  const { locale, matchSlug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const matchId = decodeURIComponent(matchSlug);
  const messages = await getMessages(locale);

  try {
    const data = await getMatchDetails(matchId, locale);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(matchJsonLd(data, locale)) }}
        />
        <MatchDetailsView locale={locale} messages={messages} match={data} />
      </>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
