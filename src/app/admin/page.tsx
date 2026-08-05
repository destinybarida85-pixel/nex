"use client";

import { useEffect, useState } from "react";
import { IconSearch } from "@/components/icons";
import type { Tenant } from "@/components/admin/tenants";
import TenantDrawer from "@/components/admin/TenantDrawer";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Kpis = { activeTenants: number; totalUsers: number; mrrCents: number; walletVolume30dCents: number; awaitingReply: number };

function money(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function planTag(plan: string) {
  return plan === "growth" ? "tag-accent" : plan === "starter" ? "tag-neutral" : "tag-outline";
}

function statusTag(status: string) {
  return status === "active" ? "tag-accent" : status === "trialing" ? "tag-outline" : "tag-neutral";
}

export default function AdminPage() {
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch("/api/admin")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) {
          setError("Backend isn't connected yet.");
          return;
        }
        if (data.error) {
          setError(data.error);
          return;
        }
        setKpis(data.kpis);
        setTenants(data.tenants);
        // Keep the drawer's own copy in sync after a suspend/unsuspend, so it
        // doesn't show a stale status until the next full reload.
        setSelected((prev) => (prev ? data.tenants.find((t: Tenant) => t.id === prev.id) ?? null : null));
      })
      .catch(() => setError("Couldn't reach the server."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = query.trim()
    ? tenants.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.domain?.toLowerCase().includes(query.toLowerCase()))
    : tenants;

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)] text-[var(--color-text)]">
      <AdminSidebar active="Tenants" />

      <main className="flex-1 min-w-0 p-4 pt-16 md:p-[22px_26px] flex flex-col gap-[18px]">
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <h4 className="m-0 text-[19px]">Tenants</h4>
            <div className="text-muted text-xs mt-0.5">
              All organizations on the platform · isolated data, shared infrastructure
            </div>
          </div>
        </div>

        {error && (
          <div className="text-[13px] px-4 py-2.5 rounded-xl" style={{ color: "var(--color-neutral-500)", border: "1px solid var(--color-divider)" }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Active tenants", value: kpis ? String(kpis.activeTenants) : "—" },
            { label: "Platform MRR", value: kpis ? money(kpis.mrrCents) : "—", meta: "Live from Stripe where connected" },
            { label: "Wallet volume · 30d", value: kpis ? money(kpis.walletVolume30dCents) : "—" },
            { label: "Awaiting reply", value: kpis ? String(kpis.awaitingReply) : "—", meta: "Support threads" },
          ].map((kpi) => (
            <div key={kpi.label} className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">{kpi.label}</div>
              <div className="font-medium text-[23px]">{kpi.value}</div>
              {kpi.meta && <div className="card-meta">{kpi.meta}</div>}
            </div>
          ))}
        </div>

        <div className="card elev-sm p-[16px_18px] gap-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="card-title text-sm">Organizations</div>
            <div className="flex-1 hidden sm:block" />
            <div className="flex items-center gap-2 w-full sm:w-[240px] px-2.5 py-1.5 bg-[var(--color-bg)] border border-[var(--color-divider)] rounded-lg text-[var(--color-neutral-500)] text-xs">
              <IconSearch size={13} />
              <input
                className="flex-1 bg-transparent border-none outline-none text-[var(--color-text)]"
                placeholder="Search tenants…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table text-[13.5px] min-w-[560px]">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Plan</th>
                  <th>Users</th>
                  <th>Wallet vol · 30d</th>
                  <th>Domain</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center text-[var(--color-neutral-500)] py-6">Loading…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-[var(--color-neutral-500)] py-6">No tenants match &ldquo;{query}&rdquo;.</td></tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t.id} className="cursor-pointer" onClick={() => setSelected(t)}>
                      <td>
                        {t.name}
                        {t.suspended && <span className="tag tag-outline text-[9px] ml-1.5">Suspended</span>}
                      </td>
                      <td><span className={`tag ${planTag(t.plan)}`}>{t.plan}</span></td>
                      <td>{t.users}</td>
                      <td>{money(t.walletVolume30dCents)}</td>
                      <td className="font-mono text-[11px]">{t.domain || "—"}</td>
                      <td><span className={`tag ${statusTag(t.subscriptionStatus)}`}>{t.subscriptionStatus}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="card-meta justify-between">
            <span>Showing {filtered.length} of {tenants.length}</span>
            <span>Tenant data is fully isolated · brand configs never cross tenants</span>
          </div>
        </div>
      </main>

      <TenantDrawer tenant={selected} onClose={() => setSelected(null)} onChanged={load} />
    </div>
  );
}
