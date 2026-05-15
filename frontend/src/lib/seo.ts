import type { Metadata } from "next";

import { defaultLocale, locales, type Locale } from "@/i18n";
import type { MatchDetails, NewsArticle } from "@/lib/api/types";

export const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://goalstream.stream").replace(/\/$/, "");

const localeNames: Record<Locale, string> = {
  ar: "Arabic",
  en: "English",
  fr: "French",
  es: "Spanish",
};

const localeSeo: Record<Locale, { title: string; description: string; matchesTitle: string; matchesDescription: string; contactTitle: string; contactDescription: string }> = {
  ar: {
    title: "Goal Stream - بث مباشر للمباريات وأخبار كرة القدم",
    description: "تابع مباريات كرة القدم اليوم، روابط البث المباشر، المواعيد، النتائج، وأحدث الأخبار الرياضية على Goal Stream.",
    matchesTitle: "جدول مباريات اليوم - Goal Stream",
    matchesDescription: "جدول مباريات كرة القدم اليوم والغد مع المواعيد، البطولات، النتائج، وروابط مشاهدة المباريات المتاحة.",
    contactTitle: "تواصل معنا - Goal Stream",
    contactDescription: "تابع Goal Stream عبر الشبكات الاجتماعية واحصل على آخر تحديثات المباريات والأخبار الرياضية.",
  },
  en: {
    title: "Goal Stream - Live football matches and sports news",
    description: "Follow today's football fixtures, live stream links, schedules, scores, and the latest sports news on Goal Stream.",
    matchesTitle: "Today's football fixtures - Goal Stream",
    matchesDescription: "Explore today's and tomorrow's football fixtures with kick-off times, competitions, scores, and available stream links.",
    contactTitle: "Contact us - Goal Stream",
    contactDescription: "Follow Goal Stream on social channels and stay updated with football fixtures and sports news.",
  },
  fr: {
    title: "Goal Stream - Matchs de football en direct et actualités",
    description: "Suivez les matchs de football du jour, les liens de streaming, les horaires, les scores et les dernières actualités sportives.",
    matchesTitle: "Matchs de football du jour - Goal Stream",
    matchesDescription: "Consultez les matchs de football d'aujourd'hui et de demain avec horaires, compétitions, scores et liens disponibles.",
    contactTitle: "Contact - Goal Stream",
    contactDescription: "Suivez Goal Stream sur les réseaux sociaux pour les derniers matchs et actualités sportives.",
  },
  es: {
    title: "Goal Stream - Partidos de fútbol en vivo y noticias",
    description: "Sigue los partidos de fútbol de hoy, enlaces de transmisión, horarios, marcadores y las últimas noticias deportivas.",
    matchesTitle: "Partidos de fútbol de hoy - Goal Stream",
    matchesDescription: "Consulta los partidos de fútbol de hoy y mañana con horarios, competiciones, marcadores y enlaces disponibles.",
    contactTitle: "Contacto - Goal Stream",
    contactDescription: "Sigue Goal Stream en redes sociales y mantente al día con partidos y noticias deportivas.",
  },
};

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export function localizedPath(locale: Locale, path = "") {
  const cleanPath = path.replace(/^\/+/, "");
  return cleanPath ? `/${locale}/${cleanPath}` : `/${locale}`;
}

export function localizedAlternates(path = "") {
  return Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(localizedPath(locale, path))]));
}

export function basePageMetadata(locale: Locale, path = ""): Metadata {
  const seo = localeSeo[locale] ?? localeSeo[defaultLocale];

  return createMetadata({
    locale,
    title: seo.title,
    description: seo.description,
    path,
  });
}

export function matchesPageMetadata(locale: Locale): Metadata {
  const seo = localeSeo[locale] ?? localeSeo[defaultLocale];

  return createMetadata({
    locale,
    title: seo.matchesTitle,
    description: seo.matchesDescription,
    path: "matches",
  });
}

export function contactPageMetadata(locale: Locale): Metadata {
  const seo = localeSeo[locale] ?? localeSeo[defaultLocale];

  return createMetadata({
    locale,
    title: seo.contactTitle,
    description: seo.contactDescription,
    path: "contact",
  });
}

export function matchMetadata(match: MatchDetails, locale: Locale): Metadata {
  const title = `${match.home_team} vs ${match.away_team} - ${match.competition_name} | Goal Stream`;
  const description =
    match.description ||
    `${match.home_team} vs ${match.away_team}: kick-off time, match center, live stream availability, scores, and related football news.`;

  return createMetadata({
    locale,
    title,
    description,
    path: `match/${encodeURIComponent(match.external_match_id)}`,
    image: match.competition_emblem || match.home_team_crest || match.away_team_crest || undefined,
    type: "article",
  });
}

export function newsMetadata(article: NewsArticle, locale: Locale): Metadata {
  return createMetadata({
    locale,
    title: `${article.title} | Goal Stream`,
    description: article.summary,
    path: `news/${article.slug}`,
    image: article.image_url || undefined,
    type: "article",
    publishedTime: article.published_at,
  });
}

export function createMetadata({
  locale,
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const url = absoluteUrl(localizedPath(locale, path));
  const images = image ? [{ url: image, alt: title }] : undefined;

  return {
    title,
    description,
    keywords: [
      "football live stream",
      "live football",
      "football fixtures",
      "today matches",
      "sports news",
      "Goal Stream",
    ],
    alternates: {
      canonical: url,
      languages: {
        ...localizedAlternates(path),
        "x-default": absoluteUrl(localizedPath(defaultLocale, path)),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Goal Stream",
      locale: localeNames[locale],
      type,
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function websiteJsonLd(locale: Locale) {
  const seo = localeSeo[locale] ?? localeSeo[defaultLocale];

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Goal Stream",
    url: absoluteUrl(localizedPath(locale)),
    inLanguage: locale,
    description: seo.description,
  };
}

export function matchJsonLd(match: MatchDetails, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${match.home_team} vs ${match.away_team}`,
    startDate: match.start_time,
    eventStatus: match.status.toLowerCase() === "finished" ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
    sport: "Football",
    inLanguage: locale,
    url: absoluteUrl(localizedPath(locale, `match/${encodeURIComponent(match.external_match_id)}`)),
    location: match.venue
      ? {
          "@type": "Place",
          name: match.venue,
        }
      : undefined,
    competitor: [
      { "@type": "SportsTeam", name: match.home_team, image: match.home_team_crest || undefined },
      { "@type": "SportsTeam", name: match.away_team, image: match.away_team_crest || undefined },
    ],
    organizer: {
      "@type": "Organization",
      name: match.competition_name,
      logo: match.competition_emblem || undefined,
    },
  };
}

export function newsJsonLd(article: NewsArticle, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: article.image_url ? [article.image_url] : undefined,
    datePublished: article.published_at,
    dateModified: article.published_at,
    inLanguage: locale,
    url: absoluteUrl(localizedPath(locale, `news/${article.slug}`)),
    author: {
      "@type": "Organization",
      name: article.source || "Goal Stream",
    },
    publisher: {
      "@type": "Organization",
      name: "Goal Stream",
      url: siteUrl,
    },
  };
}

export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
