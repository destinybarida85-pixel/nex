"use client";

import { useState } from "react";
import { IconSearch, IconPlus } from "@/components/icons";
import { tenants, type Tenant } from "@/components/admin/tenants";
import TenantDrawer from "@/components/admin/TenantDrawer";
import AdminSidebar from "@/components/admin/AdminSidebar";

const kpis = [
  { label: "Active tenants", value: "412", meta: "▲ 18", metaLabel: "this month" },
  { label: "Platform MRR", value: "$186,420", meta: "▲ 6.2%", metaLabel: "vs June" },
  { label: "Wallet volume · 30d", value: "$42.8M", metaLabel: "across 389 wallets" },
  { label: "Open tickets", value: "23", metaLabel: "4 escalated" },
];

export default function AdminPage() {
  const [selected, setSelected] = useState<Tenant | null>(null);

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
          <div className="flex-1 hidden sm:block" />
          <button className="btn btn-primary text-[12.5px]">
            <IconPlus size={13} />
            New tenant
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">{kpi.label}</div>
              <div className="font-medium text-[23px]">{kpi.value}</div>
              <div className="card-meta">
                {kpi.meta && <span className="tag tag-accent text-[9.5px]">{kpi.meta}</span>}
                {kpi.metaLabel}
              </div>
            </div>
          ))}
        </div>

        <div className="card elev-sm p-[16px_18px] gap-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="card-title text-sm">Organizations</div>
            <div className="flex-1 hidden sm:block" />
            <div className="flex items-center gap-2 w-full sm:w-[240px] px-2.5 py-1.5 bg-[var(--color-bg)] border border-[var(--color-divider)] rounded-lg text-[var(--color-neutral-500)] text-xs">
              <IconSearch size={13} />
              Search tenants…
            </div>
          </div>
          <div className="overflow-x-auto">
          <table className="table text-[12.5px] min-w-[560px]">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Brand</th>
                <th>Plan</th>
                <th>Users</th>
                <th>Wallet vol · 30d</th>
                <th>Domain</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.org} className="cursor-pointer" onClick={() => setSelected(t)}>
                  <td>{t.org}</td>
                  <td>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: t.brand }} />
                      {t.brandLabel}
                    </span>
                  </td>
                  <td>
                    <span className={`tag ${t.planTag}`}>{t.plan}</span>
                  </td>
                  <td>{t.users}</td>
                  <td>{t.volume}</td>
                  <td className="font-mono text-[11px]">{t.domain}</td>
                  <td>
                    <span className={`tag ${t.statusTag}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="card-meta justify-between">
            <span>Showing 5 of 412</span>
            <span>Tenant data is fully isolated · brand configs never cross tenants</span>
          </div>
        </div>
      </main>

      <TenantDrawer tenant={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
