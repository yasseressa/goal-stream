"use client";

import type { Locale } from "@/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <div className="inline-flex rounded-full border border-[#4d3a1a] bg-[#17120d] p-1 shadow-card backdrop-blur">
      {(["en", "ar"] as const).map((item) => {
        const active = item === locale;
        return (
          <a
            key={item}
            href={`/${item}`}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
              active ? "bg-[#f4bb41] text-[#17120d]" : "text-[#efe5d3] hover:bg-[#2a2117]"
            }`}
            data-disable-global-redirect
          >
            {item.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
