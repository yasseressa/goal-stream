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
          <div className="flex items-center gap-3">
            {match.competition_emblem ? <Logo src={match.competition_emblem} alt={match.competition_name} size="sm" /> : null}
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f4bb41]">{match.competition_name}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="flex items-center gap-3">
              <Logo src={match.home_team_crest} alt={match.home_team} />
              <h1 className="text-3xl font-black text-[#f7f0e2]">{match.home_team}</h1>
            </div>
            <p className="text-center text-lg font-black text-[#b79c62]">{messages.versus}</p>
            <div className="flex items-center justify-start gap-3 md:justify-end">
              <h2 className="text-3xl font-black text-[#f7f0e2]">{match.away_team}</h2>
              <Logo src={match.away_team_crest} alt={match.away_team} />
            </div>
          </div>
          <p className="text-sm text-[#ccb992]">{formatDate(match.start_time, locale)}</p>
          {match.description ? <p className="text-base leading-7 text-[#efe5d3]">{match.description}</p> : null}
        </div>
        <div className="rounded-[1.5rem] border border-[#4b3818] bg-[linear-gradient(180deg,_#1d1711,_#121212)] p-5 text-[#f7f0e2] shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f4bb41]">{messages.matchCenter}</p>
          <p className="mt-3 text-lg font-bold">{match.venue || statusLabel(match.status, messages)}</p>
          <Link href={`/${locale}`} className="mt-6 inline-flex rounded-full bg-[#f4bb41] px-4 py-2 text-sm font-semibold text-[#17120d]" data-disable-global-redirect>
            {messages.backHome}
          </Link>
        </div>
      </Card>
      <MatchPlayer stream={match.stream_link} canShowPlayer={match.can_show_player} messages={messages} />
      <NewsListSection locale={locale} title={messages.relatedNews} articles={match.related_news} emptyLabel={messages.empty} readMoreLabel={messages.readMore} />
    </div>
  );
}

function Logo({ src, alt, size = "md" }: { src?: string | null; alt: string; size?: "sm" | "md" }) {
  const boxClass = size === "sm" ? "h-10 w-10" : "h-14 w-14";

  if (!src) {
    return <div className={`${boxClass} rounded-full border border-[#4b3818] bg-[#17120d]`} aria-hidden="true" />;
  }

  return (
    <div className={`${boxClass} flex items-center justify-center rounded-full border border-[#4b3818] bg-[#17120d] p-2`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-contain" loading="lazy" referrerPolicy="no-referrer" />
    </div>
  );
}

function statusLabel(status: string, messages: Messages) {
  const normalized = status.toLowerCase();
  if (normalized === "live") return messages.liveNowLabel;
  if (normalized === "finished") return messages.finished;
  if (normalized === "scheduled") return messages.comingUp;
  if (normalized === "postponed") return messages.postponed;
  if (normalized === "cancelled") return messages.cancelled;
  return status;
}
