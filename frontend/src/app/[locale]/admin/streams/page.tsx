import { notFound } from "next/navigation";

import { StreamsPage } from "@/features/admin/StreamsPage";
import { getMessages, isLocale } from "@/i18n";

export default async function AdminStreamsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  return <StreamsPage locale={locale} messages={messages} />;
}
