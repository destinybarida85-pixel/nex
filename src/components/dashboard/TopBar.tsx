"use client";

import { useEffect, useRef, useState } from "react";
import { IconSearch, IconPlus, IconBell, IconMessages, IconSparkle, IconClients, IconEmployees, IconLink, IconESign, IconWallet } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

const quickCreateItems = [
  { label: "New document", icon: IconSparkle, href: "/assistant" },
  { label: "New deal", icon: IconClients, href: "/crm" },
  { label: "New employee", icon: IconEmployees, href: "/employees" },
  { label: "New payment link", icon: IconLink, href: "/payments" },
];

type Notification = { id: string; kind: string; title: string; body: string | null; read_at: string | null; created_at: string };

const kindIcon: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  document_signed: IconESign,
  payment_received: IconWallet,
  invite_accepted: IconClients,
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function TopBar() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { hasSession, checked } = useHasSession();

  useEffect(() => {
    setAvatar(localStorage.getItem("origin-avatar"));
    const onUpdate = () => setAvatar(localStorage.getItem("origin-avatar"));
    window.addEventListener("origin-avatar-updated", onUpdate);
    return () => window.removeEventListener("origin-avatar-updated", onUpdate);
  }, []);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    function load() {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((data) => {
          if (data.configured && data.notifications) setNotifications(data.notifications);
        })
        .catch(() => {});
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [checked, hasSession]);

  useEffect(() => {
    if (!quickCreateOpen && !notifOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (quickCreateOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) setQuickCreateOpen(false);
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [quickCreateOpen, notifOpen]);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  async function openNotifications() {
    setNotifOpen((v) => !v);
    if (unreadCount > 0) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
      fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => {});
    }
  }

  return (
    <header className="flex items-center gap-2 sm:gap-3.5 pl-16 pr-3 py-3 sm:px-7 border-b border-[var(--color-divider)]">
      <div className="flex items-center gap-2.5 flex-1 min-w-0 md:flex-none md:w-[340px] px-3 py-[7px] bg-[var(--color-surface)] border border-[var(--color-divider)] rounded-lg text-[var(--color-neutral-500)] text-[13px] cursor-text hover:border-[var(--color-neutral-600)] transition-colors">
        <IconSearch size={14} className="flex-none" />
        <span className="flex-1 hidden sm:inline truncate">Search or run a command…</span>
        <kbd className="hidden md:inline font-mono text-[10.5px] font-medium px-1.5 py-0.5 border border-[var(--color-divider)] rounded-[5px] text-[var(--color-neutral-500)]">
          ⌘K
        </kbd>
      </div>
      <div className="flex-1 hidden md:block" />
      <div className="relative flex-none" ref={menuRef}>
        <button className="btn btn-primary text-[13px] flex-none" onClick={() => setQuickCreateOpen((v) => !v)}>
          <IconPlus size={14} />
          <span className="hidden sm:inline">Quick create</span>
        </button>
        {quickCreateOpen && (
          <div
            className="absolute right-0 top-[calc(100%+6px)] w-[200px] rounded-lg border p-1.5 flex flex-col gap-0.5 z-30"
            style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)", boxShadow: "var(--shadow-md)" }}
          >
            {quickCreateItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] no-underline text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                onClick={() => setQuickCreateOpen(false)}
              >
                <item.icon size={14} className="text-[var(--color-accent)]" />
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="relative flex-none" ref={notifRef}>
        <button className="btn btn-icon btn-secondary relative flex-none" aria-label="Notifications" onClick={openNotifications}>
          <IconBell size={16} />
          {unreadCount > 0 && (
            <span
              className="absolute top-[7px] right-2 w-[7px] h-[7px] rounded-full"
              style={{ background: "var(--color-accent)", boxShadow: "0 0 6px var(--color-accent)" }}
            />
          )}
        </button>
        {notifOpen && (
          <div
            className="absolute right-0 top-[calc(100%+6px)] w-[300px] max-h-[360px] overflow-y-auto rounded-lg border p-1.5 flex flex-col gap-0.5 z-30"
            style={{ background: "var(--color-bg)", borderColor: "var(--color-divider)", boxShadow: "var(--shadow-md)" }}
          >
            <div className="px-2.5 py-1.5 text-[11px] tracking-[.06em] uppercase text-[var(--color-neutral-500)]">Notifications</div>
            {notifications.length === 0 ? (
              <div className="px-2.5 py-4 text-[12.5px] text-[var(--color-neutral-500)] text-center">
                Nothing yet — you&rsquo;ll see updates here when a document is signed or a payment comes in.
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = kindIcon[n.kind] || IconBell;
                return (
                  <div key={n.id} className="flex items-start gap-2.5 px-2.5 py-2 rounded-md text-[12.5px]">
                    <Icon size={14} className="text-[var(--color-accent)] flex-none mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[var(--color-text)]">{n.title}</div>
                      {n.body && <div className="text-[11.5px] text-[var(--color-neutral-500)] truncate">{n.body}</div>}
                      <div className="text-[10.5px] text-[var(--color-neutral-600)] mt-0.5">{timeAgo(n.created_at)}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <div className="hidden sm:block flex-none">
        <button className="btn btn-icon btn-secondary" aria-label="Messages">
          <IconMessages size={16} />
        </button>
      </div>
      <a
        href="/profile"
        className="w-8 h-8 rounded-full grid place-items-center text-xs font-medium cursor-pointer flex-none overflow-hidden no-underline"
        style={
          avatar
            ? { backgroundImage: `url(${avatar})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: "linear-gradient(135deg, var(--color-accent-2-600), var(--color-accent-900))", color: "var(--color-accent-100)" }
        }
      >
        {!avatar && "AO"}
      </a>
    </header>
  );
}
