import Link from "next/link";

import type { Locale, Messages } from "@/i18n";

export function Footer({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <footer className="mt-auto border-t border-white/40 bg-pitch-900 text-pitch-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold">{messages.siteName}</p>
          <p className="text-sm text-pitch-100/70">{messages.sportsNews}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href={`/${locale}`} className="hover:text-accent-400" data-disable-global-redirect>{messages.home}</Link>
          <Link href={`/${locale}/admin/login`} className="hover:text-accent-400" data-disable-global-redirect>{messages.admin}</Link>
        </div>
      </div>
    </footer>
  );
}
