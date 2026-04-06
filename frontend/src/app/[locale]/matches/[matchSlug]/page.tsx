import { notFound } from "next/navigation";

import { MatchDetailsView } from "@/features/matches/MatchDetailsView";
import { getMessages, isLocale } from "@/i18n";
import { getMatchDetails } from "@/lib/api";
import { ApiError } from "@/lib/api/client";

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
    return <MatchDetailsView locale={locale} messages={messages} match={data} />;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
