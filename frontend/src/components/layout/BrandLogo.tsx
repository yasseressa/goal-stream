import Link from "next/link";

import type { Locale } from "@/i18n";

export function BrandLogo({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  return (
    <Link href={`/${locale}`} className={`inline-flex overflow-hidden rounded-[1.4rem] border border-[#2b2b2b] shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${compact ? "text-[1rem]" : "text-[1.45rem] sm:text-[1.7rem]"}`} data-disable-global-redirect>
      <span className="bg-[#231f20] px-4 py-3 font-black uppercase tracking-[0.34em] text-white sm:px-5">MelBet</span>
      <span className="bg-[linear-gradient(180deg,#f9c61a_0%,#f2af00_100%)] px-4 py-3 font-black uppercase tracking-[0.42em] text-white sm:px-5">Live</span>
    </Link>
  );
}
