"use client";

import { useEffect, useRef, useState } from "react";
import { IconSparkle, IconCheckCircle, IconX, IconMic, IconSend, IconDocuments } from "@/components/icons";
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
const THREAD_SIZE = 20;

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

  // The actual chat thread — real past requests (oldest first, like any
  // message log) plus whatever gets sent this session, appended live.
  const [conversation, setConversation] = useState<VipRequest[]>([]);
  const [conversationLoaded, setConversationLoaded] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  // A wider, one-time fetch just to compute the stat row — separate from the
  // paginated history list below, since a page of 5 (or the thread's most
  // recent 20) can't tell you the total.
  const [statsRequests, setStatsRequests] = useState<VipRequest[]>([]);

  const [page, setPage] = useState(0);
  const [historyRequests, setHistoryRequests] = useState<VipRequest[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const speech = useSpeechInput((transcript) => {
    setInputSource("voice");
    setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  });

  // Which request's draft is open in the side preview — null means the
  // panel shows the default (What Teni does + history) view instead. A
  // fresh ready draft opens itself here automatically; picking an older
  // one from the thread or the history list does the same thing.
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  function loadStats() {
    fetch("/api/vip/requests?limit=50")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || data.error) return;
        setStatsRequests(data.requests ?? []);
      })
      .catch(() => {});
  }

  function loadConversation() {
    fetch(`/api/vip/requests?offset=0&limit=${THREAD_SIZE}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || data.error) return;
        // The API returns newest-first (for the paginated side list); a chat
        // thread reads top-to-bottom oldest-first, like any real message log.
        setConversation((data.requests ?? []).slice().reverse());
      })
      .catch(() => {})
      .finally(() => setConversationLoaded(true));
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
    loadConversation();
  }, []);

  useEffect(() => {
    loadHistory(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation.length]);

  async function submit() {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    const source = inputSource;
    const tempId = `pending-${Date.now()}`;

    // Optimistic — the "you" bubble and a drafting indicator appear the
    // instant you hit send, like any real chat, not only once the request
    // round-trips.
    setConversation((prev) => [
      ...prev,
      { id: tempId, input_text: text, input_source: source, ai_draft: null, status: "drafting", created_at: new Date().toISOString() },
    ]);
    setInputText("");
    setInputSource("text");
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/vip/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText: text, inputSource: source }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't draft that.");
      setConversation((prev) => prev.map((r) => (r.id === tempId ? data.request : r)));
      // Pops the preview open the moment a fresh draft is ready — the same
      // "just appeared" feel as Claude auto-opening a new artifact.
      if (data.request.status === "ready") setActivePreviewId(data.request.id);
      loadStats();
      setPage(0);
      loadHistory(0);
    } catch (err) {
      setConversation((prev) => prev.filter((r) => r.id !== tempId));
      setSubmitError(err instanceof Error ? err.message : "Couldn't reach the server.");
      setInputText(text);
    } finally {
      setSubmitting(false);
    }
  }

  async function setStatus(id: string, status: "approved" | "dismissed") {
    setConversation((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setHistoryRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setStatsRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/vip/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  }

  const approved = statsRequests.filter((r) => r.status === "approved").length;
  const awaitingReview = statsRequests.filter((r) => r.status === "ready").length;
  const dismissed = statsRequests.filter((r) => r.status === "dismissed").length;

  const activePreview =
    conversation.find((r) => r.id === activePreviewId) ?? historyRequests.find((r) => r.id === activePreviewId) ?? null;
  const previewDraft = activePreview?.ai_draft ?? null;

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div className="flex items-center gap-3">
        <span
          className="w-11 h-11 rounded-full grid place-items-center flex-none"
          style={{ background: tokens.accentYellow, color: tokens.accentColoredIconText }}
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

      <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-4">
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

      <div className="grid gap-3.5 grid-cols-1 md:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-3">
          {/* The actual chat thread — a scrollable message log, oldest at
              top, auto-scrolling to the newest exchange, with the composer
              docked below it like a real chat surface. */}
          <div
            ref={threadRef}
            className="flex flex-col gap-4 overflow-y-auto pr-1"
            style={{ maxHeight: 480, minHeight: 260 }}
          >
            {conversationLoaded && conversation.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-14 text-center" style={{ color: tokens.textQuaternary }}>
                <span style={{ color: tokens.textTertiary }}><IconSparkle size={22} /></span>
                <span className="text-[13px]" style={{ color: tokens.textTertiary }}>Your conversation will appear here</span>
                <span className="text-[11.5px] max-w-[280px]">Say or type something below and Teni&rsquo;s draft shows up right here — ready to review and send.</span>
              </div>
            )}

            {conversation.map((req) => (
              <div key={req.id} className="flex flex-col gap-2">
                {/* You */}
                <div className="flex justify-end">
                  <div className="rounded-2xl px-4 py-2.5" style={{ background: tokens.accentBg, color: tokens.accentText, maxWidth: "78%" }}>
                    <div className="text-[13.5px]" style={{ lineHeight: 1.5 }}>{req.input_text}</div>
                    {req.input_source === "voice" && (
                      <div className="text-[10px] mt-1" style={{ color: tokens.accentTextMuted }}>via voice</div>
                    )}
                  </div>
                </div>

                {/* Teni */}
                <div className="flex justify-start">
                  <div
                    className="rounded-2xl px-4 py-3 flex flex-col gap-2.5"
                    style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, maxWidth: "92%" }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ color: tokens.accentYellow }}><IconSparkle size={13} /></span>
                      <span className="text-[11.5px] font-medium" style={{ color: tokens.textTertiary }}>Teni</span>
                    </div>

                    {req.ai_draft ? (
                      <>
                        <div className="text-[13px] font-medium" style={{ color: tokens.text }}>{req.ai_draft.summary}</div>
                        <button
                          onClick={() => setActivePreviewId(req.id)}
                          className="flex items-center gap-1.5 self-start text-[12px] font-medium cursor-pointer"
                          style={{
                            background: activePreviewId === req.id ? tokens.tint1 : "transparent",
                            border: `1px solid ${activePreviewId === req.id ? tokens.borderStrong : tokens.border}`,
                            color: tokens.text,
                            borderRadius: 8,
                            padding: "5px 10px",
                          }}
                        >
                          <IconDocuments size={12} />
                          {req.ai_draft.drafts.length > 1 ? `${req.ai_draft.drafts.length} drafts` : req.ai_draft.drafts[0]?.label || "View draft"}
                          <span style={{ color: tokens.textQuaternary }}>→</span>
                        </button>
                        {req.status === "ready" ? (
                          <div className="flex gap-2">
                            <button className="btn text-[12.5px]" style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }} onClick={() => setStatus(req.id, "approved")}>
                              <IconCheckCircle size={12} /> Approved — I&rsquo;ll send it
                            </button>
                            <button className="btn text-[12.5px]" style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary }} onClick={() => setStatus(req.id, "dismissed")}>
                              <IconX size={12} /> Not this
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11.5px]" style={{ color: tokens.textTertiary }}>
                            {req.status === "approved" ? "Marked approved." : req.status === "dismissed" ? "Dismissed." : req.status}
                          </div>
                        )}
                      </>
                    ) : req.status === "error" ? (
                      <div className="text-[12.5px]" style={{ color: tokens.danger }}>Couldn&rsquo;t draft that one — try sending it again.</div>
                    ) : (
                      <div className="flex items-center gap-2" style={{ color: tokens.textTertiary }}>
                        <span className="vip-live-dot w-1.5 h-1.5 rounded-full" style={{ background: tokens.accentYellow }} />
                        <span className="text-[12.5px]">Teni is drafting…</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Composer — a single soft-cornered box with the controls docked
              at the bottom edge, matching Claude's own chat input, pinned
              below the thread like a real chat's message bar. */}
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
        </div>

        {activePreview && previewDraft ? (
          // The preview panel — pops open the moment a draft exists to show,
          // closes back to the default view below when there's nothing
          // active. The draft text itself renders in the same calm serif
          // (--font-chat) already used for the AI Assistant's replies on
          // /copilot, plain prose with no bubble background — that's what
          // makes it read as "written for you" rather than another UI card.
          <div className="flex flex-col gap-3 rounded-2xl p-1" style={{ border: `1px solid ${tokens.border}`, background: tokens.surface, maxHeight: 560 }}>
            <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-3" style={{ borderBottom: `1px solid ${tokens.border}` }}>
              <span className="w-7 h-7 rounded-full grid place-items-center flex-none" style={{ background: tokens.accentYellow, color: tokens.accentColoredIconText }}>
                <IconSparkle size={13} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate" style={{ color: tokens.text }}>{previewDraft.summary}</div>
                <div className="text-[10.5px]" style={{ color: tokens.textQuaternary }}>
                  {previewDraft.drafts.length > 1 ? `${previewDraft.drafts.length} drafts` : "Draft"} · Teni AI
                </div>
              </div>
              <button
                onClick={() => setActivePreviewId(null)}
                aria-label="Close preview"
                className="w-7 h-7 rounded-full grid place-items-center flex-none cursor-pointer"
                style={{ background: "transparent", border: "none", color: tokens.textTertiary }}
              >
                <IconX size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-1" style={{ maxHeight: 380 }}>
              {previewDraft.drafts.map((d, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  {previewDraft.drafts.length > 1 && (
                    <div className="text-[10.5px] uppercase tracking-[.08em]" style={{ color: tokens.textQuaternary }}>{d.label}</div>
                  )}
                  <div
                    className="whitespace-pre-wrap text-[15px]"
                    style={{ fontFamily: "var(--font-chat), Georgia, serif", lineHeight: 1.75, color: tokens.text }}
                  >
                    {d.body}
                  </div>
                </div>
              ))}
              {previewDraft.gaps && (
                <div className="text-[11.5px] pb-1" style={{ color: tokens.textSecondary }}>Note: {previewDraft.gaps}</div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-1">
              {activePreview.status === "ready" ? (
                <div className="flex gap-2">
                  <button className="btn text-[12.5px]" style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }} onClick={() => setStatus(activePreview.id, "approved")}>
                    <IconCheckCircle size={12} /> Approved — I&rsquo;ll send it
                  </button>
                  <button className="btn text-[12.5px]" style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary }} onClick={() => setStatus(activePreview.id, "dismissed")}>
                    <IconX size={12} /> Not this
                  </button>
                </div>
              ) : (
                <span className="text-[11.5px]" style={{ color: tokens.textTertiary }}>
                  {activePreview.status === "approved" ? "Marked approved." : activePreview.status === "dismissed" ? "Dismissed." : activePreview.status}
                </span>
              )}
            </div>
          </div>
        ) : (
        <div className="flex flex-col gap-3.5">
          <div className="card elev-sm gap-2 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
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
              <div
                key={r.id}
                className="card elev-sm gap-1.5 p-4"
                style={{
                  background: tokens.surface,
                  border: `1px solid ${tokens.border}`,
                  cursor: r.ai_draft ? "pointer" : "default",
                }}
                onClick={() => r.ai_draft && setActivePreviewId(r.id)}
              >
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
        )}
      </div>
    </div>
  );
}
