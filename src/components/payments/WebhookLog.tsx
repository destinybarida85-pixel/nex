"use client";

import { useEffect, useState } from "react";
import { IconActivity } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

type WebhookEvent = { id: string; event_type: string; detail: string | null; created_at: string };

function relativeTime(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function WebhookLog() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [events, setEvents] = useState<WebhookEvent[]>([]);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/webhook-events")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || data.error) return;
        setEvents(data.events ?? []);
        setLive(true);
      })
      .catch(() => {
        // Stay on the empty state on any failure.
      });
  }, [checked, hasSession]);

  return (
    <div className="card elev-sm p-[16px_18px] gap-2.5">
      <div className="flex items-center gap-2">
        <IconActivity size={14} className="text-[var(--color-accent)]" />
        <div className="card-title text-sm">Webhook events</div>
        {live && <span className="card-meta ml-auto font-mono text-[10.5px]">/api/stripe/webhook</span>}
      </div>
      <div className="flex flex-col">
        {live && events.length === 0 && (
          <div className="text-[12.5px] text-[var(--color-neutral-500)] py-2">
            Nothing yet — this fills in as real Stripe events (subscriptions, credit purchases, payment-link payments) reach your account.
          </div>
        )}
        {(live ? events : []).map((w) => (
          <div key={w.id} className="flex items-center gap-3 py-2 text-[13px]">
            <span className="font-mono" style={{ color: "var(--color-accent-300)" }}>{w.event_type}</span>
            <span className="text-[var(--color-neutral-500)] truncate flex-1 min-w-0">{w.detail}</span>
            <span className="text-[var(--color-neutral-500)] font-mono text-[10.5px] flex-none">{relativeTime(w.created_at)}</span>
          </div>
        ))}
        {!live && (
          <div className="text-[12.5px] text-[var(--color-neutral-500)] py-2">
            Real Stripe webhook deliveries for your account will show up here.
          </div>
        )}
      </div>
    </div>
  );
}
