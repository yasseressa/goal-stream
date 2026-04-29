"use client";

import { useEffect, useState } from "react";

import { MatchListSection } from "@/components/matches/MatchListSection";
import type { Locale, Messages } from "@/i18n";
import type { HomeResponse, MatchSummary } from "@/lib/api/types";
import { getMatchBucket } from "@/lib/utils";

export function MatchesPageView({ locale, messages, data }: { locale: Locale; messages: Messages; data: HomeResponse }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const groupedMatches = { yesterday: [] as MatchSummary[], today: [] as MatchSummary[], tomorrow: [] as MatchSummary[] };
  const seenMatchIds = new Set<string>();

  for (const match of [...data.yesterday_matches, ...data.today_matches, ...data.tomorrow_matches]) {
    if (seenMatchIds.has(match.external_match_id)) {
      continue;
    }

    seenMatchIds.add(match.external_match_id);

    const bucketId = getMatchBucket(match.start_time, now);
    if (bucketId) {
      groupedMatches[bucketId].push(match);
    }
  }

  return (
    <div className="space-y-5 pb-8">
      <MatchListSection locale={locale} title={messages.todayMatches} matches={groupedMatches.today} emptyLabel={messages.empty} messages={messages} />
      <MatchListSection locale={locale} title={messages.tomorrowMatches} matches={groupedMatches.tomorrow} emptyLabel={messages.empty} messages={messages} />
      <MatchListSection locale={locale} title={messages.yesterdayMatches} matches={groupedMatches.yesterday} emptyLabel={messages.empty} messages={messages} />
    </div>
  );
}
