import Link from "next/link";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Locale, Messages } from "@/i18n";

export function Header({ locale, messages }: { locale: Locale; messages: Messages }) {
  const navLinks = [
    { href: `/${locale}`, label: messages.home },
    { href: `/${locale}#matches`, label: messages.matches },
    { href: `/${locale}#news`, label: messages.sportsNews },
  ];

  return (
    <header className="border-b border-[#242424] bg-[#0b0b0b]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <BrandLogo locale={locale} />
          <nav className="flex flex-wrap items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex rounded-full border border-[#3a300d] bg-[linear-gradient(180deg,#ffd146_0%,#f0b400_100%)] px-5 py-2 text-sm font-bold text-[#161616] shadow-[inset_0_1px_0_rgba(255,255,255,0.38)] transition hover:translate-y-[-1px]"
                data-disable-global-redirect
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="self-start xl:self-center">
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
