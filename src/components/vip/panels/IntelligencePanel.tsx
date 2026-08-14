"use client";

import { useEffect, useState } from "react";
import { IconSparkle } from "@/components/icons";
import { useVipTheme } from "@/components/vip/theme";

type Recommendation = { headline: string; detail: string };
type Facts = {
  pendingSignatures: { count: number; oldestDays: number | null; oldestTitle: string | null };
  cashFlow30d: { netCents: number; previousPeriodNetCents: number };
  daysSinceLastWalletActivity: number | null;
  unreviewedAiDrafts: { count: number; oldestDays: number | null };
  certificateCreditsRemaining: number | null;
  stampCreditsRemaining: number | null;
};
type Stat = { label: string; value: string; sub?: string; badge?: { positive: boolean; text: string } };

function money(cents: number) {
  const abs = Math.abs(cents) / 100;
  return `${cents < 0 ? "−" : ""}$${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}

const CERT_MAX = 10;
const STAMP_MAX = 10;

export default function IntelligencePanel() {
  const { tokens } = useVipTheme();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [facts, setFacts] = useState<Facts | null>(null);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    setError("");
    fetch("/api/vip/intelligence")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || (data.error && !data.facts)) {
          setError(data.error || "Couldn't load intelligence.");
          return;
        }
        setFacts(data.facts ?? null);
        setRecs(data.recommendations ?? []);
        if (data.error) setError(data.error);
      })
      .catch(() => setError("Couldn't reach the server."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const cashChange = facts ? pctChange(facts.cashFlow30d.netCents, facts.cashFlow30d.previousPeriodNetCents) : null;

  const stats: Stat[] = facts
    ? [
        {
          label: "Pending signatures",
          value: String(facts.pendingSignatures.count),
          sub:
            facts.pendingSignatures.oldestDays !== null
              ? `Oldest ${facts.pendingSignatures.oldestDays}d — "${facts.pendingSignatures.oldestTitle}"`
              : "All caught up",
        },
        {
          label: "Cash flow · 30d",
          value: money(facts.cashFlow30d.netCents),
          badge:
            cashChange !== null
              ? { positive: cashChange >= 0, text: `${cashChange >= 0 ? "▲" : "▼"} ${Math.abs(cashChange)}% vs prior 30d` }
              : undefined,
        },
        {
          label: "Wallet activity",
          value: facts.daysSinceLastWalletActivity !== null ? `${facts.daysSinceLastWalletActivity}d ago` : "No activity yet",
        },
        {
          label: "AI drafts to review",
          value: String(facts.unreviewedAiDrafts.count),
          sub: facts.unreviewedAiDrafts.oldestDays !== null ? `Oldest ${facts.unreviewedAiDrafts.oldestDays}d` : "None waiting",
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="m-0 text-[22px]" style={{ color: tokens.text }}>Intelligence</h3>
          <div className="text-[13.5px] mt-1.5" style={{ color: tokens.textSecondary }}>
            Recommendations computed from your own account data — never a market or competitor claim, since
            Primue doesn&rsquo;t have access to that.
          </div>
        </div>
        <button
          className="btn text-[12.5px] flex-none"
          style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary }}
          onClick={load}
          disabled={loading}
        >
          {loading ? "Checking…" : "Refresh"}
        </button>
      </div>

      {error && <div className="text-[12.5px]" style={{ color: tokens.danger }}>{error}</div>}

      {facts && (
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {stats.map((s) => (
            <div key={s.label} className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
              <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>{s.label}</span>
              <span className="text-[19px] font-medium" style={{ color: tokens.text }}>{s.value}</span>
              {s.badge && (
                <span
                  className="tag text-[9.5px] self-start"
                  style={{ border: `1px solid ${s.badge.positive ? tokens.success : tokens.danger}`, color: s.badge.positive ? tokens.success : tokens.danger }}
                >
                  {s.badge.text}
                </span>
              )}
              {s.sub && <span className="text-[10.5px] truncate" style={{ color: tokens.textQuaternary }}>{s.sub}</span>}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="flex flex-col gap-2.5">
          {!loading && recs.length === 0 && !error && (
            <div className="card elev-sm gap-1 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
              <div className="flex items-center gap-2">
                <span style={{ color: tokens.success }}><IconSparkle size={14} /></span>
                <span className="text-[13.5px]" style={{ color: tokens.text }}>You&rsquo;re caught up.</span>
              </div>
              <div className="text-[12.5px]" style={{ color: tokens.textTertiary }}>
                Nothing in your account data needs attention right now.
              </div>
            </div>
          )}
          {recs.map((r, i) => (
            <div key={i} className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full grid place-items-center flex-none" style={{ background: tokens.tint1, color: tokens.text }}>
                  <IconSparkle size={12} />
                </span>
                <span className="text-[13.5px] font-medium" style={{ color: tokens.text }}>{r.headline}</span>
              </div>
              <div className="text-[12.5px]" style={{ color: tokens.textSecondary }}>{r.detail}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="card elev-sm gap-3 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <div className="text-[13px] font-medium" style={{ color: tokens.text }}>Credits</div>
            {[
              { label: "Certificate credits", value: facts?.certificateCreditsRemaining ?? null, max: CERT_MAX },
              { label: "Stamp credits", value: facts?.stampCreditsRemaining ?? null, max: STAMP_MAX },
            ].map((c) => (
              <div key={c.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[12px]" style={{ color: tokens.textSecondary }}>
                  <span>{c.label}</span>
                  <span>{c.value ?? "—"}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: tokens.tint1 }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.value ? Math.min(100, (c.value / c.max) * 100) : 0}%`, background: tokens.text }}
                  />
                </div>
              </div>
            ))}
            <a href="/billing" className="text-[11.5px]" style={{ color: tokens.textTertiary }}>Buy more credits →</a>
          </div>

          <div className="card elev-sm gap-2 p-4" style={{ background: tokens.surface, border: `1px dashed ${tokens.borderDashed}` }}>
            <div className="text-[12.5px] font-medium" style={{ color: tokens.text }}>How this works</div>
            <div className="text-[11.5px]" style={{ color: tokens.textTertiary, lineHeight: 1.6 }}>
              Every number above and every recommendation is computed straight from your own signatures, wallet and
              credits — Primue never invents a market trend or a competitor comparison.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
