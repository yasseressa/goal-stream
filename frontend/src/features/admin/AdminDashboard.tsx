import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { Locale, Messages } from "@/i18n";

export function AdminDashboard({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500">{messages.admin}</p>
        <h1 className="text-4xl font-black text-pitch-900">{messages.adminOverview}</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-2xl font-black text-pitch-900">{messages.streamLinks}</h2>
          <p className="text-sm text-pitch-700">{messages.manageStreams}</p>
          <Link href={`/${locale}/admin/streams`} className="inline-flex rounded-full bg-pitch-600 px-4 py-2 text-sm font-semibold text-white">
            {messages.streamLinks}
          </Link>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-black text-pitch-900">{messages.redirects}</h2>
          <p className="text-sm text-pitch-700">{messages.manageRedirects}</p>
          <Link href={`/${locale}/admin/redirects`} className="inline-flex rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-pitch-900">
            {messages.redirects}
          </Link>
        </Card>
      </div>
    </div>
  );
}
