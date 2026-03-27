"use client";

import { ErrorState } from "@/components/system/ErrorState";

export default function LocaleError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorState message="Unable to load this page." onRetry={reset} />;
}
