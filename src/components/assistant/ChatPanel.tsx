"use client";

import { useState } from "react";
import { IconSparkle, IconSend } from "@/components/icons";

export type ChatMessage = { role: "user" | "ai"; text: string };

const suggestions = ["Draft an NDA", "Write an invoice", "Draft an offer letter", "Summarize this contract"];

export default function ChatPanel({
  messages,
  thinking,
  onSend,
}: {
  messages: ChatMessage[];
  thinking: boolean;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  function submit() {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  }

  return (
    <div className="w-full h-[70vh] md:h-auto md:w-[380px] flex-none flex flex-col border-b md:border-b-0 md:border-r border-[var(--color-divider)] min-h-0">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-divider)]">
        <IconSparkle size={16} className="text-[var(--color-accent)]" />
        <div className="card-title text-[15px]">Nex AI</div>
        <span className="tag tag-accent ml-auto text-[9.5px]">Online</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="self-end max-w-[85%] text-[13px] leading-[1.5] px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)]">
              {m.text}
            </div>
          ) : (
            <div
              key={i}
              className="self-start max-w-[90%] text-[13px] leading-[1.55] text-[var(--color-neutral-300)] px-3.5 py-2.5 rounded-xl"
              style={{ background: "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" }}
            >
              {m.text}
            </div>
          )
        )}
        {thinking && (
          <div
            className="self-start text-[13px] px-3.5 py-2.5 rounded-xl text-[var(--color-neutral-400)]"
            style={{ background: "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" }}
          >
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
            </span>
          </div>
        )}
      </div>

      <div className="px-5 pb-3 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSend(s)}
            className="tag tag-neutral cursor-pointer hover:opacity-80 transition-opacity"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="p-4 pt-0 flex gap-2">
        <input
          className="input flex-1"
          placeholder="Ask Nex AI to draft, summarize, or analyze…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button className="btn btn-primary btn-icon" aria-label="Send" onClick={submit}>
          <IconSend size={15} />
        </button>
      </div>
    </div>
  );
}
