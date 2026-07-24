"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconESign, IconLock } from "@/components/icons";

type SignatureRow = {
  id: string;
  signer_name: string;
  signer_email: string;
  record_hash: string;
  signed_at: string;
  documents: { id: string; title: string } | { id: string; title: string }[];
};

function docTitle(row: SignatureRow) {
  return Array.isArray(row.documents) ? row.documents[0]?.title : row.documents?.title;
}

export default function SignatureHistoryPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [signatures, setSignatures] = useState<SignatureRow[]>([]);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/signatures")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setLive(true);
          if (data.signatures) setSignatures(data.signatures);
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="E-Signatures" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0 max-w-[820px]">
          <div>
            <h3 className="m-0 text-[22px]">Signature history</h3>
            <div className="text-muted text-[12.5px] mt-[3px]">
              Every signature your account has collected, each independently verifiable by its hash chain.
            </div>
          </div>

          {!live && (
            <div className="card elev-sm p-4 text-[12.5px] text-[var(--color-neutral-500)]">
              Sign in to see your real signature history.
            </div>
          )}

          {live && signatures.length === 0 && (
            <div className="card elev-sm p-6 text-center text-[12.5px] text-[var(--color-neutral-500)]">
              No documents signed yet. <a href="/sign" style={{ color: "var(--color-accent-300)" }}>Try the e-signature flow →</a>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {signatures.map((s) => (
              <div key={s.id} className="card elev-sm p-4 gap-2">
                <div className="flex items-center gap-2.5">
                  <IconESign size={15} className="text-[var(--color-accent)] flex-none" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] truncate">{docTitle(s) || "Untitled document"}</div>
                    <div className="text-[11.5px] text-[var(--color-neutral-500)]">
                      Signed by {s.signer_name} · {new Date(s.signed_at).toLocaleString()}
                    </div>
                  </div>
                  <span className="tag tag-accent text-[9.5px] flex-none">
                    <IconLock size={10} /> Verified
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[var(--color-neutral-600)] break-all">SHA-256: {s.record_hash}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
