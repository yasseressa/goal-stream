"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Locale, Messages } from "@/i18n";
import { getAdminToken } from "@/lib/auth";
import { createRedirect, getRedirectSettings, getRedirects, updateRedirect, updateRedirectSettings } from "@/lib/api";
import type { RedirectCampaign, RedirectCampaignPayload, RedirectSettings } from "@/lib/api/types";

const emptyCampaign: RedirectCampaignPayload = {
  name: "",
  target_url: "",
  is_active: true,
  cooldown_seconds: 30,
  start_at: null,
  end_at: null,
};

export function RedirectsManager({ locale: _locale, messages }: { locale: Locale; messages: Messages }) {
  const [campaigns, setCampaigns] = useState<RedirectCampaign[]>([]);
  const [settings, setSettings] = useState<RedirectSettings | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [campaignForm, setCampaignForm] = useState<RedirectCampaignPayload>(emptyCampaign);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const loadCampaigns = async () => {
    const token = getAdminToken();
    if (!token) return;
    const redirectsResponse = await getRedirects(token);
    setCampaigns(redirectsResponse.items);
  };

  const loadSettings = async () => {
    const token = getAdminToken();
    if (!token) return;
    const settingsResponse = await getRedirectSettings(token);
    setSettings(settingsResponse);
  };

  useEffect(() => {
    setCampaignError(null);
    setSettingsError(null);
    loadCampaigns().catch((err) => setCampaignError(err instanceof Error ? err.message : messages.loadFailed));
    loadSettings().catch((err) => setSettingsError(err instanceof Error ? err.message : messages.loadFailed));
  }, [messages.loadFailed]);

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? null,
    [campaigns, selectedCampaignId],
  );

  useEffect(() => {
    if (selectedCampaign) {
      setCampaignForm({
        name: selectedCampaign.name,
        target_url: selectedCampaign.target_url,
        is_active: selectedCampaign.is_active,
        cooldown_seconds: selectedCampaign.cooldown_seconds,
        start_at: selectedCampaign.start_at ?? null,
        end_at: selectedCampaign.end_at ?? null,
      });
    }
  }, [selectedCampaign]);

  const handleSaveCampaign = async () => {
    const token = getAdminToken();
    if (!token) return;
    setCampaignError(null);
    setStatusMessage(null);
    try {
      if (selectedCampaignId) {
        await updateRedirect(selectedCampaignId, campaignForm, token);
      } else {
        await createRedirect(campaignForm, token);
      }
      setCampaignForm(emptyCampaign);
      setSelectedCampaignId(null);
      await loadCampaigns();
      setStatusMessage(messages.saveSuccess);
    } catch (err) {
      setCampaignError(err instanceof Error ? err.message : messages.loadFailed);
    }
  };

  const handleSaveSettings = async () => {
    const token = getAdminToken();
    if (!token || !settings) return;
    setSettingsError(null);
    setStatusMessage(null);
    try {
      await updateRedirectSettings(settings, token);
      await loadSettings();
      setStatusMessage(messages.saveSuccess);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : messages.loadFailed);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f4bb41]">{messages.admin}</p>
        <h1 className="text-4xl font-black text-[#f7f0e2]">{messages.redirects}</h1>
      </div>
      {campaignError ? <p className="text-sm text-[#f5d7c9]">{campaignError}</p> : null}
      {statusMessage ? <p className="text-sm text-[#ccb992]">{statusMessage}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#f7f0e2]">{messages.campaigns}</h2>
            <Button variant="ghost" onClick={() => { setSelectedCampaignId(null); setCampaignForm(emptyCampaign); }}>
              {messages.createNew}
            </Button>
          </div>
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-[#4b3818] bg-[#17120d] px-4 py-3 text-left"
                onClick={() => setSelectedCampaignId(campaign.id)}
              >
                <span>
                  <strong className="block text-[#f7f0e2]">{campaign.name}</strong>
                  <span className="text-sm text-[#ccb992]">{campaign.target_url}</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4bb41]">{campaign.cooldown_seconds}s</span>
              </button>
            ))}
          </div>
          <div className="space-y-3 border-t border-[#3a2b14] pt-4">
            <Input value={campaignForm.name} onChange={(e) => setCampaignForm((c) => ({ ...c, name: e.target.value }))} placeholder={messages.createCampaign} />
            <Input value={campaignForm.target_url} onChange={(e) => setCampaignForm((c) => ({ ...c, target_url: e.target.value }))} placeholder={messages.targetUrl} />
            <Input value={String(campaignForm.cooldown_seconds)} onChange={(e) => setCampaignForm((c) => ({ ...c, cooldown_seconds: Number(e.target.value) || 0 }))} placeholder={messages.intervalSeconds} />
            <label className="flex items-center gap-3 text-sm font-semibold text-[#f5efe3]">
              <input type="checkbox" checked={campaignForm.is_active} onChange={(e) => setCampaignForm((c) => ({ ...c, is_active: e.target.checked }))} />
              {messages.enabled}
            </label>
            <Button onClick={handleSaveCampaign}>{selectedCampaignId ? messages.update : messages.save}</Button>
          </div>
        </Card>
        <Card className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#f7f0e2]">{messages.settings}</h2>
            {settingsError ? <p className="text-sm text-[#f5d7c9]">{settingsError}</p> : null}
          </div>
          {settings ? (
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-sm font-semibold text-[#f5efe3]">
                <input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings((current) => current ? { ...current, enabled: e.target.checked } : current)} />
                {messages.enabled}
              </label>
              <Input value={String(settings.default_cooldown_seconds)} onChange={(e) => setSettings((current) => current ? { ...current, default_cooldown_seconds: Number(e.target.value) || 0 } : current)} placeholder={messages.intervalSeconds} />
              <Input value={settings.fallback_url ?? ""} onChange={(e) => setSettings((current) => current ? { ...current, fallback_url: e.target.value } : current)} placeholder={messages.targetUrl} />
              <Select value={settings.active_campaign_id ?? ""} onChange={(e) => setSettings((current) => current ? { ...current, active_campaign_id: e.target.value || null } : current)}>
                <option value="">{messages.noActiveCampaign}</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                ))}
              </Select>
              <label className="flex items-center gap-3 text-sm font-semibold text-[#f5efe3]">
                <input type="checkbox" checked={settings.open_in_new_tab} onChange={(e) => setSettings((current) => current ? { ...current, open_in_new_tab: e.target.checked } : current)} />
                {messages.openInNewTab}
              </label>
              <Button onClick={handleSaveSettings}>{messages.save}</Button>
            </div>
          ) : (
            <p className="text-[#ccb992]">{messages.loading}</p>
          )}
        </Card>
      </div>
    </div>
  );
}

