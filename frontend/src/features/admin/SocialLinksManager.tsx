"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Locale, Messages } from "@/i18n";
import { getAdminToken } from "@/lib/auth";
import { getRedirectSettings, updateRedirectSettings } from "@/lib/api";
import type { RedirectSettings } from "@/lib/api/types";

export function SocialLinksManager({ locale: _locale, messages }: { locale: Locale; messages: Messages }) {
  const [settings, setSettings] = useState<RedirectSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    getRedirectSettings(token)
      .then((response) => setSettings(response))
      .catch((err) => setError(err instanceof Error ? err.message : messages.loadFailed));
  }, [messages.loadFailed]);

  const updateField = (field: keyof RedirectSettings, value: string) => {
    setSettings((current) => (current ? { ...current, [field]: value || null } : current));
  };

  const handleSave = async () => {
    const token = getAdminToken();
    if (!token || !settings) return;
    setError(null);
    setStatusMessage(null);
    try {
      await updateRedirectSettings(settings, token);
      setStatusMessage(messages.saveSuccess);
    } catch (err) {
      setError(err instanceof Error ? err.message : messages.loadFailed);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f4bb41]">{messages.admin}</p>
        <h1 className="text-4xl font-black text-[#f7f0e2]">{messages.socialLinks}</h1>
      </div>
      {error ? <p className="text-sm text-[#f5d7c9]">{error}</p> : null}
      {statusMessage ? <p className="text-sm text-[#ccb992]">{statusMessage}</p> : null}
      <Card className="space-y-4">
        <div>
          <h2 className="text-2xl font-black text-[#f7f0e2]">{messages.socialLinks}</h2>
          <p className="mt-2 text-sm text-[#ccb992]">{messages.manageSocialLinks}</p>
        </div>
        {settings ? (
          <div className="space-y-3">
            <Input value={settings.facebook_url ?? ""} onChange={(e) => updateField("facebook_url", e.target.value)} placeholder={messages.facebookUrl} data-disable-global-redirect />
            <Input value={settings.youtube_url ?? ""} onChange={(e) => updateField("youtube_url", e.target.value)} placeholder={messages.youtubeUrl} data-disable-global-redirect />
            <Input value={settings.instagram_url ?? ""} onChange={(e) => updateField("instagram_url", e.target.value)} placeholder={messages.instagramUrl} data-disable-global-redirect />
            <Input value={settings.telegram_url ?? ""} onChange={(e) => updateField("telegram_url", e.target.value)} placeholder={messages.telegramUrl} data-disable-global-redirect />
            <Input value={settings.whatsapp_url ?? ""} onChange={(e) => updateField("whatsapp_url", e.target.value)} placeholder={messages.whatsappUrl} data-disable-global-redirect />
            <Button onClick={handleSave}>{messages.save}</Button>
          </div>
        ) : (
          <p className="text-[#ccb992]">{messages.loading}</p>
        )}
      </Card>
    </div>
  );
}
