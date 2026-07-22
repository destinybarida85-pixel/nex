"use client";

import { useState } from "react";
import { generateCardNumber, generateExpiry, generateCVC } from "@/lib/generateCardNumber";
import { IconEye, IconEyeOff, IconPlus, IconLock } from "@/components/icons";

type BizCard = {
  label: string;
  number: string;
  expiry: string;
  cvc: string;
  frozen: boolean;
  limit: number;
  revealed: boolean;
};

const initialCards: BizCard[] = [
  { label: "Meridian Studio · Primary", number: "4185 2093 6647 2210", expiry: "09/29", cvc: "482", frozen: false, limit: 25000, revealed: false },
];

export default function CardsTab() {
  const [cards, setCards] = useState<BizCard[]>(initialCards);
  const [issuing, setIssuing] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  function toggleReveal(i: number) {
    setCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, revealed: !c.revealed } : c)));
  }

  function toggleFreeze(i: number) {
    setCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, frozen: !c.frozen } : c)));
  }

  function updateLimit(i: number, value: number) {
    setCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, limit: value } : c)));
  }

  function issueCard() {
    const label = newLabel.trim() || `Card ${cards.length + 1}`;
    setCards((prev) => [
      ...prev,
      { label, number: generateCardNumber(), expiry: generateExpiry(), cvc: generateCVC(), frozen: false, limit: 5000, revealed: true },
    ]);
    setNewLabel("");
    setIssuing(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {cards.map((card, i) => {
        const masked = card.number.replace(/\d(?=\d{4})/g, "•");
        return (
          <div key={i} className="grid gap-3.5 grid-cols-1 lg:grid-cols-[300px_1fr] items-start">
            <div
              className="rounded-2xl p-5 flex flex-col justify-between transition-all"
              style={{
                width: "100%",
                maxWidth: 300,
                aspectRatio: "1.586",
                background: card.frozen
                  ? "linear-gradient(140deg, var(--color-neutral-800), var(--color-neutral-900))"
                  : "linear-gradient(140deg, var(--color-accent-700), var(--color-accent-900))",
                boxShadow: "var(--shadow-md)",
                filter: card.frozen ? "grayscale(0.4)" : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-6 rounded-[4px]" style={{ background: "color-mix(in srgb, #fff 55%, transparent)" }} />
                {card.frozen && (
                  <span className="tag text-[9px]" style={{ background: "rgba(0,0,0,0.35)", color: "#fff" }}>
                    <IconLock size={9} /> Frozen
                  </span>
                )}
              </div>
              <div>
                <div className="font-mono text-[16px] tracking-[0.06em]" style={{ color: "#fff" }}>
                  {card.revealed ? card.number : masked}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] uppercase tracking-[0.06em]" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {card.label}
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {card.revealed ? `${card.expiry} · CVC ${card.cvc}` : `${card.expiry}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="card elev-sm p-4 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium">{card.label}</span>
                <button className="btn btn-ghost text-[11.5px]" onClick={() => toggleReveal(i)}>
                  {card.revealed ? <IconEyeOff size={13} /> : <IconEye size={13} />}
                  {card.revealed ? "Hide details" : "Reveal details"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12.5px]">{card.frozen ? "Card is frozen" : "Card is active"}</div>
                  <div className="text-[11px] text-[var(--color-neutral-500)]">
                    {card.frozen ? "No new transactions will be approved" : "Approving transactions normally"}
                  </div>
                </div>
                <button
                  className={card.frozen ? "btn btn-primary text-[12px]" : "btn btn-secondary text-[12px]"}
                  onClick={() => toggleFreeze(i)}
                >
                  <IconLock size={12} />
                  {card.frozen ? "Unfreeze" : "Freeze card"}
                </button>
              </div>

              <div className="field">
                <label>Monthly spending limit</label>
                <div className="flex items-center gap-2">
                  <input
                    className="input"
                    type="number"
                    value={card.limit}
                    onChange={(e) => updateLimit(i, Number(e.target.value) || 0)}
                    min={0}
                    step={500}
                  />
                  <span className="text-[12px] text-[var(--color-neutral-500)] flex-none">USD / mo</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {issuing ? (
        <div className="card elev-sm p-4 gap-2.5">
          <div className="card-title text-[13px]">Issue a new card</div>
          <div className="flex gap-1.5">
            <input
              className="input text-[12.5px]"
              placeholder="e.g. Marketing team card"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && issueCard()}
              autoFocus
            />
            <button className="btn btn-primary text-[12.5px] flex-none" onClick={issueCard}>
              Generate
            </button>
          </div>
        </div>
      ) : (
        <button className="btn btn-secondary text-[13px] self-start" onClick={() => setIssuing(true)}>
          <IconPlus size={13} />
          Issue new card
        </button>
      )}
    </div>
  );
}
