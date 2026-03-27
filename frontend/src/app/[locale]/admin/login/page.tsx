import { notFound } from "next/navigation";

import { AdminLoginForm } from "@/features/admin/AdminLoginForm";
import { getMessages, isLocale } from "@/i18n";

export default async function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  return <AdminLoginForm locale={locale} messages={messages} />;
}
