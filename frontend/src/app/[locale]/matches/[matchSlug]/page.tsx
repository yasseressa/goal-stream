import { notFound } from "next/navigation";

import { MatchDetailsView } from "@/features/matches/MatchDetailsView";
import { getMessages, isLocale } from "@/i18n";
import { getMatchDetails } from "@/lib/api";

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
  const [messages, data] = await Promise.all([getMessages(locale), getMatchDetails(matchId, locale)]);

  return <MatchDetailsView locale={locale} messages={messages} match={data} />;
}
