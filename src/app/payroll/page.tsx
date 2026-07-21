"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { initialRun, payslipHistory, type PayrollRow } from "@/components/payroll/data";
import { IconPayroll } from "@/components/icons";

const fmt = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function PayrollPage() {
  const [run, setRun] = useState<PayrollRow[]>(initialRun);
  const [processing, setProcessing] = useState(false);

  const netTotal = run.reduce((s, r) => s + (r.gross - r.deductions), 0);
  const allPaid = run.every((r) => r.status === "Paid");

  function runPayroll() {
    setProcessing(true);
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
        <main className="p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3">
            <div>
              <h3 className="m-0 text-[22px]">Payroll</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">August run · Meridian Studio</div>
            </div>
            <div className="flex-1" />
            <button className="btn btn-primary text-[13px]" onClick={runPayroll} disabled={allPaid || processing}>
              <IconPayroll size={14} />
              {processing ? "Processing…" : allPaid ? "Run complete" : "Run payroll"}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3.5">
            <div className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Next payroll date</div>
              <div className="font-medium text-[23px]">Aug 1</div>
              <div className="card-meta">2026</div>
            </div>
            <div className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">This run, net</div>
              <div className="font-medium text-[23px]">{fmt(netTotal)}</div>
              <div className="card-meta">{run.length} employees shown</div>
            </div>
            <div className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Employees in run</div>
              <div className="font-medium text-[23px]">22</div>
              <div className="card-meta">all active</div>
            </div>
            <div className="card elev-sm gap-1 p-[14px_16px]">
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">YTD payroll</div>
              <div className="font-medium text-[23px]">$312,400</div>
              <div className="card-meta">Jan–Jul 2026</div>
            </div>
          </div>

          <div className="card elev-sm p-[16px_18px] gap-2.5">
            <div className="card-title text-sm">This run</div>
            <table className="table text-[12.5px]">
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
              <span>+16 more employees on the full run</span>
              <span>Net total: {fmt(netTotal)}</span>
            </div>
          </div>

          <div className="card elev-sm p-[16px_18px] gap-2.5">
            <div className="card-title text-sm">Payslip history</div>
            <table className="table text-[12.5px]">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Employees</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payslipHistory.map((p) => (
                  <tr key={p.period}>
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
        </main>
      </div>
    </div>
  );
}
