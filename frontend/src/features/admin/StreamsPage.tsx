"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Locale, Messages } from "@/i18n";
import { getAdminToken } from "@/lib/auth";
import { getStreams } from "@/lib/api";
import type { StreamLink } from "@/lib/api/types";

export function StreamsPage({ locale, messages }: { locale: Locale; messages: Messages }) {
  const [items, setItems] = useState<StreamLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }

    getStreams(token)
      .then((response) => setItems(response.items))
      .catch((err) => setError(err instanceof Error ? err.message : messages.loadFailed))
      .finally(() => setLoading(false));
  }, [messages.loadFailed]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500">{messages.admin}</p>
          <h1 className="text-4xl font-black text-pitch-900">{messages.streamLinks}</h1>
        </div>
        <Link href={`/${locale}/admin/streams/new`}><Button>{messages.createStream}</Button></Link>
      </div>
      <Card className="overflow-hidden p-0">
        {loading ? <div className="p-6">{messages.loading}</div> : null}
        {error ? <div className="p-6 text-red-700">{error}</div> : null}
        {!loading && !error ? (
          <div className="divide-y divide-pitch-100">
            {items.map((item) => (
              <div key={item.external_match_id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-pitch-900">{item.external_match_id}</p>
                  <p className="text-sm text-pitch-700">{item.stream_type.toUpperCase()} - {item.show_stream ? "Visible" : "Hidden"}</p>
                </div>
                <Link href={`/${locale}/admin/streams/${encodeURIComponent(item.external_match_id)}/edit`}>
                  <Button variant="ghost">{messages.edit}</Button>
                </Link>
              </div>
            ))}
            {items.length === 0 ? <div className="p-6 text-pitch-700">{messages.empty}</div> : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
