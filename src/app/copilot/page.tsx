"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconSparkle, IconSend, IconDocuments, IconHistory, IconPlus, IconThumbUp, IconThumbDown, IconX } from "@/components/icons";

type Recommendation = { label: string; documentPrompt: string };
type Message = { role: "user" | "ai"; text: string; recommendation?: Recommendation | null };
type ConversationSummary = { id: string; title: string; rating: boolean | null; updated_at: string };

const starterPrompts = [
  "I'm renting out a flat — what do I need?",
  "A client wants to pay a deposit before I start work",
  "I'm selling a piece of land, what should I use?",
  "I need to hire someone and want it official",
];

const initialMessages: Message[] = [
  {
    role: "ai",
    text: "I'm the Primue AI Assistant — tell me what you're trying to get done, and I'll help you figure out the right way to do it here, then hand you off to draft it. What's going on?",
  },
];

export default function CopilotPage() {
  const { hasSession, checked } = useHasSession();
  const [tenantName, setTenantName] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [thinking, setThinking] = useState(false);
  const [value, setValue] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [rating, setRating] = useState<boolean | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<ConversationSummary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const hasRecommendation = messages.some((m) => m.recommendation);

  // Grows with content up to maxHeight (then scrolls internally), same feel
  // as Claude's own composer — a single fixed-height line for a short
  // message, more room without leaving the page the moment someone pastes a
  // paragraph.
  function autosize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenantName) setTenantName(data.tenantName);
      })
      .catch(() => {});
  }, [checked, hasSession]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(next);
    setValue("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setThinking(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, text: m.text })), tenantName }),
      });
      const data = await res.json();
      if (data.configured === false) {
        setUnavailable(true);
        setThinking(false);
        return;
      }
      if (!res.ok || data.error) throw new Error(data.error || "Something went wrong.");
      const withReply: Message[] = [...next, { role: "ai", text: data.reply, recommendation: data.recommendation }];
      setMessages(withReply);
      saveConversation(withReply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: err instanceof Error ? `Couldn't reach the assistant: ${err.message}` : "Couldn't reach the assistant." },
      ]);
    } finally {
      setThinking(false);
    }
  }

  // Auto-save on every AI reply rather than a manual "save" action — a
  // conversation someone forgot to save is worse than one nobody asked to
  // save. The first save creates the row and remembers its id; every save
  // after that updates the same row instead of creating a new one each time.
  async function saveConversation(fullMessages: Message[]) {
    if (!checked || !isBackendConfigured || !hasSession) return;
    try {
      const res = await fetch("/api/copilot/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: conversationId, messages: fullMessages }),
      });
      const data = await res.json();
      if (data.configured && data.saved && data.id) setConversationId(data.id);
    } catch {
      // Best-effort — the conversation still works fine in this tab either way.
    }
  }

  function startNewChat() {
    setMessages(initialMessages);
    setConversationId(null);
    setRating(null);
    setHistoryOpen(false);
  }

  async function loadHistory() {
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/copilot/conversations");
      const data = await res.json();
      if (data.configured && data.conversations) setHistory(data.conversations);
    } catch {
      // History just stays empty — the current conversation is unaffected.
    } finally {
      setHistoryLoading(false);
    }
  }

  async function openConversation(id: string) {
    try {
      const res = await fetch(`/api/copilot/conversations/${id}`);
      const data = await res.json();
      if (data.configured && data.conversation) {
        setMessages(data.conversation.messages.length ? data.conversation.messages : initialMessages);
        setConversationId(data.conversation.id);
        setRating(data.conversation.rating);
      }
    } catch {
      // Leave the current conversation showing rather than clearing it on a failed load.
    } finally {
      setHistoryOpen(false);
    }
  }

  async function rate(value: boolean) {
    const next = rating === value ? null : value;
    setRating(next);
    if (!conversationId) return;
    fetch(`/api/copilot/conversations/${conversationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: next }),
    }).catch(() => {});
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div className="flex min-h-screen md:h-screen bg-[var(--color-bg)] md:overflow-hidden">
      <Sidebar active="AI Assistant" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <div className="flex-1 flex flex-col min-h-0 max-w-[720px] w-full mx-auto">
          <div className="flex items-center gap-2 px-5 pt-16 md:pt-6 pb-4 border-b border-[var(--color-divider)]">
            <IconSparkle size={17} className="text-[var(--color-accent)]" />
            <div className="flex-1 min-w-0">
              <div className="card-title text-[15px]">Primue AI Assistant</div>
              <div className="text-[12.5px] text-[var(--color-neutral-500)]">
                Advice on what to use, not the drafting itself —{" "}
                <a href="/assistant" style={{ color: "var(--color-accent-300)" }}>go straight to the Document AI →</a>
              </div>
            </div>
            <button className="btn btn-icon btn-secondary flex-none" aria-label="New chat" title="New chat" onClick={startNewChat}>
              <IconPlus size={14} />
            </button>
            <div className="relative flex-none">
              <button className="btn btn-icon btn-secondary" aria-label="Conversation history" title="Conversation history" onClick={loadHistory}>
                <IconHistory size={14} />
              </button>
              {historyOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+6px)] w-[280px] max-h-[360px] overflow-y-auto rounded-lg border p-1.5 flex flex-col gap-0.5 z-30"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)", boxShadow: "var(--shadow-md)" }}
                >
                  <div className="flex items-center px-2.5 py-1.5">
                    <span className="text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-500)] flex-1">Previous chats</span>
                    <button className="btn btn-icon btn-ghost" aria-label="Close" style={{ width: 22, height: 22 }} onClick={() => setHistoryOpen(false)}>
                      <IconX size={12} />
                    </button>
                  </div>
                  {historyLoading ? (
                    <div className="px-2.5 py-4 text-[12.5px] text-[var(--color-neutral-500)] text-center">Loading…</div>
                  ) : history.length === 0 ? (
                    <div className="px-2.5 py-4 text-[12.5px] text-[var(--color-neutral-500)] text-center">
                      No previous conversations yet.
                    </div>
                  ) : (
                    history.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => openConversation(c.id)}
                        className="flex items-center gap-2 px-2.5 py-[9px] rounded-md text-[13px] text-left cursor-pointer hover:bg-[var(--color-surface)] transition-colors"
                        style={{ color: c.id === conversationId ? "var(--color-accent-300)" : "var(--color-text)" }}
                      >
                        <span className="flex-1 truncate">{c.title}</span>
                        {c.rating === true && <IconThumbUp size={11} className="flex-none text-[var(--color-accent-300)]" />}
                        {c.rating === false && <IconThumbDown size={11} className="flex-none text-[var(--color-neutral-500)]" />}
                        <span className="text-[10.5px] text-[var(--color-neutral-500)] flex-none">{timeAgo(c.updated_at)}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div
                  key={i}
                  className="self-end max-w-[80%] text-[14.5px] leading-[1.55] px-4 py-2.5 rounded-2xl"
                  style={{ background: "var(--color-surface)" }}
                >
                  {m.text}
                </div>
              ) : (
                // No bubble background here on purpose — the assistant's reply
                // reads as plain prose on the page, the same register a
                // calm chat interface uses instead of a dense colour block.
                // The serif face and wider line-height are what actually do
                // the work of feeling "written", not the container.
                <div key={i} className="self-start max-w-[92%] flex flex-col gap-2.5">
                  <div
                    className="text-[15px] leading-[1.75] text-[var(--color-text)]"
                    style={{ fontFamily: "var(--font-chat), Georgia, serif" }}
                  >
                    {m.text}
                  </div>
                  {m.recommendation && (
                    <a
                      href={`/assistant?prompt=${encodeURIComponent(m.recommendation.documentPrompt)}`}
                      className="btn btn-primary text-[13.5px] self-start"
                    >
                      <IconDocuments size={13} />
                      {m.recommendation.label}
                    </a>
                  )}
                </div>
              )
            )}
            {thinking && (
              <div className="self-start text-[var(--color-neutral-500)]">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
                </span>
              </div>
            )}
            {unavailable && (
              <div className="self-start text-[13px] px-4 py-2.5 rounded-xl" style={{ color: "var(--color-neutral-500)", border: "1px solid var(--color-divider)" }}>
                The AI Assistant isn&rsquo;t connected yet — an Anthropic API key needs to be configured. You can still{" "}
                <a href="/assistant" style={{ color: "var(--color-accent-300)" }}>go straight to the Document AI</a> and describe what you need directly.
              </div>
            )}
            {hasRecommendation && !thinking && (
              <div className="self-start flex items-center gap-2 text-[12px] text-[var(--color-neutral-500)]">
                Was this a good recommendation?
                <button
                  className="btn btn-icon btn-secondary"
                  style={{ width: 26, height: 26, ...(rating === true ? { borderColor: "var(--color-accent)", color: "var(--color-accent-300)" } : {}) }}
                  aria-label="Good recommendation"
                  onClick={() => rate(true)}
                >
                  <IconThumbUp size={12} />
                </button>
                <button
                  className="btn btn-icon btn-secondary"
                  style={{ width: 26, height: 26, ...(rating === false ? { borderColor: "var(--color-accent)", color: "var(--color-accent-300)" } : {}) }}
                  aria-label="Not a good recommendation"
                  onClick={() => rate(false)}
                >
                  <IconThumbDown size={12} />
                </button>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-5 pb-2 flex flex-wrap gap-1.5">
              {starterPrompts.map((s) => (
                <button key={s} onClick={() => send(s)} className="tag tag-neutral cursor-pointer hover:opacity-80 transition-opacity">
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 pb-6 md:pb-4 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              rows={1}
              className="input flex-1 resize-none"
              style={{ maxHeight: 160, overflowY: "auto" }}
              placeholder="Tell the assistant what you're trying to do…"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                autosize(e.target);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(value);
                }
              }}
              disabled={unavailable}
            />
            <button className="btn btn-primary btn-icon" aria-label="Send" onClick={() => send(value)} disabled={unavailable}>
              <IconSend size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
