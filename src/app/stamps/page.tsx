"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

type SignatureRow = {
  id: string;
  signer_name: string;
  signed_at: string;
  stamp_applied: boolean;
  documents: { id: string; title: string } | { id: string; title: string }[];
};

function docTitle(row: SignatureRow) {
  return Array.isArray(row.documents) ? row.documents[0]?.title : row.documents?.title;
}

export default function StampHistoryPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [signatures, setSignatures] = useState<SignatureRow[]>([]);
  const [credits, setCredits] = useState(3);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/signatures")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setLive(true);
          if (data.signatures) setSignatures(data.signatures);
          if (typeof data.stampCredits === "number") setCredits(data.stampCredits);
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  async function buyCredits() {
    setBuying(true);
    try {
      const res = await fetch("/api/billing/stamp-credits", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // fall through
    }
    setBuying(false);
  }

  const stamped = signatures.filter((s) => s.stamp_applied);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="E-Signatures" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0 max-w-[820px]">
          <div>
            <h3 className="m-0 text-[22px]">Digital stamp history</h3>
            <div className="text-muted text-[12.5px] mt-[3px]">Every official seal your account has applied to a signed document.</div>
          </div>

          <div className="card elev-sm p-4 flex items-center gap-4 flex-wrap">
            <div>
              <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Stamp credits</div>
              <div className="font-medium text-[24px] mt-0.5">{live ? credits : "3"}</div>
            </div>
            <div className="flex-1" />
            <button className="btn btn-primary text-[12.5px]" onClick={buyCredits} disabled={buying || !live}>
              {buying ? "…" : "Buy 10 credits · $9"}
            </button>
          </div>
          {!live && <div className="text-[11.5px] text-[var(--color-neutral-500)]">Sign in to see your real stamp balance and history.</div>}

          {live && stamped.length === 0 && (
            <div className="card elev-sm p-6 text-center text-[12.5px] text-[var(--color-neutral-500)]">No stamps applied yet.</div>
          )}

          <div className="flex flex-col gap-2">
            {stamped.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
                <span
                  className="w-7 h-7 rounded-full grid place-items-center flex-none"
                  style={{ border: "1.5px solid var(--color-accent)", color: "var(--color-accent)" }}
                >
                  <span style={{ fontSize: 8, fontWeight: 700 }}>OK</span>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] truncate">{docTitle(s) || "Untitled document"}</div>
                  <div className="text-[11px] text-[var(--color-neutral-500)]">Sealed for {s.signer_name} · {new Date(s.signed_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
