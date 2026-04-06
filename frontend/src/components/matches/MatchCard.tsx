import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { Locale, Messages } from "@/i18n";
import type { MatchSummary } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

export function MatchCard({ locale, match, messages }: { locale: Locale; match: MatchSummary; messages: Messages }) {
  return (
    <Card className="flex h-full flex-col justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f4bb41]">{match.competition_name}</p>
        <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3 text-lg font-black text-[#f7f0e2]">
          <TeamLogo src={match.home_team_crest} alt={match.home_team} />
          <div className="space-y-2 text-center">
            <p>{match.home_team}</p>
            <p className="text-[#b79c62]">{messages.versus}</p>
            <p>{match.away_team}</p>
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
          className="inline-flex rounded-full bg-[#f4bb41] px-4 py-2 text-sm font-semibold text-[#17120d] transition hover:bg-[#ffd06f]"
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
    return <div className="h-11 w-11 rounded-full border border-[#4b3818] bg-[#17120d]" aria-hidden="true" />;
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#4b3818] bg-[#17120d] p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-contain" loading="lazy" referrerPolicy="no-referrer" />
    </div>
  );
}
