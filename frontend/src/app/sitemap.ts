import type { MetadataRoute } from "next";

import { defaultLocale, locales } from "@/i18n";
import { getHomePageData } from "@/lib/api";
import { absoluteUrl, localizedPath } from "@/lib/seo";

export const revalidate = 1800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = locales.flatMap((locale) => [
    entry(localizedPath(locale), "hourly", 1),
    entry(localizedPath(locale, "matches"), "hourly", 0.9),
    entry(localizedPath(locale, "contact"), "monthly", 0.4),
  ]);

  const dynamicRoutes = await Promise.all(
    locales.map(async (locale) => {
      try {
        const data = await getHomePageData(locale);
        const matches = [...data.today_matches, ...data.tomorrow_matches]
          .filter((match) => match.external_match_id)
          .map((match) => entry(localizedPath(locale, `match/${encodeURIComponent(match.external_match_id)}`), "hourly", 0.85, match.start_time));

        const news = data.latest_news
          .filter((article) => article.slug)
          .map((article) => entry(localizedPath(locale, `news/${article.slug}`), "daily", 0.75, article.published_at));

        return [...matches, ...news];
      } catch {
        return [];
      }
    }),
  );

  return [...staticRoutes, ...dynamicRoutes.flat(), entry(localizedPath(defaultLocale), "hourly", 1)];
}

function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: string,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency,
    priority,
  };
}
