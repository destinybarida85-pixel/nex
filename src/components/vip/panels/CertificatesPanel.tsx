"use client";

import { useEffect, useState } from "react";
import { useVipTheme } from "@/components/vip/theme";

type CertRow = { id: string; recipient_name: string; title: string; issued_at: string };

const CERT_MAX = 10;

export default function CertificatesPanel() {
  const { tokens } = useVipTheme();
  const [certs, setCerts] = useState<CertRow[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);

  const [recipientName, setRecipientName] = useState("");
  const [certTitle, setCertTitle] = useState("");
  const [citation, setCitation] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState("");
  const [issued, setIssued] = useState(false);

  function load() {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && !data.setupRequired) {
          setCerts(data.certificates ?? []);
          setCredits(data.credits ?? 0);
        }
        setSetupRequired(!!data.setupRequired);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }

  useEffect(() => {
    load();
  }, []);

  async function issueCertificate() {
    if (!recipientName.trim() || !certTitle.trim() || !citation.trim()) return;
    setIssuing(true);
    setIssueError("");
    setIssued(false);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientName: recipientName.trim(), title: certTitle.trim(), citation: citation.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't issue that certificate.");
      setRecipientName("");
      setCertTitle("");
      setCitation("");
      setIssued(true);
      load();
    } catch (err) {
      setIssueError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setIssuing(false);
    }
  }

  const uniqueRecipients = new Set(certs.map((c) => c.recipient_name)).size;
  const latest = certs[0];
  const outOfCredits = credits !== null && credits < 1;

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: tokens.text }}>Certificates</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: tokens.textSecondary }}>
          Real, verifiable certificates issued in your name.
        </div>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Issued", value: String(certs.length) },
          { label: "Credits remaining", value: credits ?? "—" },
          { label: "Recipients", value: String(uniqueRecipients) },
          { label: "Latest issued", value: latest ? new Date(latest.issued_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—" },
        ].map((s) => (
          <div key={s.label} className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>{s.label}</span>
            <span className="text-[20px] font-medium" style={{ color: tokens.text }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium" style={{ color: tokens.textSecondary }}>All certificates</span>
          </div>
          {loaded && certs.length === 0 && (
            <div className="text-[13.5px]" style={{ color: tokens.textQuaternary }}>No certificates issued yet.</div>
          )}
          {certs.length > 0 && (
            <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${tokens.border}` }}>
              <table className="w-full text-[12.5px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${tokens.border}` }}>
                    {["Recipient", "Title", "Date"].map((h) => (
                      <th key={h} className="text-left p-2.5" style={{ color: tokens.textQuaternary, fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {certs.map((c) => (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${tokens.tint3}` }}>
                      <td className="p-2.5" style={{ color: tokens.text }}>{c.recipient_name}</td>
                      <td className="p-2.5 truncate" style={{ color: tokens.textSecondary, maxWidth: 220 }}>{c.title}</td>
                      <td className="p-2.5" style={{ color: tokens.textSecondary }}>
                        {new Date(c.issued_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="card elev-sm gap-2.5 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <div className="text-[13px] font-medium" style={{ color: tokens.text }}>Issue a certificate</div>
            {setupRequired ? (
              <div className="text-[12px]" style={{ color: tokens.textTertiary }}>
                Certificates need one database migration before they work — see the main dashboard for setup.
              </div>
            ) : (
              <>
                <input
                  className="input text-[13.5px]"
                  style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
                  placeholder="Recipient name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
                <input
                  className="input text-[13.5px]"
                  style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
                  placeholder="Certificate title"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                />
                <textarea
                  className="input text-[13px]"
                  style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}`, minHeight: 64 }}
                  placeholder="Citation — what is this for?"
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                />
                {issueError && <div className="text-[12px]" style={{ color: tokens.danger }}>{issueError}</div>}
                {issued && !issueError && <div className="text-[12px]" style={{ color: tokens.success }}>Issued</div>}
                {outOfCredits && !issueError && <div className="text-[12px]" style={{ color: tokens.warning }}>Out of certificate credits.</div>}
                <button
                  className="btn text-[13px] self-start"
                  style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }}
                  onClick={issueCertificate}
                  disabled={issuing || outOfCredits || !recipientName.trim() || !certTitle.trim() || !citation.trim()}
                >
                  {issuing ? "Issuing…" : "Issue certificate"}
                </button>
                <a href="/certificates" className="text-[11px]" style={{ color: tokens.textQuaternary }}>
                  Want a specific design or watermark? Open the full editor →
                </a>
              </>
            )}
          </div>

          <div className="card elev-sm gap-2.5 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <div className="text-[13px] font-medium" style={{ color: tokens.text }}>Credits</div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[12px]" style={{ color: tokens.textSecondary }}>
                <span>Certificate credits</span>
                <span>{credits ?? "—"}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: tokens.tint1 }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${credits ? Math.min(100, (credits / CERT_MAX) * 100) : 0}%`, background: tokens.text }}
                />
              </div>
            </div>
            <a href="/billing" className="text-[11.5px]" style={{ color: tokens.textTertiary }}>Buy more credits →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
