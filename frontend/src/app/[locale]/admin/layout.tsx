import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { getMessages, isLocale } from "@/i18n";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  return <AdminShell locale={locale} messages={messages}>{children}</AdminShell>;
}
