"use client";

import { useEffect, useRef, useState } from "react";
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
        if (!data.configured || data.error) return;
        setRequests(data.requests ?? []);
      })
      .catch(() => {});
  }

  useEffect(() => {
    load();
  }, []);

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

  return (
    <div className="flex flex-col gap-5 max-w-[720px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: "#fff" }}>Requests</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: "#a8a8a8" }}>
          Say or type what you need. Primue AI drafts it — ready for you to review and send.
        </div>
      </div>

      <div className="card elev-sm gap-3 p-5" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
        <textarea
          className="input text-[14px]"
          style={{ background: "#0a0a0a", color: "#f5f5f5", border: "1px solid rgba(255,255,255,0.14)", minHeight: 90 }}
          placeholder="e.g. Reply to Sarah at Northbeam — tell her the invoice is 6 days overdue, keep it friendly but firm."
          value={inputText}
          onChange={(e) => { setInputText(e.target.value); setInputSource("text"); }}
        />
        <div className="flex items-center gap-2.5 flex-wrap">
          {speech.supported && (
            <button
              className="btn text-[13px]"
              style={{ border: `1px solid ${speech.listening ? "#fff" : "rgba(255,255,255,0.14)"}`, color: speech.listening ? "#fff" : "#a8a8a8" }}
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
          <div className="text-[11px]" style={{ color: "#6b6b6b" }}>
            Voice input isn&rsquo;t supported in this browser — Chrome or Edge works best. Typing works everywhere.
          </div>
        )}
        {submitError && <div className="text-[12px]" style={{ color: "#ff8a8a" }}>{submitError}</div>}
      </div>

      {latestDraft?.ai_draft && (
        <div className="card elev-md gap-3 p-5" style={{ background: "#161616", border: "1px solid #fff" }}>
          <div className="flex items-center gap-2">
            <IconSparkle size={14} />
            <span className="text-[13px] font-medium" style={{ color: "#fff" }}>{latestDraft.ai_draft.summary}</span>
          </div>
          {latestDraft.ai_draft.drafts.map((d, i) => (
            <div key={i} className="rounded-lg p-3" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.14)" }}>
              <div className="text-[11px] uppercase tracking-[.08em] mb-1.5" style={{ color: "#8a8a8a" }}>{d.label}</div>
              <div className="text-[13.5px] whitespace-pre-wrap" style={{ lineHeight: 1.7, color: "#f5f5f5" }}>{d.body}</div>
            </div>
          ))}
          {latestDraft.ai_draft.gaps && (
            <div className="text-[12px]" style={{ color: "#a8a8a8" }}>Note: {latestDraft.ai_draft.gaps}</div>
          )}
          <div className="flex gap-2">
            <button className="btn text-[13px]" style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff" }} onClick={() => setStatus(latestDraft.id, "approved")}>
              <IconCheckCircle size={13} /> Approved — I&rsquo;ll send it
            </button>
            <button className="btn text-[13px]" style={{ border: "1px solid rgba(255,255,255,0.14)", color: "#a8a8a8" }} onClick={() => setStatus(latestDraft.id, "dismissed")}>
              <IconX size={13} /> Not this
            </button>
          </div>
        </div>
      )}

      {requests.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="text-[13px] font-medium" style={{ color: "#a8a8a8" }}>Your requests</div>
          {requests.map((r) => (
            <div key={r.id} className="card elev-sm gap-1.5 p-4" style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.14)" }}>
              <div className="flex items-center gap-2">
                <span className="text-[13px] flex-1 truncate" style={{ color: "#f5f5f5" }}>{r.input_text}</span>
                <span
                  className="tag text-[9.5px]"
                  style={{
                    border: `1px solid ${r.status === "approved" ? "#8fd6a8" : r.status === "error" ? "#ff8a8a" : "rgba(255,255,255,0.14)"}`,
                    color: r.status === "approved" ? "#8fd6a8" : r.status === "error" ? "#ff8a8a" : "#a8a8a8",
                  }}
                >
                  {r.status}
                </span>
              </div>
              <div className="text-[11px]" style={{ color: "#6b6b6b" }}>
                {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                {r.input_source === "voice" && " · via voice"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
