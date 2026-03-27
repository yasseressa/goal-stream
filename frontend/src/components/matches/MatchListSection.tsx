import type { Locale, Messages } from "@/i18n";
import type { MatchSummary } from "@/lib/api/types";

import { EmptyState } from "@/components/system/EmptyState";
import { MatchCard } from "@/components/matches/MatchCard";

export function MatchListSection({
  locale,
  title,
  matches,
  emptyLabel,
}: {
  locale: Locale;
  title: string;
  matches: MatchSummary[];
  emptyLabel: string;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-pitch-900">{title}</h2>
        <div className="h-px flex-1 bg-pitch-100 ms-4" />
      </div>
      {matches.length === 0 ? (
        <EmptyState message={emptyLabel} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.external_match_id} locale={locale} match={match} />
          ))}
        </div>
      )}
    </section>
  );
}
