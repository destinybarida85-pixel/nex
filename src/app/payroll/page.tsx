"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { initialRun, payslipHistory, type PayrollRow } from "@/components/payroll/data";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconPayroll } from "@/components/icons";

const fmt = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

type DbEmployee = { id: string; name: string; role: string; gross_cents: number; deduction_cents: number };
type DbRun = { id: string; period: string; employee_count: number; total_cents: number; created_at: string };

export default function PayrollPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [run, setRun] = useState<PayrollRow[]>(initialRun);
  const [history, setHistory] = useState(payslipHistory);
  const [processing, setProcessing] = useState(false);
  const [justRan, setJustRan] = useState(false);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/payroll")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) return;
        setLive(true);
        if (data.employees) {
          setRun(
            (data.employees as DbEmployee[]).map((e) => ({
              name: e.name,
              role: e.role,
              gross: e.gross_cents / 100,
              deductions: e.deduction_cents / 100,
              status: "Pending" as const,
            }))
          );
        }
        if (data.runs) {
          setHistory(
            (data.runs as DbRun[]).map((r) => ({
              period: r.period,
              employees: r.employee_count,
              total: fmt(r.total_cents / 100),
              date: `Recorded ${new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
            }))
          );
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  const netTotal = run.reduce((s, r) => s + (r.gross - r.deductions), 0);
  const allPaid = run.every((r) => r.status === "Paid") && (justRan || !live);

  async function runPayroll() {
    setProcessing(true);
    if (live) {
      const res = await fetch("/api/payroll", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.run) {
        setHistory((prev) => [
          { period: data.run.period, employees: data.run.employee_count, total: fmt(data.run.total_cents / 100), date: "Recorded just now" },
          ...prev,
        ]);
        setRun((prev) => prev.map((r) => ({ ...r, status: "Paid" as const })));
        setJustRan(true);
      }
      setProcessing(false);
      return;
    }
    setTimeout(() => {
      setRun((prev) => prev.map((r) => ({ ...r, status: "Paid" as const })));
      setProcessing(false);
    }, 1100);
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Payroll" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]">Payroll</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">{live ? "Based on your real employee directory" : "August run · Meridian Studio"}</div>
            </div>
            <div className="flex-1 hidden sm:block" />
            <button className="btn btn-primary text-[13px]" onClick={runPayroll} disabled={allPaid || processing || run.length === 0}>
              <IconPayroll size={14} />
              {processing ? "Processing…" : allPaid ? "Run complete" : "Run payroll"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Next payroll date</div>
              <div className="font-medium text-[23px]">{live ? "On demand" : "Aug 1"}</div>
              <div className="card-meta">{live ? "Run whenever you're ready" : "2026"}</div>
            </div>
            <div className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">This run, net</div>
              <div className="font-medium text-[23px]">{fmt(netTotal)}</div>
              <div className="card-meta">{run.length} employees{live ? "" : " shown"}</div>
            </div>
            <div className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Employees in run</div>
              <div className="font-medium text-[23px]">{run.length}</div>
              <div className="card-meta">{live ? "from your directory" : "all active"}</div>
            </div>
            <div className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Recorded runs</div>
              <div className="font-medium text-[23px]">{live ? history.length : "—"}</div>
              <div className="card-meta">{live ? "in history" : "Jan–Jul 2026"}</div>
            </div>
          </div>

          <div className="card elev-sm p-[16px_18px] gap-2.5 overflow-x-auto">
            <div className="card-title text-sm">This run</div>
            <table className="table text-[12.5px] min-w-[560px]">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Role</th>
                  <th className="text-right">Gross</th>
                  <th className="text-right">Deductions</th>
                  <th className="text-right">Net pay</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {run.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-[var(--color-neutral-500)] py-3">
                      No employees yet — add some on the Employees page first.
                    </td>
                  </tr>
                )}
                {run.map((r) => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td>{r.role}</td>
                    <td className="text-right">{fmt(r.gross)}</td>
                    <td className="text-right">{fmt(r.deductions)}</td>
                    <td className="text-right">{fmt(r.gross - r.deductions)}</td>
                    <td>
                      <span className={`tag ${r.status === "Paid" ? "tag-accent" : "tag-outline"}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="card-meta justify-between">
              <span>{live ? "Every active employee in this run" : "+16 more employees on the full run"}</span>
              <span>Net total: {fmt(netTotal)}</span>
            </div>
          </div>

          <div className="card elev-sm p-[16px_18px] gap-2.5 overflow-x-auto">
            <div className="card-title text-sm">Payslip history</div>
            <table className="table text-[12.5px] min-w-[420px]">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Employees</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((p, i) => (
                  <tr key={p.period + i}>
                    <td>{p.period}</td>
                    <td>{p.employees}</td>
                    <td>{p.total}</td>
                    <td>
                      <span className="tag tag-neutral">{p.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {live && (
            <div className="text-[11px] text-[var(--color-neutral-500)]">
              Running payroll here records a real history entry with real totals from your directory — it doesn&rsquo;t move real money yet. See{" "}
              <a href="/security" style={{ color: "var(--color-accent-300)" }}>/security</a> for what&rsquo;s live today.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
