import type { Locale } from "@/i18n";

export const siteConfig = {
  name: "Melbet Live",
  description: "Bilingual sports matches and news platform",
  adminStorageKey: "melbet-admin-token",
  redirectStorageKey: "melbet-last-redirect",
  defaultSocialLinks: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Telegram", href: "https://telegram.org" },
    { label: "WhatsApp", href: "https://whatsapp.com" },
  ],
};

export function getLocaleLabel(locale: Locale) {
  return locale === "ar" ? "???????" : "English";
}
