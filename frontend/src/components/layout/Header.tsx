import Link from "next/link";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Locale, Messages } from "@/i18n";

export function Header({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-[rgba(247,245,236,0.86)] backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent-500">{messages.siteName}</p>
          <Link href={`/${locale}`} className="text-2xl font-black text-pitch-900" data-disable-global-redirect>
            {messages.matchCenter}
          </Link>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href={`/${locale}`} className="text-sm font-semibold text-pitch-900 hover:text-pitch-600" data-disable-global-redirect>
            {messages.home}
          </Link>
          <Link href={`/${locale}#news`} className="text-sm font-semibold text-pitch-900 hover:text-pitch-600" data-disable-global-redirect>
            {messages.sportsNews}
          </Link>
          <Link href={`/${locale}/admin/login`} className="text-sm font-semibold text-pitch-900 hover:text-pitch-600" data-disable-global-redirect>
            {messages.admin}
          </Link>
        </nav>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
