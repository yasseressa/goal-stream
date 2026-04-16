import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { Locale, Messages } from "@/i18n";
import type { MatchSummary } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

export function MatchCard({ locale, match, messages }: { locale: Locale; match: MatchSummary; messages: Messages }) {
  return (
    <Card className="flex h-full flex-col justify-between gap-4 p-4 min-[420px]:p-5">
      <div>
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#f4bb41] min-[420px]:text-xs min-[420px]:tracking-[0.3em]">{match.competition_name}</p>
        <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2.5 text-base font-black text-[#f7f0e2] min-[420px]:gap-3 min-[420px]:text-lg">
          <TeamLogo src={match.home_team_crest} alt={match.home_team} />
          <div className="min-w-0 space-y-2 text-center">
            <p className="truncate">{match.home_team}</p>
            <p className="text-sm text-[#b79c62] min-[420px]:text-base">{messages.versus}</p>
            <p className="truncate">{match.away_team}</p>
          </div>
          <TeamLogo src={match.away_team_crest} alt={match.away_team} />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-[#ccb992]">{formatDate(match.start_time, locale)}</p>
        <Link
          href={`/${locale}/matches/${encodeURIComponent(match.external_match_id)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[2.75rem] items-center justify-center rounded-full bg-[#f4bb41] px-4 py-2 text-sm font-semibold text-[#17120d] transition hover:bg-[#ffd06f]"
          data-disable-global-redirect
        >
          {messages.watch}
        </Link>
      </div>
    </Card>
  );
}

function TeamLogo({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return <div className="h-10 w-10 rounded-full border border-[#4b3818] bg-[#17120d] min-[420px]:h-11 min-[420px]:w-11" aria-hidden="true" />;
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4b3818] bg-[#17120d] p-2 min-[420px]:h-11 min-[420px]:w-11">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-contain" loading="lazy" referrerPolicy="no-referrer" />
    </div>
  );
}
