import { notFound } from "next/navigation";

import { AdminDashboard } from "@/features/admin/AdminDashboard";
import { getMessages, isLocale } from "@/i18n";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  return <AdminDashboard locale={locale} messages={messages} />;
}
