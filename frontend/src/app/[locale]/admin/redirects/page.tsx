import { notFound } from "next/navigation";

import { RedirectsManager } from "@/features/admin/RedirectsManager";
import { getMessages, isLocale } from "@/i18n";

export default async function RedirectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  return <RedirectsManager locale={locale} messages={messages} />;
}
