"use client";

import { useEffect, useState } from "react";
import { IconSparkle } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

type DocumentRow = { id: string; title: string; status: "draft" | "sent" | "signed" | "void"; created_at: string };

const STATUS_TAG: Record<string, { label: string; tag: string; dot: string }> = {
  draft: { label: "Draft", tag: "tag-neutral", dot: "var(--color-neutral-600)" },
  sent: { label: "Sent", tag: "tag-outline", dot: "var(--color-accent)" },
};

function daysAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export default function SideStack() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [pending, setPending] = useState<DocumentRow[]>([]);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/documents")
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured || data.error) return;
        const docs: DocumentRow[] = (data.documents ?? []).filter((d: DocumentRow) => d.status === "draft" || d.status === "sent");
        setPending(docs);
        setLive(true);
      })
      .catch(() => {
        // Stay on the demo path on any failure.
      });
  }, [checked, hasSession]);

  const oldest = pending.length ? pending.reduce((a, b) => (new Date(a.created_at) < new Date(b.created_at) ? a : b)) : null;
  const oldestAge = oldest ? daysAgo(oldest.created_at) : 0;

  return (
    <div className="flex flex-col gap-3.5">
      <div
        className="card elev-sm p-[16px_18px] gap-2.5 border"
        style={{ borderColor: "color-mix(in srgb, var(--color-accent) 35%, transparent)" }}
      >
        <div className="flex items-center gap-2">
          <IconSparkle size={15} className="text-[var(--color-accent)]" />
          <div className="card-title text-sm">Primue AI</div>
          {live && oldest && <span className="card-meta ml-auto">1 suggestion</span>}
        </div>
        {live ? (
          oldest ? (
            <div
              className="text-[13.5px] leading-[1.5] text-[var(--color-neutral-300)] px-3 py-2.5 rounded-lg"
              style={{ background: "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" }}
            >
              &ldquo;{oldest.title}&rdquo; has been awaiting signature for {oldestAge} {oldestAge === 1 ? "day" : "days"}.
            </div>
          ) : (
            <div className="text-[13px] text-[var(--color-neutral-500)] px-1 py-1">
              No suggestions yet — insights show up here once there&rsquo;s some activity to look at.
            </div>
          )
        ) : (
          <div
            className="text-[13.5px] leading-[1.5] text-[var(--color-neutral-300)] px-3 py-2.5 rounded-lg"
            style={{ background: "color-mix(in srgb, var(--color-accent-900) 45%, transparent)" }}
          >
            Ask Primue AI to draft, review, or summarize anything in your workspace.
          </div>
        )}
        <a href="/assistant" className="btn btn-primary btn-block text-[13.5px] mt-0.5">Ask Primue AI</a>
      </div>

      <div className="card elev-sm p-[16px_18px] gap-2.5">
        <div className="flex items-baseline">
          <div className="card-title text-sm">Pending signatures</div>
          <span className="card-meta ml-auto">{live ? `${pending.length} open` : "3 open"}</span>
        </div>
        {live ? (
          pending.length ? (
            pending.slice(0, 3).map((d) => {
              const meta = STATUS_TAG[d.status] ?? STATUS_TAG.draft;
              return (
                <div key={d.id} className="flex items-center gap-2.5 text-[13.5px]">
                  <span className="w-[7px] h-[7px] rounded-full flex-none" style={{ background: meta.dot }} />
                  <span className="flex-1 truncate">{d.title}</span>
                  <span className={`tag ${meta.tag} text-[10px]`}>{meta.label}</span>
                </div>
              );
            })
          ) : (
            <div className="text-[13px] text-[var(--color-neutral-500)]">Nothing pending — every document is signed or void.</div>
          )
        ) : (
          <>
            <div className="flex items-center gap-2.5 text-[13.5px]">
              <span className="w-[7px] h-[7px] rounded-full flex-none" style={{ background: "var(--color-accent)" }} />
              <span className="flex-1">MSA · Halcyon Ventures</span>
              <span className="tag tag-outline text-[10px]">Sent</span>
            </div>
            <div className="flex items-center gap-2.5 text-[13.5px]">
              <span className="w-[7px] h-[7px] rounded-full flex-none" style={{ background: "var(--color-neutral-600)" }} />
              <span className="flex-1">NDA · Northbeam Co.</span>
              <span className="tag tag-neutral text-[10px]">Sent</span>
            </div>
            <div className="flex items-center gap-2.5 text-[13.5px]">
              <span className="w-[7px] h-[7px] rounded-full flex-none" style={{ background: "var(--color-neutral-600)" }} />
              <span className="flex-1">Offer letter · D. Osei</span>
              <span className="tag tag-neutral text-[10px]">Draft</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
