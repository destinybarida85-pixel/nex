"use client";

import { useEffect, useRef, useState } from "react";
import { IconSparkle, IconCheckCircle, IconX, IconMic, IconSend } from "@/components/icons";
import { useVipTheme } from "@/components/vip/theme";

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

const PAGE_SIZE = 5;

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

export default function RequestsPanel() {
  const { tokens } = useVipTheme();
  const [inputText, setInputText] = useState("");
  const [inputSource, setInputSource] = useState<"text" | "voice">("text");
  const [inputFocused, setInputFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [latestDraft, setLatestDraft] = useState<VipRequest | null>(null);

  // A wider, one-time fetch just to compute the stat row — separate from the
  // paginated history list below, since a page of 5 can't tell you the total.
  const [statsRequests, setStatsRequests] = useState<VipRequest[]>([]);

  const [page, setPage] = useState(0);
  const [historyRequests, setHistoryRequests] = useState<VipRequest[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const speech = useSpeechInput((transcript) => {
    setInputSource("voice");
    setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  });

  function loadStats() {
    fetch("/api/vip/requests?limit=50")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || data.error) return;
        setStatsRequests(data.requests ?? []);
      })
      .catch(() => {});
  }

  function loadHistory(p: number) {
    setHistoryLoading(true);
    fetch(`/api/vip/requests?offset=${p * PAGE_SIZE}&limit=${PAGE_SIZE}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || data.error) return;
        setHistoryRequests(data.requests ?? []);
        setHasMore(!!data.hasMore);
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadHistory(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
      loadStats();
      setPage(0);
      loadHistory(0);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  async function setStatus(id: string, status: "approved" | "dismissed") {
    setHistoryRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setStatsRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (latestDraft?.id === id) setLatestDraft((prev) => (prev ? { ...prev, status } : prev));
    await fetch(`/api/vip/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  }

  const approved = statsRequests.filter((r) => r.status === "approved").length;
  const awaitingReview = statsRequests.filter((r) => r.status === "ready").length;
  const dismissed = statsRequests.filter((r) => r.status === "dismissed").length;

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div className="flex items-center gap-3">
        <span
          className="w-11 h-11 rounded-full grid place-items-center flex-none"
          style={{ background: tokens.accentBg, color: tokens.accentText }}
        >
          <IconSparkle size={18} />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="m-0 text-[22px]" style={{ color: tokens.text }}>Teni AI</h3>
            <span className="tag text-[9px]" style={{ border: `1px solid ${tokens.text}`, color: tokens.text }}>VIP</span>
          </div>
          <div className="text-[13.5px] mt-1" style={{ color: tokens.textSecondary }}>
            Your AI assistant, built into Primue VIP. Say or type what you need — Teni drafts it, ready to review and send.
          </div>
        </div>
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Total requests", value: statsRequests.length },
          { label: "Approved", value: approved },
          { label: "Awaiting review", value: awaitingReview },
          { label: "Dismissed", value: dismissed },
        ].map((s) => (
          <div key={s.label} className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>{s.label}</span>
            <span className="text-[20px] font-medium" style={{ color: tokens.text }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3.5" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="flex flex-col gap-3.5">
          {/* Composer — a single soft-cornered box with the controls docked
              at the bottom edge, matching Claude's own chat input rather than
              a bordered form field with a separate button row. */}
          <div
            className="rounded-[26px] p-5"
            style={{ background: tokens.surface, border: `1px solid ${inputFocused ? tokens.text : tokens.border}`, transition: "border-color 120ms ease" }}
          >
            <textarea
              className="w-full bg-transparent outline-none resize-none text-[15px]"
              style={{ color: tokens.text, minHeight: 64, border: "none" }}
              placeholder="What do you need help with?"
              value={inputText}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChange={(e) => { setInputText(e.target.value); setInputSource("text"); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px]" style={{ color: tokens.textQuaternary }}>
                {speech.listening ? "● Listening… tap the mic to stop" : "Enter to send · Shift+Enter for a new line"}
              </span>
              <div className="flex items-center gap-2">
                {speech.supported && (
                  <button
                    onClick={speech.toggle}
                    aria-label={speech.listening ? "Stop recording" : "Record a voice note"}
                    className="w-9 h-9 rounded-full grid place-items-center flex-none cursor-pointer"
                    style={{ background: speech.listening ? tokens.accentBg : tokens.tint1, color: speech.listening ? tokens.accentText : tokens.textSecondary, border: "none" }}
                  >
                    <IconMic size={15} />
                  </button>
                )}
                <button
                  onClick={submit}
                  disabled={submitting || !inputText.trim()}
                  aria-label="Send to Teni"
                  className="w-9 h-9 rounded-full grid place-items-center flex-none cursor-pointer"
                  style={{ background: tokens.accentBg, color: tokens.accentText, border: "none", opacity: submitting || !inputText.trim() ? 0.45 : 1 }}
                >
                  <IconSend size={15} />
                </button>
              </div>
            </div>
            {!speech.supported && (
              <div className="text-[11px] mt-1.5" style={{ color: tokens.textQuaternary }}>
                Voice input isn&rsquo;t supported in this browser — Chrome or Edge works best. Typing works everywhere.
              </div>
            )}
            {submitError && <div className="text-[12px] mt-1.5" style={{ color: tokens.danger }}>{submitError}</div>}
          </div>

          {latestDraft?.ai_draft && (
            <div className="card elev-md gap-3 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.text}` }}>
              <div className="flex items-center gap-2">
                <IconSparkle size={14} />
                <span className="text-[13px] font-medium" style={{ color: tokens.text }}>{latestDraft.ai_draft.summary}</span>
              </div>
              {latestDraft.ai_draft.drafts.map((d, i) => (
                <div key={i} className="rounded-lg p-3" style={{ background: tokens.surfaceInset, border: `1px solid ${tokens.border}` }}>
                  <div className="text-[11px] uppercase tracking-[.08em] mb-1.5" style={{ color: tokens.textTertiary }}>{d.label}</div>
                  <div className="text-[13.5px] whitespace-pre-wrap" style={{ lineHeight: 1.7, color: tokens.text }}>{d.body}</div>
                </div>
              ))}
              {latestDraft.ai_draft.gaps && (
                <div className="text-[12px]" style={{ color: tokens.textSecondary }}>Note: {latestDraft.ai_draft.gaps}</div>
              )}
              {latestDraft.status === "ready" ? (
                <div className="flex gap-2">
                  <button className="btn text-[13px]" style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }} onClick={() => setStatus(latestDraft.id, "approved")}>
                    <IconCheckCircle size={13} /> Approved — I&rsquo;ll send it
                  </button>
                  <button className="btn text-[13px]" style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary }} onClick={() => setStatus(latestDraft.id, "dismissed")}>
                    <IconX size={13} /> Not this
                  </button>
                </div>
              ) : (
                <div className="text-[12px]" style={{ color: tokens.textTertiary }}>
                  {latestDraft.status === "approved" ? "Marked approved." : "Dismissed."}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="card elev-sm gap-2 p-4" style={{ background: tokens.surface, border: `1px dashed ${tokens.borderDashed}` }}>
            <div className="text-[12.5px] font-medium" style={{ color: tokens.text }}>What Teni does</div>
            <div className="text-[11.5px]" style={{ color: tokens.textTertiary, lineHeight: 1.6 }}>
              Teni turns a request into a ready draft — a reply, an invoice follow-up, a task list. It never sends,
              calls, or pays anyone on its own. You always review and send it yourself.
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium" style={{ color: tokens.textSecondary }}>Your requests</span>
              {statsRequests.length > 0 && (
                <span className="text-[11px]" style={{ color: tokens.textQuaternary }}>Page {page + 1}</span>
              )}
            </div>

            {!historyLoading && historyRequests.length === 0 && (
              <div className="text-[12.5px]" style={{ color: tokens.textQuaternary }}>No requests yet.</div>
            )}

            {historyRequests.map((r) => (
              <div key={r.id} className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] flex-1 truncate" style={{ color: tokens.text }}>{r.input_text}</span>
                  <span
                    className="tag text-[9.5px]"
                    style={{
                      border: `1px solid ${r.status === "approved" ? tokens.success : r.status === "error" ? tokens.danger : tokens.border}`,
                      color: r.status === "approved" ? tokens.success : r.status === "error" ? tokens.danger : tokens.textSecondary,
                    }}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="text-[11px]" style={{ color: tokens.textQuaternary }}>
                  {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  {r.input_source === "voice" && " · via voice"}
                </div>
              </div>
            ))}

            {(page > 0 || hasMore) && (
              <div className="flex items-center justify-between mt-1">
                <button
                  className="btn text-[12px]"
                  style={{ border: `1px solid ${tokens.border}`, color: page === 0 ? tokens.textQuaternary : tokens.textSecondary }}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || historyLoading}
                >
                  ← Prev
                </button>
                <button
                  className="btn text-[12px]"
                  style={{ border: `1px solid ${tokens.border}`, color: hasMore ? tokens.textSecondary : tokens.textQuaternary }}
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore || historyLoading}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
