import { BrandLogo } from "@/components/layout/BrandLogo";
import type { Locale, Messages } from "@/i18n";

export function Footer({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <footer className="mt-auto border-t border-[rgba(255,194,0,0.14)] bg-[#060606] text-[#f5efe3]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-3 py-8 sm:px-5 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <BrandLogo locale={locale} compact />
          <p className="max-w-md text-sm leading-7 text-[#9d978d]">A broadcast-inspired football experience built for fast match access, strong contrast, and live-match energy.</p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm font-bold uppercase tracking-[0.1em] text-[#cfc7b8]">
          <a href={`/${locale}`} className="transition hover:text-[#f1bc26]" data-disable-global-redirect>{messages.home}</a>
          <a href={`/${locale}#matches`} className="transition hover:text-[#f1bc26]" data-disable-global-redirect>{messages.matches}</a>
          <a href={`/${locale}#news`} className="transition hover:text-[#f1bc26]" data-disable-global-redirect>{messages.sportsNews}</a>
          <a href={`/${locale}/contact`} className="transition hover:text-[#f1bc26]" data-disable-global-redirect>{messages.contactUs}</a>
        </div>
      </div>
    </footer>
  );
}
