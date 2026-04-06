"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import type { Locale, Messages } from "@/i18n";
import { getSocialLinks } from "@/lib/api";
import type { SocialLink } from "@/lib/api/types";

export function TopSocialBar({ locale: _locale, messages }: { locale: Locale; messages: Messages }) {
  const [links, setLinks] = useState<SocialLink[]>(siteConfig.defaultSocialLinks);

  useEffect(() => {
    getSocialLinks()
      .then((response) => {
        if (response.items.length > 0) {
          setLinks(response.items);
        }
      })
      .catch(() => setLinks(siteConfig.defaultSocialLinks));
  }, []);

  return (
    <div className="border-b border-[#1e1e1e] bg-[#070707] text-[#f5efe3]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8e8e8e]">{messages.socialFollow}</span>
        <div className="flex flex-wrap items-center gap-3">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-[0.95rem] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_20px_rgba(0,0,0,0.22)] transition hover:translate-y-[-1px] ${socialTone(link.label)}`}
              data-disable-global-redirect
              aria-label={link.label}
            >
              <SocialIcon label={link.label} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function socialTone(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("telegram")) return "bg-[#2aabee]";
  if (normalized.includes("whatsapp")) return "bg-[#25d366]";
  if (normalized.includes("email")) return "bg-[#f0b400] text-[#121212]";
  if (normalized.includes("instagram")) return "bg-[#e4405f]";
  if (normalized.includes("facebook")) return "bg-[#1877f2]";
  if (normalized.includes("youtube")) return "bg-[#ff3333]";
  return "bg-[#2d2d2d]";
}

function SocialIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  if (normalized.includes("telegram")) return <IconBadge text="TG" />;
  if (normalized.includes("whatsapp")) return <IconBadge text="WA" />;
  if (normalized.includes("email")) return <IconBadge text="@" />;
  if (normalized.includes("instagram")) return <IconBadge text="IG" />;
  if (normalized.includes("facebook")) return <IconBadge text="FB" />;
  if (normalized.includes("youtube")) return <IconBadge text="YT" />;
  return <IconBadge text="SO" />;
}

function IconBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-[rgba(255,255,255,0.55)] px-1 text-[0.6rem] font-bold leading-none" aria-hidden="true">
      {text}
    </span>
  );
}
