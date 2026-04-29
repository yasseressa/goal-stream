import { notFound } from "next/navigation";

import { AdminLoginForm } from "@/features/admin/AdminLoginForm";
import { getMessages, isLocale } from "@/i18n";

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ expired?: string }>;
}) {
  const { locale } = await params;
  const { expired } = await searchParams;
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  return <AdminLoginForm locale={locale} messages={messages} sessionExpired={expired === "1"} />;
}
