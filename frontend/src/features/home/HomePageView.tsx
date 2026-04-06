"use client";

import { useState } from "react";
import Link from "next/link";

import type { Locale, Messages } from "@/i18n";
import type { HomeResponse, MatchSummary, NewsSummary } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

export function HomePageView({ locale, messages, data }: { locale: Locale; messages: Messages; data: HomeResponse }) {
  const buckets = [
    { id: "today", title: messages.todayMatches, subtitle: messages.latestHeadlines, matches: data.today_matches },
    { id: "yesterday", title: messages.yesterdayMatches, subtitle: messages.yesterdayMatches, matches: data.yesterday_matches },
    { id: "tomorrow", title: messages.tomorrowMatches, subtitle: messages.tomorrowMatches, matches: data.tomorrow_matches },
  ] as const;
  const [activeBucketId, setActiveBucketId] = useState<(typeof buckets)[number]["id"]>("today");
  const activeBucket = buckets.find((bucket) => bucket.id === activeBucketId) ?? buckets[0];

  return (
    <div className="space-y-7">
      <section id="matches" className="overflow-hidden rounded-[1.65rem] border border-[#232323] bg-[#0c0c0c] shadow-[0_20px_45px_rgba(0,0,0,0.28)]">
        <div className="border-b border-[#1f1f1f] px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black text-white sm:text-4xl">{activeBucket.title}</h1>
              <p className="mt-2 text-sm text-[#9c9c9c]">{activeBucket.subtitle}</p>
            </div>
            <ul className="flex flex-wrap gap-3" role="tablist" aria-label={messages.matchDayTabs}>
              {buckets.map((bucket) => (
                <li key={bucket.id}>
                  <button
                    type="button"
                    id={`matches-tab-${bucket.id}`}
                    role="tab"
                    aria-selected={activeBucket.id === bucket.id}
                    aria-controls={`matches-panel-${bucket.id}`}
                    className={`inline-flex rounded-full px-5 py-2 text-sm font-bold transition ${
                      activeBucket.id === bucket.id
                        ? "border border-[#3a300d] bg-[linear-gradient(180deg,#ffd146_0%,#f0b400_100%)] text-[#141414]"
                        : "border border-[#2a2a2a] bg-[#121212] text-[#d6d6d6] hover:border-[#3a3a3a]"
                    }`}
                    onClick={() => setActiveBucketId(bucket.id)}
                  >
                    {bucket.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          <div
            id={`matches-panel-${activeBucket.id}`}
            role="tabpanel"
            aria-labelledby={`matches-tab-${activeBucket.id}`}
            aria-live="polite"
            className="rounded-[1.4rem] border border-[#202020] bg-[#090909] p-4 sm:p-5"
          >
            {activeBucket.matches.length === 0 ? (
              <DarkEmptyState message={messages.empty} />
            ) : (
              <div className="space-y-4">
                {activeBucket.matches.map((match) => (
                  <MatchBoardRow key={match.external_match_id} locale={locale} match={match} messages={messages} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="news" className="overflow-hidden rounded-[1.65rem] border border-[#232323] bg-[#0c0c0c] shadow-[0_20px_45px_rgba(0,0,0,0.28)]">
        <div className="border-b border-[#1f1f1f] px-5 py-5 sm:px-8">
          <h2 className="text-3xl font-black text-white sm:text-4xl">{messages.sportsNews}</h2>
          <p className="mt-2 text-sm text-[#9c9c9c]">{messages.latestUpdates}</p>
        </div>
        <div className="px-4 py-5 sm:px-6 sm:py-6">
          {data.latest_news.length === 0 ? (
            <DarkEmptyState message={messages.empty} />
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {data.latest_news.map((article) => (
                <NewsPanel key={article.slug} locale={locale} article={article} readMoreLabel={messages.readMore} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MatchBoardRow({ locale, match, messages }: { locale: Locale; match: MatchSummary; messages: Messages }) {
  return (
    <div className="rounded-[1.35rem] border border-[#202020] bg-[#101010] p-4 sm:p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="flex items-center gap-3">
          <TeamLogo src={match.home_team_crest} alt={match.home_team} />
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#8e8e8e]">{match.competition_name}</p>
            <p className="mt-2 text-xl font-black text-white">{match.home_team}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-[#ffd146]">{timeOrScore(match, locale, messages)}</p>
          <span className={`mt-3 inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${statusTone(match.status)}`}>
            {statusLabel(match.status, messages)}
          </span>
        </div>
        <div className="flex items-center justify-start gap-3 md:justify-end">
          <div className="text-start md:text-end">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#8e8e8e]">{messages.awayTeam}</p>
            <p className="mt-2 text-xl font-black text-white">{match.away_team}</p>
          </div>
          <TeamLogo src={match.away_team_crest} alt={match.away_team} />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 border-t border-[#1d1d1d] pt-4 text-sm text-[#9f9f9f] md:flex-row md:items-center md:justify-between">
        <p>{formatDate(match.start_time, locale)}</p>
        <Link
          href={`/${locale}/matches/${encodeURIComponent(match.external_match_id)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-[#3a300d] bg-[linear-gradient(180deg,#ffd146_0%,#f0b400_100%)] px-4 py-2 font-bold text-[#141414] transition hover:translate-y-[-1px]"
          data-disable-global-redirect
        >
          {messages.watch}
        </Link>
      </div>
    </div>
  );
}

function NewsPanel({ locale, article, readMoreLabel }: { locale: Locale; article: NewsSummary; readMoreLabel: string }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#202020] bg-[#101010] p-4">
      {article.image_url ? (
        <div className="overflow-hidden rounded-[1rem] bg-[#171717]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.image_url} alt={article.title} className="h-52 w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
        </div>
      ) : null}
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8e8e8e]">{article.source}</p>
        <h3 className="mt-3 text-xl font-black text-white">{article.title}</h3>
        <p className="mt-3 text-sm leading-6 text-[#b1b1b1]">{article.summary}</p>
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#1d1d1d] pt-4 text-sm text-[#9f9f9f]">
          <p>{formatDate(article.published_at, locale)}</p>
          <Link
            href={`/${locale}/news/${article.slug}`}
            className="inline-flex rounded-full border border-[#2a2a2a] px-4 py-2 font-bold text-white transition hover:border-[#f0b400] hover:text-[#ffd146]"
            data-disable-global-redirect
          >
            {readMoreLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}

function TeamLogo({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return <div className="h-12 w-12 rounded-full border border-[#252525] bg-[#0b0b0b]" aria-hidden="true" />;
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#252525] bg-[#0b0b0b] p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-contain" loading="lazy" referrerPolicy="no-referrer" />
    </div>
  );
}

function DarkEmptyState({ message }: { message: string }) {
  return <div className="rounded-[1.25rem] border border-[#232323] bg-[#0a0a0a] px-4 py-6 text-sm text-[#a6a6a6]">{message}</div>;
}

function timeOrScore(match: MatchSummary, locale: Locale, messages: Messages) {
  if (match.status.toLowerCase() === "live") return messages.liveNowLabel;
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date(match.start_time));
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

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "live") return "bg-[#30210a] text-[#ffd146]";
  if (normalized === "finished") return "bg-[#1c1c1c] text-[#e7e7e7]";
  if (normalized === "scheduled") return "bg-[#151515] text-[#d8d8d8]";
  if (normalized === "postponed") return "bg-[#22170a] text-[#ffcf68]";
  return "bg-[#151515] text-[#d8d8d8]";
}


