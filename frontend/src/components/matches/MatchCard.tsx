import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { Locale } from "@/i18n";
import type { MatchSummary } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

export function MatchCard({ locale, match }: { locale: Locale; match: MatchSummary }) {
  return (
    <Card className="flex h-full flex-col justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500">{match.competition_name}</p>
        <div className="mt-3 space-y-2 text-lg font-black text-pitch-900">
          <p>{match.home_team}</p>
          <p className="text-pitch-600">vs</p>
          <p>{match.away_team}</p>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-pitch-700">{formatDate(match.start_time, locale)}</p>
        <Link
          href={`/${locale}/matches/${encodeURIComponent(match.external_match_id)}`}
          className="inline-flex rounded-full bg-pitch-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pitch-700"
        >
          {match.status}
        </Link>
      </div>
    </Card>
  );
}
