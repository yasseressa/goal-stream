import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { Locale, Messages } from "@/i18n";

export function AdminDashboard({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f4bb41]">{messages.admin}</p>
        <h1 className="text-4xl font-black text-[#f7f0e2]">{messages.adminOverview}</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="space-y-3">
          <h2 className="text-2xl font-black text-[#f7f0e2]">{messages.streamLinks}</h2>
          <p className="text-sm text-[#ccb992]">{messages.manageStreams}</p>
          <Link href={`/${locale}/admin/streams`} className="inline-flex rounded-full bg-[#f4bb41] px-4 py-2 text-sm font-semibold text-[#17120d]">
            {messages.streamLinks}
          </Link>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-black text-[#f7f0e2]">{messages.redirects}</h2>
          <p className="text-sm text-[#ccb992]">{messages.manageRedirects}</p>
          <Link href={`/${locale}/admin/redirects`} className="inline-flex rounded-full bg-[#2a2117] px-4 py-2 text-sm font-semibold text-[#f5efe3]">
            {messages.redirects}
          </Link>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-2xl font-black text-[#f7f0e2]">{messages.socialLinks}</h2>
          <p className="text-sm text-[#ccb992]">{messages.manageSocialLinks}</p>
          <Link href={`/${locale}/admin/socials`} className="inline-flex rounded-full bg-[#17120d] px-4 py-2 text-sm font-semibold text-[#f5efe3] border border-[#4b3818]">
            {messages.socialLinks}
          </Link>
        </Card>
      </div>
    </div>
  );
}
