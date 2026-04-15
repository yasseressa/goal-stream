import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { Locale } from "@/i18n";
import type { NewsSummary } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

export function NewsCard({ locale, article, readMoreLabel }: { locale: Locale; article: NewsSummary; readMoreLabel: string }) {
  return (
    <Card className="flex h-full flex-col gap-4 overflow-hidden">
      {article.image_url ? (
        <div className="overflow-hidden rounded-[1rem] bg-[#17120d]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.image_url} alt={article.title} className="h-48 w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
        </div>
      ) : null}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f4bb41]">{article.source}</p>
        <h3 className="text-xl font-black text-[#f7f0e2]">{article.title}</h3>
        <p className="text-sm leading-6 text-[#d1bf99]">{article.summary}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 text-sm text-[#c4b18a]">
        <span>{formatDate(article.published_at, locale)}</span>
        <Link href={`/${locale}/news/${article.slug}`} className="font-semibold text-[#f4bb41] hover:text-[#ffd06f]">
          {readMoreLabel}
        </Link>
      </div>
    </Card>
  );
}
