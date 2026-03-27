import Link from "next/link";

import { siteConfig } from "@/config/site";
import type { Locale, Messages } from "@/i18n";

export function TopSocialBar({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <div className="border-b border-white/30 bg-pitch-900 text-pitch-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm sm:px-6 lg:px-8">
        <span className="font-semibold uppercase tracking-[0.2em] text-accent-400">{messages.socialFollow}</span>
        <div className="flex flex-wrap items-center gap-3">
          {siteConfig.socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition hover:border-accent-400 hover:text-accent-400"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
