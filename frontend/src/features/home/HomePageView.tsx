import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { Locale, Messages } from "@/i18n";
import type { HomeResponse } from "@/lib/api/types";
import { MatchListSection } from "@/components/matches/MatchListSection";
import { NewsListSection } from "@/components/news/NewsListSection";

export function HomePageView({ locale, messages, data }: { locale: Locale; messages: Messages; data: HomeResponse }) {
  return (
    <div className="space-y-10">
      <Card className="overflow-hidden bg-gradient-to-br from-pitch-900 via-pitch-700 to-pitch-600 text-white">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent-400">{messages.liveNow}</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{messages.matchCenter}</h1>
            <p className="max-w-2xl text-base text-white/80">{messages.latestHeadlines}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">{messages.publicSite}</p>
            <div className="mt-4 space-y-3 text-sm text-white/85">
              <p>{data.today_matches[0]?.home_team ?? "-"}</p>
              <p>{data.today_matches[0]?.away_team ?? "-"}</p>
              <Link href={`/${locale}#news`} className="inline-flex rounded-full bg-white px-4 py-2 font-semibold text-pitch-900" data-disable-global-redirect>
                {messages.sportsNews}
              </Link>
            </div>
          </div>
        </div>
      </Card>
      <MatchListSection locale={locale} title={messages.yesterdayMatches} matches={data.yesterday_matches} emptyLabel={messages.empty} />
      <MatchListSection locale={locale} title={messages.todayMatches} matches={data.today_matches} emptyLabel={messages.empty} />
      <MatchListSection locale={locale} title={messages.tomorrowMatches} matches={data.tomorrow_matches} emptyLabel={messages.empty} />
      <NewsListSection locale={locale} title={messages.sportsNews} articles={data.latest_news} emptyLabel={messages.empty} readMoreLabel={messages.readMore} />
    </div>
  );
}
