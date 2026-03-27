import { notFound } from "next/navigation";

import { StreamEditor } from "@/features/admin/StreamEditor";
import { getMessages, isLocale } from "@/i18n";

export default async function NewStreamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  return <StreamEditor locale={locale} messages={messages} />;
}
