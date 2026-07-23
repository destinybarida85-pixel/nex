"use client";

import { useState } from "react";
import { beneficiaries as demoBeneficiaries } from "./data";
import { IconPlus } from "@/components/icons";

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState(demoBeneficiaries);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [bank, setBank] = useState("");

  function addBeneficiary() {
    if (!name.trim()) return;
    setBeneficiaries((prev) => [...prev, { name: name.trim(), bank: bank.trim() || "—", account: "New" }]);
    setName("");
    setBank("");
    setFormOpen(false);
  }

  return (
    <div className="card elev-sm p-[16px_18px] gap-2.5">
      <div className="flex items-baseline">
        <div className="card-title text-sm">Beneficiaries</div>
        <button className="btn btn-ghost text-[11.5px] ml-auto" onClick={() => setFormOpen((v) => !v)}>
          <IconPlus size={12} />
          Add
        </button>
      </div>
      {formOpen && (
        <div className="flex flex-col gap-1.5 p-2.5 rounded-lg" style={{ background: "var(--color-bg)" }}>
          <input className="input text-[12px]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input text-[12px]" placeholder="Bank" value={bank} onChange={(e) => setBank(e.target.value)} />
          <button className="btn btn-primary text-[11.5px]" onClick={addBeneficiary}>Save</button>
        </div>
      )}
      <div className="flex flex-col">
        {beneficiaries.map((b) => (
          <div key={b.name} className="flex items-center gap-2.5 py-2">
            <span
              className="w-7 h-7 rounded-[9px] grid place-items-center text-[11px] font-medium flex-none"
              style={{ background: "var(--color-neutral-800)", color: "var(--color-neutral-300)" }}
            >
              {b.name.charAt(0)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] truncate">{b.name}</div>
              <div className="text-[10.5px] text-[var(--color-neutral-500)]">{b.bank}</div>
            </div>
            <span className="font-mono text-[11px] text-[var(--color-neutral-500)]">{b.account}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
