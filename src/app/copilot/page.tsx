"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconSparkle, IconSend, IconDocuments } from "@/components/icons";

type Recommendation = { label: string; documentPrompt: string };
type Message = { role: "user" | "ai"; text: string; recommendation?: Recommendation | null };

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
      setMessages((prev) => [...prev, { role: "ai", text: data.reply, recommendation: data.recommendation }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: err instanceof Error ? `Couldn't reach the assistant: ${err.message}` : "Couldn't reach the assistant." },
      ]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className="flex min-h-screen md:h-screen bg-[var(--color-bg)] md:overflow-hidden">
      <Sidebar active="AI Assistant" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <div className="flex-1 flex flex-col min-h-0 max-w-[720px] w-full mx-auto">
          <div className="flex items-center gap-2 px-5 pt-16 md:pt-6 pb-4 border-b border-[var(--color-divider)]">
            <IconSparkle size={17} className="text-[var(--color-accent)]" />
            <div>
              <div className="card-title text-[15px]">Primue AI Assistant</div>
              <div className="text-[11.5px] text-[var(--color-neutral-500)]">
                Advice on what to use, not the drafting itself —{" "}
                <a href="/assistant" style={{ color: "var(--color-accent-300)" }}>go straight to the Document AI →</a>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div
                  key={i}
                  className="self-end max-w-[80%] text-[13.5px] leading-[1.55] px-4 py-2.5 rounded-2xl"
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
                      className="btn btn-primary text-[12.5px] self-start"
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
              <div className="self-start text-[12px] px-4 py-2.5 rounded-xl" style={{ color: "var(--color-neutral-500)", border: "1px solid var(--color-divider)" }}>
                The AI Assistant isn&rsquo;t connected yet — an Anthropic API key needs to be configured. You can still{" "}
                <a href="/assistant" style={{ color: "var(--color-accent-300)" }}>go straight to the Document AI</a> and describe what you need directly.
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

          <div className="p-4 pb-6 md:pb-4 flex gap-2">
            <input
              className="input flex-1"
              placeholder="Tell the assistant what you're trying to do…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(value)}
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
