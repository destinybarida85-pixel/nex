"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import KanbanBoard from "@/components/crm/KanbanBoard";
import { initialDeals, type Deal, type Stage } from "@/components/crm/deals";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconPlus } from "@/components/icons";

type DbDeal = { id: string; company: string; title: string; value_cents: number; contact: string | null; stage: Stage };

function fromDb(d: DbDeal): Deal {
  return {
    id: d.id,
    company: d.company,
    title: d.title,
    value: `$${(d.value_cents / 100).toLocaleString()}`,
    contact: d.contact || "",
    stage: d.stage,
    days: 0,
  };
}

export default function CrmPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/crm")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setLive(true);
          if (data.deals) setDeals(data.deals.map(fromDb));
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  async function handleDrop(id: string, stage: Stage) {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage, days: 0 } : d)));
    setDragOverStage(null);
    if (live) {
      await fetch(`/api/crm/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
    }
  }

  async function createDeal() {
    if (!company.trim() || !title.trim()) {
      setError("Give the deal a company and a title.");
      return;
    }
    setCreating(true);
    setError("");
    const valueCents = Math.round(Number(value.replace(/[^0-9.]/g, "")) * 100) || 0;

    if (live) {
      const res = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: company.trim(), title: title.trim(), valueCents, contact: contact.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Couldn't create the deal.");
        setCreating(false);
        return;
      }
      setDeals((prev) => [fromDb(data.deal), ...prev]);
    } else {
      setDeals((prev) => [
        { id: `d-${Date.now()}`, company: company.trim(), title: title.trim(), value: `$${Number(value.replace(/[^0-9.]/g, "") || 0).toLocaleString()}`, contact: contact.trim(), stage: "Lead", days: 0 },
        ...prev,
      ]);
    }
    setFormOpen(false);
    setCompany("");
    setTitle("");
    setValue("");
    setContact("");
    setCreating(false);
  }

  const openDeals = deals.filter((d) => d.stage !== "Won");
  const pipelineValue = openDeals.reduce((sum, d) => sum + Number(d.value.replace(/[^0-9.]/g, "")), 0);
  const wonCount = deals.filter((d) => d.stage === "Won").length;
  const winRate = deals.length > 0 ? Math.round((wonCount / deals.length) * 100) : 0;
  const avgDealSize = openDeals.length > 0 ? Math.round(pipelineValue / openDeals.length) : 0;

  const kpis = [
    { label: "Pipeline value", value: `$${pipelineValue.toLocaleString()}` },
    { label: "Open deals", value: String(openDeals.length), metaLabel: `across ${new Set(openDeals.map((d) => d.stage)).size} stages` },
    { label: "Win rate", value: `${winRate}%` },
    { label: "Avg deal size", value: `$${avgDealSize.toLocaleString()}`, metaLabel: "open pipeline" },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Clients" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]">Sales pipeline</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">
                Drag a deal to move it between stages{live && " · Saved to your account"}
              </div>
            </div>
            <div className="flex-1 hidden sm:block" />
            <button className="btn btn-primary text-[13px]" onClick={() => setFormOpen((v) => !v)}>
              <IconPlus size={14} />
              New deal
            </button>
          </div>

          {formOpen && (
            <div className="card elev-sm p-4 gap-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input className="input text-[13px]" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                <input className="input text-[13px]" placeholder="Deal title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input className="input text-[13px]" placeholder="Value (e.g. 12000)" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
                <input className="input text-[13px]" placeholder="Contact name" value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
              {error && <div className="text-[12px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
              <div className="flex gap-1.5">
                <button className="btn btn-primary text-[12.5px] flex-none" onClick={createDeal} disabled={creating}>
                  {creating ? "Adding…" : "Add deal"}
                </button>
                <button className="btn btn-secondary text-[12.5px] flex-none" onClick={() => setFormOpen(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="card elev-sm gap-1 p-[14px_16px]">
                <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">{kpi.label}</div>
                <div className="font-medium text-[23px]">{kpi.value}</div>
                {kpi.metaLabel && <div className="card-meta">{kpi.metaLabel}</div>}
              </div>
            ))}
          </div>

          <KanbanBoard
            deals={deals}
            dragOverStage={dragOverStage}
            onDragOver={setDragOverStage}
            onDragLeave={() => setDragOverStage(null)}
            onDrop={handleDrop}
          />
        </main>
      </div>
    </div>
  );
}
