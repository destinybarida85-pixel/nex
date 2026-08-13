"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconSparkle, IconCheckCircle, IconX } from "@/components/icons";

type Draft = { label: string; body: string };
type AiDraft = { summary: string; drafts: Draft[]; gaps: string | null };
type VipRequest = {
  id: string;
  input_text: string;
  input_source: "text" | "voice";
  ai_draft: AiDraft | null;
  status: "drafting" | "ready" | "approved" | "dismissed" | "error";
  created_at: string;
};

// Minimal shape of the (still browser-prefixed, not in lib.dom.d.ts) Web
// Speech API — just enough to type what's actually used below.
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// Real, in-browser speech-to-text (no server-side audio model needed) — this
// is what "voice note" actually means here: the browser transcribes as you
// speak, you see and can edit the text before it ever reaches the AI drafter.
function useSpeechInput(onResult: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSupported(!!getSpeechRecognitionCtor());
  }, []);

  function toggle() {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) text += e.results[i][0].transcript + " ";
      if (text.trim()) onResult(text.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  return { supported, listening, toggle };
}

export default function VipPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [plan, setPlan] = useState<string>("none");
  const [upgrading, setUpgrading] = useState(false);

  const [inputText, setInputText] = useState("");
  const [inputSource, setInputSource] = useState<"text" | "voice">("text");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [latestDraft, setLatestDraft] = useState<VipRequest | null>(null);
  const [requests, setRequests] = useState<VipRequest[]>([]);

  const speech = useSpeechInput((transcript) => {
    setInputSource("voice");
    setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  });

  function load() {
    fetch("/api/vip/requests")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) return;
        // A 403 "not on the VIP plan" is an expected state for most visitors,
        // not a failure — it still means the backend answered, so the upsell
        // card (gated on `live`) needs to render, not silently stay blank.
        setLive(true);
        if (data.error) return;
        setRequests(data.requests ?? []);
      })
      .catch(() => {});
  }

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenant) setPlan(data.tenant.plan ?? "none");
      })
      .catch(() => {});
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, hasSession]);

  async function upgrade() {
    setUpgrading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "vip" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Non-fatal — button just stops spinning.
    }
    setUpgrading(false);
  }

  async function submit() {
    if (!inputText.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    setLatestDraft(null);
    try {
      const res = await fetch("/api/vip/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText: inputText.trim(), inputSource }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't draft that.");
      setLatestDraft(data.request);
      setInputText("");
      setInputSource("text");
      load();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  async function setStatus(id: string, status: "approved" | "dismissed") {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/vip/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  }

  const vipVars = {
    "--color-bg": "#0a0a0a",
    "--color-surface": "#161616",
    "--color-text": "#f5f5f5",
    "--color-accent": "#ffffff",
    "--color-divider": "rgba(255,255,255,0.14)",
    "--color-neutral-400": "#a8a8a8",
    "--color-neutral-500": "#8a8a8a",
    "--color-neutral-600": "#6b6b6b",
  } as React.CSSProperties;

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="VIP" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main
          className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0 max-w-[880px] mx-auto w-full"
          style={{ ...vipVars, background: "var(--color-bg)", color: "var(--color-text)" }}
        >
          <div>
            <span className="tag text-[10px]" style={{ border: "1px solid #fff", color: "#fff" }}>VIP</span>
            <h3 className="m-0 mt-2.5 text-[24px]">Full management, on request.</h3>
            <div className="text-[13.5px] mt-1.5" style={{ color: "var(--color-neutral-400)" }}>
              Say or type what you need. Primue AI drafts it — replies, invoices, task lists, anything — ready for you to review and send. Nothing goes out without you.
            </div>
          </div>

          {live && plan !== "vip" && (
            <div className="card elev-md gap-3 p-6" style={{ background: "var(--color-surface)", border: "1px solid #fff" }}>
              <div className="flex items-baseline gap-3">
                <span className="font-medium text-[30px]">$249</span>
                <span className="text-[13px]" style={{ color: "var(--color-neutral-400)" }}>/ month</span>
              </div>
              <div className="flex flex-col gap-1.5 text-[13.5px]" style={{ color: "var(--color-neutral-400)" }}>
                <span>· Everything in Growth</span>
                <span>· Send a request by text or voice, any time</span>
                <span>· Primue AI drafts the real work — replies, invoices, follow-ups, task lists</span>
                <span>· You review and send — nothing is dispatched automatically</span>
              </div>
              <button className="btn btn-block text-[14px]" style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }} onClick={upgrade} disabled={upgrading}>
                {upgrading ? "Redirecting…" : "Upgrade to VIP"}
              </button>
            </div>
          )}

          {live && plan === "vip" && (
            <>
              <div className="card elev-sm gap-3 p-5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}>
                <textarea
                  className="input text-[14px]"
                  style={{ background: "#0a0a0a", color: "#f5f5f5", border: "1px solid var(--color-divider)", minHeight: 90 }}
                  placeholder="e.g. Reply to Sarah at Northbeam — tell her the invoice is 6 days overdue, keep it friendly but firm."
                  value={inputText}
                  onChange={(e) => { setInputText(e.target.value); setInputSource("text"); }}
                />
                <div className="flex items-center gap-2.5 flex-wrap">
                  {speech.supported && (
                    <button
                      className="btn text-[13px]"
                      style={{ border: `1px solid ${speech.listening ? "#fff" : "var(--color-divider)"}`, color: speech.listening ? "#fff" : "var(--color-neutral-400)" }}
                      onClick={speech.toggle}
                    >
                      {speech.listening ? "● Listening… tap to stop" : "🎙 Record a voice note"}
                    </button>
                  )}
                  <div className="flex-1" />
                  <button
                    className="btn text-[14px]"
                    style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }}
                    onClick={submit}
                    disabled={submitting || !inputText.trim()}
                  >
                    {submitting ? "Drafting…" : "Send to Primue AI"}
                  </button>
                </div>
                {!speech.supported && (
                  <div className="text-[11px]" style={{ color: "var(--color-neutral-600)" }}>
                    Voice input isn&rsquo;t supported in this browser — Chrome or Edge works best. Typing works everywhere.
                  </div>
                )}
                {submitError && <div className="text-[12px]" style={{ color: "#ff8a8a" }}>{submitError}</div>}
              </div>

              {latestDraft?.ai_draft && (
                <div className="card elev-md gap-3 p-5" style={{ background: "var(--color-surface)", border: "1px solid #fff" }}>
                  <div className="flex items-center gap-2">
                    <IconSparkle size={14} />
                    <span className="text-[13px] font-medium">{latestDraft.ai_draft.summary}</span>
                  </div>
                  {latestDraft.ai_draft.drafts.map((d, i) => (
                    <div key={i} className="rounded-lg p-3" style={{ background: "#0a0a0a", border: "1px solid var(--color-divider)" }}>
                      <div className="text-[11px] uppercase tracking-[.08em] mb-1.5" style={{ color: "var(--color-neutral-500)" }}>{d.label}</div>
                      <div className="text-[13.5px] whitespace-pre-wrap" style={{ lineHeight: 1.7 }}>{d.body}</div>
                    </div>
                  ))}
                  {latestDraft.ai_draft.gaps && (
                    <div className="text-[12px]" style={{ color: "var(--color-neutral-400)" }}>Note: {latestDraft.ai_draft.gaps}</div>
                  )}
                  <div className="flex gap-2">
                    <button className="btn text-[13px]" style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }} onClick={() => setStatus(latestDraft.id, "approved")}>
                      <IconCheckCircle size={13} /> Approved — I&rsquo;ll send it
                    </button>
                    <button className="btn text-[13px]" style={{ border: "1px solid var(--color-divider)", color: "var(--color-neutral-400)" }} onClick={() => setStatus(latestDraft.id, "dismissed")}>
                      <IconX size={13} /> Not this
                    </button>
                  </div>
                </div>
              )}

              {requests.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <div className="text-[13px] font-medium" style={{ color: "var(--color-neutral-400)" }}>Your requests</div>
                  {requests.map((r) => (
                    <div key={r.id} className="card elev-sm gap-1.5 p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] flex-1 truncate">{r.input_text}</span>
                        <span
                          className="tag text-[9.5px]"
                          style={{
                            border: `1px solid ${r.status === "approved" ? "#8fd6a8" : r.status === "error" ? "#ff8a8a" : "var(--color-divider)"}`,
                            color: r.status === "approved" ? "#8fd6a8" : r.status === "error" ? "#ff8a8a" : "var(--color-neutral-400)",
                          }}
                        >
                          {r.status}
                        </span>
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--color-neutral-600)" }}>
                        {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        {r.input_source === "voice" && " · via voice"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
