"use client";

import { useEffect, useState } from "react";
import type { VipSection } from "@/components/vip/VipSidebar";

type WalletTx = {
  id: string;
  direction: "credit" | "debit";
  counterparty: string;
  amount_cents: number;
  status: string;
  memo: string | null;
  created_at: string;
};
type WalletAccount = { id: string; label: string; account_number: string; routing_number: string; balance_cents: number; currency: string };
type Doc = { id: string; status: string };
type Cert = { id: string };
type VipRequest = { id: string; status: string };

function money(cents: number) {
  return (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function mask(num: string) {
  if (num.length <= 4) return num;
  return `•••• ${num.slice(-4)}`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPanel({ onNavigate }: { onNavigate?: (s: VipSection) => void }) {
  const [fullName, setFullName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [certificates, setCertificates] = useState<Cert[]>([]);
  const [requests, setRequests] = useState<VipRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/me").then((r) => r.json()),
      fetch("/api/wallet").then((r) => r.json()),
      fetch("/api/documents").then((r) => r.json()),
      fetch("/api/certificates").then((r) => r.json()),
      fetch("/api/vip/requests").then((r) => r.json()),
    ])
      .then(([me, wallet, docs, certs, reqs]) => {
        if (me.configured) {
          setFullName(me.fullName || "");
          setTenantName(me.tenantName || "");
        }
        if (wallet.configured && !wallet.error) {
          setAccounts(wallet.accounts ?? []);
          setTransactions(wallet.transactions ?? []);
        }
        if (docs.configured && !docs.error) setDocuments(docs.documents ?? []);
        if (certs.configured && !certs.setupRequired) setCertificates(certs.certificates ?? []);
        if (reqs.configured && !reqs.error) setRequests(reqs.requests ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const cur30 = transactions.filter((t) => now - new Date(t.created_at).getTime() < 30 * day);
  const sum = (rows: WalletTx[], dir: "credit" | "debit") => rows.filter((t) => t.direction === dir).reduce((s, t) => s + t.amount_cents, 0);
  const earnings30 = sum(cur30, "credit");
  const spend30 = sum(cur30, "debit");
  const balanceCents = accounts.reduce((s, a) => s + a.balance_cents, 0);
  const profitMargin = earnings30 > 0 ? Math.round(((earnings30 - spend30) / earnings30) * 100) : 0;
  const gaugePct = Math.max(0, Math.min(100, profitMargin));

  const pendingSignatures = documents.filter((d) => d.status === "sent" || d.status === "pending").length;
  const latestActivity = transactions[0];

  // 12 weeks of net balance trend, oldest to newest.
  const weekly: number[] = [];
  for (let w = 11; w >= 0; w--) {
    const from = now - (w + 1) * 7 * day;
    const to = now - w * 7 * day;
    const inWeek = transactions.filter((t) => {
      const ts = new Date(t.created_at).getTime();
      return ts >= from && ts < to;
    });
    weekly.push(sum(inWeek, "credit") - sum(inWeek, "debit"));
  }
  const gaugeCirc = 2 * Math.PI * 40;

  const primaryAccount = accounts[0];

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>
          {greeting()}{fullName ? `, ${fullName.split(" ")[0]}` : ""}
        </h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
          {tenantName || "Your business"} — everything below is your real account data.
        </div>
      </div>

      {/* Stat row */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Wallet balance", value: money(balanceCents) },
          { label: "Earnings · 30d", value: money(earnings30) },
          { label: "Spend · 30d", value: money(spend30) },
          { label: "Docs & certs issued", value: String(documents.length + certificates.length) },
        ].map((s) => (
          <div key={s.label} className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: "#6b6b6b" }}>{s.label}</span>
            <span className="text-[20px] font-medium" style={{ color: "#fff" }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        {/* Left: trend chart + activity */}
        <div className="flex flex-col gap-3.5">
          <div className="card elev-sm gap-2 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium" style={{ color: "#fff" }}>Balance trend</span>
              <span className="text-[11px]" style={{ color: "#6b6b6b" }}>Last 12 weeks</span>
            </div>
            <svg viewBox="0 0 480 110" width="100%" height="110" preserveAspectRatio="none">
              {(() => {
                const max = Math.max(1, ...weekly.map((v) => Math.abs(v)));
                const points = weekly.map((v, i) => {
                  const x = (i / (weekly.length - 1)) * 480;
                  const y = 55 - (v / max) * 45;
                  return `${x},${y}`;
                });
                const path = `M${points.join(" L")}`;
                const areaPath = `${path} L480,110 L0,110 Z`;
                return (
                  <>
                    <path d={areaPath} fill="rgba(255,255,255,0.06)" />
                    <path d={path} fill="none" stroke="#fff" strokeWidth="2" />
                    <line x1="0" y1="55" x2="480" y2="55" stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="4 4" />
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="card elev-sm gap-2 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium" style={{ color: "#fff" }}>Recent transfers</span>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate?.("finance"); }} className="text-[11.5px]" style={{ color: "#8a8a8a" }}>
                View finance →
              </a>
            </div>
            {loaded && transactions.length === 0 && (
              <div className="text-[12.5px]" style={{ color: "#6b6b6b" }}>No transactions yet.</div>
            )}
            <div className="flex flex-col gap-1">
              {transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span
                    className="w-7 h-7 rounded-full grid place-items-center flex-none text-[12px]"
                    style={{
                      background: t.direction === "credit" ? "color-mix(in srgb, #8fd6a8 18%, transparent)" : "rgba(255,255,255,0.08)",
                      color: t.direction === "credit" ? "#8fd6a8" : "#a8a8a8",
                    }}
                  >
                    {t.direction === "credit" ? "↓" : "↑"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] truncate" style={{ color: "#f5f5f5" }}>{t.counterparty}</div>
                    <div className="text-[11px]" style={{ color: "#6b6b6b" }}>{new Date(t.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</div>
                  </div>
                  <span className="text-[13px]" style={{ color: t.direction === "credit" ? "#8fd6a8" : "#f5f5f5" }}>
                    {t.direction === "credit" ? "+" : "−"}{money(t.amount_cents)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: gauge, profile, account card, security */}
        <div className="flex flex-col gap-3.5">
          <div className="card elev-sm gap-2 p-5 items-center" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <span className="text-[12.5px] self-start" style={{ color: "#a8a8a8" }}>Profit margin · 30d</span>
            <svg viewBox="0 0 100 100" width="100" height="100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(gaugePct / 100) * gaugeCirc} ${gaugeCirc}`}
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="55" textAnchor="middle" fontSize="20" fill="#fff">{profitMargin}%</text>
            </svg>
            <span className="text-[11px] text-center" style={{ color: "#6b6b6b" }}>
              {earnings30 > 0 ? "Of 30-day earnings kept after expenses" : "No earnings yet this period"}
            </span>
          </div>

          <div className="card elev-sm gap-2.5 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full grid place-items-center flex-none text-[15px] font-medium" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>
                {(fullName || tenantName || "P").charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="text-[13.5px] truncate" style={{ color: "#fff" }}>{fullName || "Account owner"}</div>
                <div className="text-[11.5px] truncate" style={{ color: "#6b6b6b" }}>{tenantName}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium" style={{ color: "#fff" }}>{documents.length}</span>
                <span className="text-[10.5px]" style={{ color: "#6b6b6b" }}>Documents</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium" style={{ color: "#fff" }}>{certificates.length}</span>
                <span className="text-[10.5px]" style={{ color: "#6b6b6b" }}>Certificates</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium" style={{ color: "#fff" }}>{requests.length}</span>
                <span className="text-[10.5px]" style={{ color: "#6b6b6b" }}>VIP requests</span>
              </div>
            </div>
          </div>

          {primaryAccount && (
            <div className="card elev-sm gap-2 p-5" style={{ background: "#fff", color: "#0a0a0a" }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[.08em] uppercase" style={{ color: "#4a4a4a" }}>Your Primue Wallet</span>
                <span className="text-[10px]" style={{ color: "#4a4a4a" }}>{primaryAccount.label}</span>
              </div>
              <div className="text-[19px] font-medium tracking-[.04em]">{mask(primaryAccount.account_number)}</div>
              <div className="flex items-center justify-between text-[11px]" style={{ color: "#4a4a4a" }}>
                <span>Routing {mask(primaryAccount.routing_number)}</span>
                <span>{primaryAccount.currency}</span>
              </div>
            </div>
          )}

          <div className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
            <div className="text-[12.5px] font-medium" style={{ color: "#fff" }}>Security</div>
            <div className="text-[11.5px]" style={{ color: "#8a8a8a" }}>
              {pendingSignatures > 0
                ? `${pendingSignatures} document${pendingSignatures === 1 ? "" : "s"} waiting on a signature.`
                : latestActivity
                  ? `Last activity ${new Date(latestActivity.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}.`
                  : "No recent activity."}
            </div>
            <button
              className="text-[11.5px] self-start"
              style={{ color: "#a8a8a8", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
              onClick={() => onNavigate?.("account")}
            >
              Manage password & security →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
