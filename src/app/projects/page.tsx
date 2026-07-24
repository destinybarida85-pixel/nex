"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconPlus } from "@/components/icons";

type Status = "Planning" | "Active" | "Blocked" | "Done";

type Project = {
  id: string;
  name: string;
  client: string | null;
  status: Status;
  due_date: string | null;
  notes: string | null;
};

const demoProjects: Project[] = [
  { id: "d1", name: "Brand refresh", client: "Northbeam Co.", status: "Active", due_date: null, notes: null },
  { id: "d2", name: "Q3 service agreement rollout", client: "Halcyon Ventures", status: "Planning", due_date: null, notes: null },
  { id: "d3", name: "Onboarding portal", client: "Atlas Chambers", status: "Done", due_date: null, notes: null },
];

const statusTag: Record<Status, string> = {
  Planning: "tag-outline",
  Active: "tag-accent",
  Blocked: "tag-neutral",
  Done: "tag-neutral",
};

const statuses: Status[] = ["Planning", "Active", "Blocked", "Done"];

export default function ProjectsPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setLive(true);
          if (data.projects) setProjects(data.projects);
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  async function addProject() {
    if (!name.trim()) {
      setError("Give the project a name.");
      return;
    }
    setCreating(true);
    setError("");
    if (live) {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), client: client.trim(), dueDate: dueDate || null }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Couldn't add the project.");
        setCreating(false);
        return;
      }
      setProjects((prev) => [data.project, ...prev]);
    } else {
      setProjects((prev) => [
        { id: `local-${Date.now()}`, name: name.trim(), client: client.trim() || null, status: "Planning", due_date: dueDate || null, notes: null },
        ...prev,
      ]);
    }
    setFormOpen(false);
    setName("");
    setClient("");
    setDueDate("");
    setCreating(false);
  }

  async function updateStatus(id: string, status: Status) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    if (live) {
      await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }).catch(() => {});
    }
  }

  const kpis = [
    { label: "Total projects", value: String(projects.length) },
    { label: "Active", value: String(projects.filter((p) => p.status === "Active").length) },
    { label: "Blocked", value: String(projects.filter((p) => p.status === "Blocked").length) },
    { label: "Done", value: String(projects.filter((p) => p.status === "Done").length) },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Projects" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]">Projects</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">Track the work behind each client{live && " · saved to your account"}</div>
            </div>
            <div className="flex-1 hidden sm:block" />
            <button className="btn btn-primary text-[13px]" onClick={() => setFormOpen((v) => !v)}>
              <IconPlus size={14} />
              New project
            </button>
          </div>

          {formOpen && (
            <div className="card elev-sm p-4 gap-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input className="input text-[13px]" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="input text-[13px]" placeholder="Client (optional)" value={client} onChange={(e) => setClient(e.target.value)} />
                <input className="input text-[13px]" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              {error && <div className="text-[12px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
              <div className="flex gap-1.5">
                <button className="btn btn-primary text-[12.5px] flex-none" onClick={addProject} disabled={creating}>
                  {creating ? "Creating…" : "Create project"}
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
              </div>
            ))}
          </div>

          <div className="card elev-sm p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr className="text-left text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">
                    <th className="p-[12px_16px] font-normal">Project</th>
                    <th className="p-[12px_16px] font-normal">Client</th>
                    <th className="p-[12px_16px] font-normal">Due</th>
                    <th className="p-[12px_16px] font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} className="border-t" style={{ borderColor: "var(--color-divider)" }}>
                      <td className="p-[12px_16px]">{p.name}</td>
                      <td className="p-[12px_16px] text-[var(--color-neutral-400)]">{p.client || "—"}</td>
                      <td className="p-[12px_16px] text-[var(--color-neutral-400)]">
                        {p.due_date ? new Date(p.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                      </td>
                      <td className="p-[12px_16px]">
                        <select
                          className={`tag ${statusTag[p.status]}`}
                          style={
                            p.status === "Blocked"
                              ? { border: "none", cursor: "pointer", background: "color-mix(in srgb, #e0665f 20%, transparent)", color: "#e0665f" }
                              : { border: "none", background: "transparent", cursor: "pointer" }
                          }
                          value={p.status}
                          onChange={(e) => updateStatus(p.id, e.target.value as Status)}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
