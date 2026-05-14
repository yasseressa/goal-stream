"use client";

import { useState } from "react";

import { AdminToast } from "@/components/admin/AdminToast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Messages } from "@/i18n";
import { refreshFixturesCache } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

export function FixtureCacheRefreshCard({ messages }: { messages: Messages }) {
  const text = messages as Record<string, string>;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error">("success");

  async function handleRefresh() {
    const token = getAdminToken();
    if (!token) return;

    setBusy(true);
    try {
      const result = await refreshFixturesCache(token);
      setToastTone("success");
      setToastMessage(
        (text.fixturesCacheRefreshSuccess ?? "Matches cache refreshed successfully. Raw matches: {count}.").replace(
          "{count}",
          String(result.raw_match_count),
        ),
      );
      setConfirmOpen(false);
    } catch (error) {
      setToastTone("error");
      setToastMessage(error instanceof Error ? error.message : text.loadFailed ?? "Unable to refresh matches cache.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AdminToast message={toastMessage} tone={toastTone} onClose={() => setToastMessage(null)} />
      <ConfirmDialog
        open={confirmOpen}
        title={text.fixturesCacheConfirmTitle ?? "Refresh matches cache?"}
        description={
          text.fixturesCacheConfirmMessage ??
          "This will request fresh fixtures from the API and replace the local JSON cache for visible match days."
        }
        confirmLabel={text.refreshFixturesCacheAction ?? "Refresh now"}
        cancelLabel={text.cancelAction ?? "Cancel"}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleRefresh}
        busy={busy}
      />
      <Card className="space-y-3 border-[#f1c7bc] bg-[#fff8f5]">
        <h2 className="text-xl font-semibold text-[#222]">{text.fixturesCacheTitle ?? "Matches API Cache"}</h2>
        <p className="text-sm leading-6 text-[#626883]">
          {text.fixturesCacheDescription ??
            "Manually refresh yesterday, today, and tomorrow fixtures. Use this only when you need fresh API data before the scheduled 00:00 or 12:00 refresh."}
        </p>
        <Button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={busy}
          className="bg-[#931800] text-white hover:bg-[#b42318]"
        >
          {busy ? messages.loading : text.refreshFixturesCacheAction ?? "Refresh now"}
        </Button>
      </Card>
    </>
  );
}
