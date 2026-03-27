"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Messages } from "@/i18n";
import type { StreamLink } from "@/lib/api/types";

export interface StreamFormValues {
  external_match_id: string;
  stream_url: string;
  stream_type: StreamLink["stream_type"];
  show_stream: boolean;
}

export function StreamForm({
  messages,
  initialValues,
  onSubmit,
  mode,
}: {
  messages: Messages;
  initialValues?: StreamFormValues;
  onSubmit: (values: StreamFormValues) => Promise<void>;
  mode: "create" | "edit";
}) {
  const [values, setValues] = useState<StreamFormValues>(
    initialValues ?? {
      external_match_id: "",
      stream_url: "",
      stream_type: "iframe",
      show_stream: true,
    },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card className="space-y-5">
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError(null);
          try {
            await onSubmit(values);
          } catch (err) {
            setError(err instanceof Error ? err.message : messages.loadFailed);
          } finally {
            setLoading(false);
          }
        }}
      >
        <Input
          value={values.external_match_id}
          onChange={(event) => setValues((current) => ({ ...current, external_match_id: event.target.value }))}
          placeholder={messages.externalMatchId}
          disabled={mode === "edit"}
          required
          data-disable-global-redirect
        />
        <Input
          value={values.stream_url}
          onChange={(event) => setValues((current) => ({ ...current, stream_url: event.target.value }))}
          placeholder={messages.streamUrl}
          required
          data-disable-global-redirect
        />
        <Select
          value={values.stream_type}
          onChange={(event) => setValues((current) => ({ ...current, stream_type: event.target.value as StreamLink["stream_type"] }))}
          data-disable-global-redirect
        >
          <option value="iframe">IFRAME</option>
          <option value="external">EXTERNAL</option>
          <option value="embed">EMBED</option>
          <option value="hls">HLS</option>
        </Select>
        <label className="flex items-center gap-3 text-sm font-semibold text-pitch-900">
          <input
            type="checkbox"
            checked={values.show_stream}
            onChange={(event) => setValues((current) => ({ ...current, show_stream: event.target.checked }))}
            data-disable-global-redirect
          />
          {messages.showStream}
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" disabled={loading}>{loading ? messages.loading : mode === "create" ? messages.save : messages.update}</Button>
      </form>
    </Card>
  );
}
