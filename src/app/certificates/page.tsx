"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import CertificatePaper, { certificateDesigns, type CertificateDesign } from "@/components/certificates/CertificatePaper";
import { useCopy } from "@/components/invoices/SendInvoice";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import Stamp, { stampShapes, type StampShape } from "@/components/sign/Stamp";
import { findDesign, type CertificateStyle } from "@/components/certificates/designs";
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

  // Style overrides. Each starts unset so the chosen design's own defaults
  // apply; touching a control pins that one aspect without disturbing the rest.
  const [accentColor, setAccentColor] = useState<string>("");
  const [font, setFont] = useState<"" | "serif" | "sans">("");
  const [showStamp, setShowStamp] = useState(true);
  const [stampShape, setStampShape] = useState<StampShape | "">("");
  const [stampLabel, setStampLabel] = useState("CERTIFIED");
  const [stampSub, setStampSub] = useState("");

  const spec = findDesign(design);
  const style: CertificateStyle = {
    accentColor: accentColor || undefined,
    font: font || undefined,
    showStamp,
    stampShape: (stampShape || undefined) as StampShape | undefined,
    stampLabel,
    stampSub,
  };

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
        body: JSON.stringify({ design, recipientName, title, citation, issuerName: tenantName, accentColor: accentColor || undefined, style }),
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

              <div className="card elev-sm p-[14px_16px] gap-2.5">
                <div className="flex items-baseline gap-2">
                  <div className="card-title text-[13px]">Design</div>
                  <span className="text-[10.5px] text-[var(--color-neutral-500)]">{certificateDesigns.length} templates</span>
                </div>
                {/* Swatches rather than a list: at fifteen options the reason
                    you pick one is how it looks, so show the palette and frame
                    up front and keep the description for the selected one. */}
                <div className="grid grid-cols-5 gap-1.5">
                  {certificateDesigns.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDesign(d.id)}
                      title={d.label}
                      aria-label={d.label}
                      className="rounded-md cursor-pointer overflow-hidden relative"
                      style={{
                        height: 34,
                        background: d.paper,
                        border: design === d.id ? "2px solid var(--color-accent)" : "1px solid var(--color-divider)",
                      }}
                    >
                      <span className="absolute inset-x-0 top-0" style={{ height: 9, background: d.accent2 || d.accent }} />
                      <span className="absolute left-1 bottom-1 rounded-full" style={{ width: 8, height: 8, background: d.accent }} />
                    </button>
                  ))}
                </div>
                <div className="text-[10.5px] text-[var(--color-neutral-500)] leading-[1.5]">
                  <span className="text-[var(--color-text)] font-medium">{spec.label}</span> — {spec.why}
                </div>
              </div>

              <div className="card elev-sm p-[14px_16px] gap-2.5">
                <div className="card-title text-[13px]">Style</div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-[var(--color-neutral-500)] w-[52px]">Colour</span>
                  <button
                    onClick={() => setAccentColor("")}
                    className="text-[10px] px-2 py-1 rounded-md cursor-pointer"
                    style={{
                      border: `1px solid ${accentColor ? "var(--color-divider)" : "var(--color-accent)"}`,
                      color: accentColor ? "var(--color-neutral-500)" : "var(--color-accent-300)",
                    }}
                  >
                    Default
                  </button>
                  {["#c9a227", "#a8202a", "#2b6ca8", "#2f6b4a", "#9184d9", "#0c0c0c"].map((c) => (
                    <button
                      key={c}
                      aria-label={`Use ${c}`}
                      onClick={() => setAccentColor(c)}
                      className="w-[20px] h-[20px] rounded-md cursor-pointer"
                      style={{ background: c, outline: accentColor === c ? "2px solid var(--color-text)" : "none", outlineOffset: 2 }}
                    />
                  ))}
                  <label
                    className="w-[20px] h-[20px] rounded-md cursor-pointer grid place-items-center overflow-hidden"
                    title="Custom colour"
                    style={{ border: "1px dashed var(--color-neutral-600)" }}
                  >
                    <input type="color" aria-label="Custom certificate colour" value={accentColor || spec.accent} onChange={(e) => setAccentColor(e.target.value)} className="opacity-0 w-full h-full cursor-pointer" />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[var(--color-neutral-500)] w-[52px]">Font</span>
                  <select className="input text-[11.5px]" value={font} onChange={(e) => setFont(e.target.value as typeof font)}>
                    <option value="">Match the design ({spec.titleFont})</option>
                    <option value="serif">Serif — ceremonial</option>
                    <option value="sans">Sans — modern</option>
                  </select>
                </div>
              </div>

              <div className="card elev-sm p-[14px_16px] gap-2.5">
                <label className="radio gap-2 text-[12.5px]">
                  <input type="checkbox" checked={showStamp} onChange={(e) => setShowStamp(e.target.checked)} />
                  <span className="dot" style={{ borderRadius: 5 }} />
                  Show a seal
                </label>

                {showStamp && (
                  <>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setStampShape("")}
                        className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg cursor-pointer text-[9.5px]"
                        style={{
                          border: `1px solid ${stampShape ? "var(--color-divider)" : "var(--color-accent)"}`,
                          color: stampShape ? "var(--color-neutral-500)" : "var(--color-accent-300)",
                        }}
                      >
                        <span className="rounded-md grid place-items-center" style={{ width: 40, height: 30, background: "#fff" }}>
                          <Stamp label="SEAL" sub="" color={accentColor || spec.accent} size={24} shape={spec.stamp} />
                        </span>
                        Default
                      </button>
                      {stampShapes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStampShape(s.id)}
                          title={s.label}
                          className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg cursor-pointer text-[9.5px]"
                          style={{
                            border: `1px solid ${stampShape === s.id ? "var(--color-accent)" : "var(--color-divider)"}`,
                            color: stampShape === s.id ? "var(--color-accent-300)" : "var(--color-neutral-500)",
                          }}
                        >
                          {/* White chip behind each: the seal blends with
                              multiply, which goes invisible on this dark panel. */}
                          <span className="rounded-md grid place-items-center overflow-hidden" style={{ width: 40, height: 30, background: "#fff" }}>
                            <Stamp label="SEAL" sub="" color={accentColor || spec.accent} size={24} shape={s.id} />
                          </span>
                          {s.label.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input className="input text-[11.5px]" placeholder="Seal text" value={stampLabel} onChange={(e) => setStampLabel(e.target.value.toUpperCase().slice(0, 12))} />
                      <input className="input text-[11.5px]" placeholder="Sub text (optional)" value={stampSub} onChange={(e) => setStampSub(e.target.value.toUpperCase().slice(0, 16))} />
                    </div>
                  </>
                )}
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
                accentColor={accentColor || undefined}
                style={style}
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
