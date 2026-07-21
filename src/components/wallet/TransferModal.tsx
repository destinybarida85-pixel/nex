"use client";

import { useState } from "react";
import { beneficiaries } from "./data";

export default function TransferModal({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (party: string, amount: number) => void;
}) {
  const [recipient, setRecipient] = useState(beneficiaries[0].name);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const value = Number(amount);
    if (!amount || isNaN(value) || value <= 0) {
      setError("Enter a valid amount greater than $0.");
      return;
    }
    onSend(recipient, value);
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title">Transfer money</div>
        <div className="dialog-body flex flex-col gap-3">
          <div className="field">
            <label>Recipient</label>
            <select
              className="input"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{ appearance: "auto" }}
            >
              {beneficiaries.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} — {b.bank}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Amount (USD)</label>
            <input
              className="input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              inputMode="decimal"
            />
          </div>
          <div className="field">
            <label>Note (optional)</label>
            <input className="input" placeholder="What's this for?" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          {error && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
        </div>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Send transfer</button>
        </div>
      </div>
    </div>
  );
}
