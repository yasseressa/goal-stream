"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Locale, Messages } from "@/i18n";
import { getAdminToken } from "@/lib/auth";
import { createStream, getStream, updateStream } from "@/lib/api";

import { StreamForm, type StreamFormValues } from "./StreamForm";

export function StreamEditor({ locale, messages, externalId }: { locale: Locale; messages: Messages; externalId?: string }) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<StreamFormValues | undefined>(undefined);
  const [loading, setLoading] = useState(Boolean(externalId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!externalId || !token) {
      setLoading(false);
      return;
    }

    getStream(externalId, token)
      .then((stream) =>
        setInitialValues({
          external_match_id: stream.external_match_id,
          stream_url: stream.stream_url,
          stream_type: stream.stream_type,
          show_stream: stream.show_stream,
        }),
      )
      .catch((err) => setError(err instanceof Error ? err.message : messages.loadFailed))
      .finally(() => setLoading(false));
  }, [externalId, messages.loadFailed]);

  if (loading) {
    return <div className="text-pitch-700">{messages.loading}</div>;
  }

  if (error) {
    return <div className="text-red-700">{error}</div>;
  }

  return (
    <StreamForm
      messages={messages}
      initialValues={initialValues}
      mode={externalId ? "edit" : "create"}
      onSubmit={async (values) => {
        const token = getAdminToken();
        if (!token) {
          throw new Error(messages.loginFailed);
        }

        if (externalId) {
          await updateStream(externalId, {
            stream_url: values.stream_url,
            stream_type: values.stream_type,
            show_stream: values.show_stream,
          }, token);
        } else {
          await createStream(values, token);
        }
        router.push(`/${locale}/admin/streams`);
      }}
    />
  );
}
