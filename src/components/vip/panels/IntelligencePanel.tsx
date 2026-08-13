"use client";

import { useEffect, useState } from "react";
import { IconSparkle } from "@/components/icons";

type Recommendation = { headline: string; detail: string };
type Facts = {
  pendingSignatures: { count: number; oldestDays: number | null; oldestTitle: string | null };
  cashFlow30d: { netCents: number; previousPeriodNetCents: number };
  daysSinceLastWalletActivity: number | null;
  unreviewedAiDrafts: { count: number; oldestDays: number | null };
  certificateCreditsRemaining: number | null;
  stampCreditsRemaining: number | null;
};

function money(cents: number) {
  const abs = Math.abs(cents) / 100;
  return `${cents < 0 ? "−" : ""}$${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function IntelligencePanel() {
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [facts, setFacts] = useState<Facts | null>(null);
  const [error, setError] = useState("");
  const [showFacts, setShowFacts] = useState(false);

  function load() {
    setLoading(true);
    setError("");
    fetch("/api/vip/intelligence")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || data.error && !data.facts) {
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

  return (
    <div className="flex flex-col gap-5 max-w-[680px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>Intelligence</h3>
          <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
            Recommendations computed from your own account data — never a market or competitor claim, since
            Primue doesn&rsquo;t have access to that.
          </div>
        </div>
        <button
          className="btn text-[12.5px] flex-none"
          style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#a8a8a8" }}
          onClick={load}
          disabled={loading}
        >
          {loading ? "Checking…" : "Refresh"}
        </button>
      </div>

      {error && <div className="text-[12.5px]" style={{ color: "#ff8a8a" }}>{error}</div>}

      {!loading && recs.length === 0 && !error && (
        <div className="card elev-sm gap-1 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="flex items-center gap-2">
            <span style={{ color: "#8fd6a8" }}><IconSparkle size={14} /></span>
            <span className="text-[13.5px]" style={{ color: "#fff" }}>You&rsquo;re caught up.</span>
          </div>
          <div className="text-[12.5px]" style={{ color: "#8a8a8a" }}>
            Nothing in your account data needs attention right now.
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {recs.map((r, i) => (
          <div key={i} className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <div className="flex items-center gap-2">
              <span style={{ color: "#fff" }}><IconSparkle size={13} /></span>
              <span className="text-[13.5px] font-medium" style={{ color: "#fff" }}>{r.headline}</span>
            </div>
            <div className="text-[12.5px]" style={{ color: "#a8a8a8" }}>{r.detail}</div>
          </div>
        ))}
      </div>

      {facts && (
        <div>
          <button
            className="text-[12px]"
            style={{ color: "#6b6b6b", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onClick={() => setShowFacts((v) => !v)}
          >
            {showFacts ? "Hide" : "Show"} the real numbers this is based on
          </button>
          {showFacts && (
            <div className="card elev-sm gap-1.5 p-4 mt-2" style={{ background: "#0a0a0a", border: "1px dashed rgba(255,255,255,0.2)" }}>
              <div className="text-[12px]" style={{ color: "#a8a8a8" }}>
                Pending signatures: {facts.pendingSignatures.count}
                {facts.pendingSignatures.oldestDays !== null && ` (oldest ${facts.pendingSignatures.oldestDays}d — "${facts.pendingSignatures.oldestTitle}")`}
              </div>
              <div className="text-[12px]" style={{ color: "#a8a8a8" }}>
                Cash flow, last 30 days: {money(facts.cashFlow30d.netCents)} (previous 30 days: {money(facts.cashFlow30d.previousPeriodNetCents)})
              </div>
              <div className="text-[12px]" style={{ color: "#a8a8a8" }}>
                Days since last wallet activity: {facts.daysSinceLastWalletActivity ?? "no activity yet"}
              </div>
              <div className="text-[12px]" style={{ color: "#a8a8a8" }}>
                Unreviewed AI drafts: {facts.unreviewedAiDrafts.count}
                {facts.unreviewedAiDrafts.oldestDays !== null && ` (oldest ${facts.unreviewedAiDrafts.oldestDays}d)`}
              </div>
              <div className="text-[12px]" style={{ color: "#a8a8a8" }}>
                Certificate credits remaining: {facts.certificateCreditsRemaining ?? "—"}
              </div>
              <div className="text-[12px]" style={{ color: "#a8a8a8" }}>
                Stamp credits remaining: {facts.stampCreditsRemaining ?? "—"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
