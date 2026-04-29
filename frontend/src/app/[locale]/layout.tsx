import { notFound } from "next/navigation";

import { LocalePageShell } from "@/components/layout/LocalePageShell";
import { GlobalClickRedirectProvider } from "@/features/redirects/GlobalClickRedirectProvider";
import { getMessages, isLocale, locales } from "@/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
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

  return (
    <GlobalClickRedirectProvider>
      <LocalePageShell locale={locale} messages={messages}>{children}</LocalePageShell>
    </GlobalClickRedirectProvider>
  );
}
