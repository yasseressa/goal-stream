import Link from "next/link";

import { MatchPlayer } from "@/components/matches/MatchPlayer";
import { NewsListSection } from "@/components/news/NewsListSection";
import { Card } from "@/components/ui/Card";
import type { Locale, Messages } from "@/i18n";
import type { MatchDetails } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

export function MatchDetailsView({ locale, messages, match }: { locale: Locale; messages: Messages; match: MatchDetails }) {
  return (
    <div className="space-y-8">
      <Card className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500">{match.competition_name}</p>
          <h1 className="text-4xl font-black text-pitch-900">{match.home_team} vs {match.away_team}</h1>
          <p className="text-sm text-pitch-700">{formatDate(match.start_time, locale)}</p>
          {match.description ? <p className="text-base leading-7 text-pitch-700">{match.description}</p> : null}
        </div>
        <div className="rounded-[1.5rem] bg-pitch-900 p-5 text-white shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">{messages.matchCenter}</p>
          <p className="mt-3 text-lg font-bold">{match.venue || match.status}</p>
          <Link href={`/${locale}`} className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-pitch-900" data-disable-global-redirect>
            {messages.backHome}
          </Link>
        </div>
      </Card>
      <MatchPlayer stream={match.stream_link} canShowPlayer={match.can_show_player} messages={messages} />
      <NewsListSection locale={locale} title={messages.relatedNews} articles={match.related_news} emptyLabel={messages.empty} readMoreLabel={messages.readMore} />
    </div>
  );
}
