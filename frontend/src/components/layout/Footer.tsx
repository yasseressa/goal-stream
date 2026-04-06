import Link from "next/link";

import { BrandLogo } from "@/components/layout/BrandLogo";
import type { Locale, Messages } from "@/i18n";

export function Footer({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <footer className="mt-auto border-t border-[#1c1c1c] bg-[#060606] text-[#f5efe3]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <BrandLogo locale={locale} compact />
          <p className="text-sm text-[#8d8d8d]">{messages.sportsNews}</p>
        </div>
        <div className="flex items-center gap-5 text-sm text-[#cfcfcf]">
          <Link href={`/${locale}`} className="transition hover:text-[#f4bb41]" data-disable-global-redirect>{messages.home}</Link>
          <Link href={`/${locale}#matches`} className="transition hover:text-[#f4bb41]" data-disable-global-redirect>{messages.matches}</Link>
          <Link href={`/${locale}#news`} className="transition hover:text-[#f4bb41]" data-disable-global-redirect>{messages.sportsNews}</Link>
        </div>
      </div>
    </footer>
  );
}
