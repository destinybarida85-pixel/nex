"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import OrgChart from "@/components/employees/OrgChart";
import DirectoryTable from "@/components/employees/DirectoryTable";
import { employees as demoEmployees, type Employee } from "@/components/employees/directory";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconPlus } from "@/components/icons";

type DbEmployee = { id: string; name: string; role: string; department: string; location: string | null; status: Employee["status"]; start_date: string };

function fromDb(e: DbEmployee): Employee {
  return {
    name: e.name,
    role: e.role,
    department: e.department,
    status: e.status,
    statusTag: e.status === "Active" ? "tag-neutral" : e.status === "Onboarding" ? "tag-accent" : "tag-outline",
    start: new Date(e.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    location: e.location || "Remote",
  };
}

export default function EmployeesPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(demoEmployees);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [gross, setGross] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/employees")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setLive(true);
          if (data.employees) setEmployees(data.employees.map(fromDb));
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  async function addEmployee() {
    if (!name.trim() || !role.trim()) {
      setError("Give them a name and a role.");
      return;
    }
    setCreating(true);
    setError("");
    const grossCents = Math.round(Number(gross.replace(/[^0-9.]/g, "")) * 100) || 0;

    if (live) {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), role: role.trim(), department: department.trim(), location: location.trim(), grossCents }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Couldn't add the employee.");
        setCreating(false);
        return;
      }
      setEmployees((prev) => [fromDb(data.employee), ...prev]);
    } else {
      setEmployees((prev) => [
        { name: name.trim(), role: role.trim(), department: department.trim() || "General", status: "Active", statusTag: "tag-neutral", start: "Just now", location: location.trim() || "Remote" },
        ...prev,
      ]);
    }
    setFormOpen(false);
    setName("");
    setRole("");
    setDepartment("");
    setLocation("");
    setGross("");
    setCreating(false);
  }

  const kpis = [
    { label: "Total employees", value: String(employees.length) },
    { label: "Open roles", value: "2", metaLabel: "Product, Engineering" },
    { label: "Avg tenure", value: live ? "—" : "1.4 yrs", metaLabel: "across team" },
    { label: "Departments", value: String(new Set(employees.map((e) => e.department)).size) },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Employees" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]">Employees</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">Directory, structure and headcount{live && " · saved to your account"}</div>
            </div>
            <div className="flex-1 hidden sm:block" />
            <button className="btn btn-primary text-[13px]" onClick={() => setFormOpen((v) => !v)}>
              <IconPlus size={14} />
              Add employee
            </button>
          </div>

          {formOpen && (
            <div className="card elev-sm p-4 gap-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input className="input text-[13px]" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="input text-[13px]" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
                <input className="input text-[13px]" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                <input className="input text-[13px]" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <input className="input text-[13px]" placeholder="Monthly gross pay (e.g. 8500)" inputMode="decimal" value={gross} onChange={(e) => setGross(e.target.value)} />
              </div>
              {error && <div className="text-[12px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
              <div className="flex gap-1.5">
                <button className="btn btn-primary text-[12.5px] flex-none" onClick={addEmployee} disabled={creating}>
                  {creating ? "Adding…" : "Add employee"}
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

          <OrgChart />
          <DirectoryTable employees={employees} live={live} />
        </main>
      </div>
    </div>
  );
}
