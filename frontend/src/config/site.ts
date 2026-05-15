import type { Locale } from "@/i18n";

export const siteConfig = {
  name: "Goal Stream",
  description: "Live football fixtures, match streams, schedules, scores, and sports news.",
  adminStorageKey: "goal-stream-admin-token",
  adminExpiresStorageKey: "goal-stream-admin-expires-at",
  redirectStorageKey: "goal-stream-last-redirect",
  defaultSocialLinks: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Telegram", href: "https://telegram.org" },
    { label: "WhatsApp", href: "https://whatsapp.com" },
  ],
};

export function getLocaleLabel(locale: Locale) {
  if (locale === "ar") return "العربية";
  if (locale === "fr") return "Français";
  if (locale === "es") return "Español";
  return "English";
}
