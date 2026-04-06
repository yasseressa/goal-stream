import { notFound } from "next/navigation";

import { SocialLinksManager } from "@/features/admin/SocialLinksManager";
import { getMessages, isLocale } from "@/i18n";

export default async function SocialLinksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  return <SocialLinksManager locale={locale} messages={messages} />;
}
