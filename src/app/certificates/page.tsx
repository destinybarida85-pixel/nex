"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import CertificatePaper, { certificateDesigns, type CertificateDesign } from "@/components/certificates/CertificatePaper";
import { useCopy } from "@/components/invoices/SendInvoice";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconSparkle, IconCopy, IconCheckCircle, IconLink } from "@/components/icons";

type IssuedCertificate = {
  id: string;
  design: CertificateDesign;
  recipient_name: string;
  title: string;
  issued_at: string;
};

export default function CertificatesPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [credits, setCredits] = useState(0);
  const [tenantName, setTenantName] = useState("");
  const [issued, setIssued] = useState<IssuedCertificate[]>([]);
  const [buying, setBuying] = useState(false);
  const [setupMessage, setSetupMessage] = useState("");

  const [design, setDesign] = useState<CertificateDesign>("ribbon");
  const [recipientName, setRecipientName] = useState("");
  const [title, setTitle] = useState("Achievement");
  const [citation, setCitation] = useState("In recognition of outstanding commitment and measurable impact.");

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiUnavailable, setAiUnavailable] = useState(false);

  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState("");
  const [justIssued, setJustIssued] = useState<string | null>(null);

  function load() {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then((data) => {
        if (data.setupRequired) {
          setSetupMessage(data.setupMessage || "This feature needs a database migration before it works.");
          return;
        }
        if (data.configured) {
          setLive(true);
          setCredits(data.credits ?? 0);
          setTenantName(data.tenantName ?? "");
          setIssued(data.certificates ?? []);
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, hasSession]);

  async function draftWithAI() {
    if (!aiPrompt.trim()) return;
    setAiBusy(true);
    setAiError("");
    try {
      const res = await fetch("/api/certificates/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });
      const data = await res.json();
      if (data.configured === false) {
        setAiUnavailable(true);
        return;
      }
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't draft that.");
      setTitle(data.title);
      setCitation(data.citation);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Couldn't reach the AI drafting service.");
    } finally {
      setAiBusy(false);
    }
  }

  async function issue() {
    setIssuing(true);
    setIssueError("");
    setJustIssued(null);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design, recipientName, title, citation, issuerName: tenantName }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't issue that certificate.");
      setJustIssued(data.certificate.id);
      setCredits(data.creditsRemaining);
      load();
    } catch (err) {
      setIssueError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setIssuing(false);
    }
  }

  async function buyCredits() {
    setBuying(true);
    try {
      const res = await fetch("/api/billing/certificate-credits", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Non-fatal — the button just stops spinning and the balance stays put.
    }
    setBuying(false);
  }

  const canIssue = recipientName.trim() && title.trim() && citation.trim() && credits > 0;

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Certificates" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0 max-w-[1160px] mx-auto w-full">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]">Certificates</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">
                {live ? "Premium, AI-assisted certificates — each one a real, verifiable record" : "Sign in to issue real certificates"}
              </div>
            </div>
            <div className="flex-1 hidden sm:block" />
            <div className="card elev-sm p-[10px_14px] flex items-center gap-3">
              <div>
                <div className="text-[9.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Credits</div>
                <div className="font-medium text-[18px]">{live ? credits : "2"}</div>
              </div>
              <button className="btn btn-secondary text-[11.5px]" onClick={buyCredits} disabled={buying || !live}>
                {buying ? "…" : "Buy 5 · $15"}
              </button>
            </div>
          </div>

          {setupMessage && (
            <div
              className="text-[12px] px-3.5 py-3 rounded-lg leading-[1.6]"
              style={{ background: "color-mix(in srgb, #e0a35b 15%, transparent)", color: "#e0a35b" }}
            >
              <strong>One setup step left.</strong> {setupMessage}
            </div>
          )}

          {live && credits === 0 && (
            <div className="text-[11.5px] px-3 py-2 rounded-lg" style={{ background: "var(--color-accent-900)", color: "var(--color-accent-300)" }}>
              Out of certificate credits — buy more above to keep issuing. Every tenant starts with 2 free.
            </div>
          )}

          <div className="grid gap-4 items-start" style={{ gridTemplateColumns: "1fr 1.15fr" }}>
            <div className="flex flex-col gap-3">
              <div className="card elev-sm p-[14px_16px] gap-2.5">
                <div className="flex items-center gap-2">
                  <IconSparkle size={13} className="text-[var(--color-accent)]" />
                  <div className="card-title text-[13px]">Draft with AI</div>
                </div>
                <div className="flex gap-2">
                  <input
                    className="input text-[12.5px] flex-1"
                    placeholder="e.g. Top sales performer, Q3 2026, closed $180k"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && draftWithAI()}
                  />
                  <button className="btn btn-primary text-[12px]" onClick={draftWithAI} disabled={aiBusy || !aiPrompt.trim()}>
                    {aiBusy ? "…" : "Draft"}
                  </button>
                </div>
                {aiUnavailable && (
                  <div className="text-[11px]" style={{ color: "var(--color-neutral-500)" }}>
                    AI drafting isn&rsquo;t connected yet — write the title and citation below yourself.
                  </div>
                )}
                {aiError && <div className="text-[11px]" style={{ color: "var(--color-accent-300)" }}>{aiError}</div>}
              </div>

              <div className="card elev-sm p-[14px_16px] gap-2.5">
                <div className="card-title text-[13px]">Details</div>
                <input className="input text-[12.5px]" placeholder="Recipient's full name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                <input className="input text-[12.5px]" placeholder="Title (appears after 'CERTIFICATE OF')" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea
                  className="input text-[12.5px]"
                  style={{ minHeight: 70, resize: "vertical" }}
                  placeholder="Citation — what they earned this for"
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                />
              </div>

              <div className="card elev-sm p-[14px_16px] gap-2">
                <div className="card-title text-[13px]">Design</div>
                <div className="flex flex-col gap-1.5">
                  {certificateDesigns.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDesign(d.id)}
                      className="text-left p-2.5 rounded-lg border cursor-pointer transition-colors"
                      style={{
                        borderColor: design === d.id ? "var(--color-accent)" : "var(--color-divider)",
                        background: design === d.id ? "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" : "transparent",
                      }}
                    >
                      <div className="text-[12.5px] font-medium text-[var(--color-text)]">{d.label}</div>
                      <div className="text-[10.5px] text-[var(--color-neutral-500)] mt-0.5">{d.why}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary btn-block text-[13px]" onClick={issue} disabled={!canIssue || issuing || !live}>
                {issuing ? "Issuing…" : credits === 0 && live ? "Buy credits to issue" : "Issue certificate · 1 credit"}
              </button>
              {issueError && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{issueError}</div>}
              {justIssued && <IssuedLink id={justIssued} />}
            </div>

            <div className="sticky top-4">
              <CertificatePaper
                design={design}
                recipientName={recipientName}
                title={title}
                citation={citation}
                issuerName={tenantName}
                issuedAt={new Date().toISOString()}
              />
            </div>
          </div>

          {issued.length > 0 && (
            <div className="card elev-sm p-[16px_18px] gap-2.5">
              <div className="card-title text-sm">Previously issued</div>
              <table className="table text-[12.5px]">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Title</th>
                    <th>Issued</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {issued.map((c) => (
                    <tr key={c.id}>
                      <td>{c.recipient_name}</td>
                      <td>Certificate of {c.title}</td>
                      <td>{new Date(c.issued_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td>
                        <a href={`/certificate/${c.id}`} target="_blank" rel="noreferrer" className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>
                          View ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function IssuedLink({ id }: { id: string }) {
  const { copied, copy } = useCopy();
  const url = typeof window !== "undefined" ? `${window.location.origin}/certificate/${id}` : "";
  return (
    <div className="card elev-sm gap-2 p-3">
      <div className="flex items-center gap-1.5 text-[11.5px] font-medium" style={{ color: "#63c3b2" }}>
        <IconCheckCircle size={13} />
        Certificate issued — real record, verifiable at this link
      </div>
      <div className="flex gap-1.5">
        <button className="btn btn-secondary text-[11px] flex-1" onClick={() => copy(url)}>
          <IconCopy size={11} />
          {copied ? "Copied!" : "Copy link"}
        </button>
        <a href={`/certificate/${id}`} target="_blank" rel="noreferrer" className="btn btn-ghost text-[11px] flex-1">
          <IconLink size={11} />
          Open
        </a>
      </div>
    </div>
  );
}
