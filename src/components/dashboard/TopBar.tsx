"use client";

import { useEffect, useState } from "react";
import { IconSearch, IconPlus, IconBell, IconMessages } from "@/components/icons";

export default function TopBar() {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    setAvatar(localStorage.getItem("origin-avatar"));
    const onUpdate = () => setAvatar(localStorage.getItem("origin-avatar"));
    window.addEventListener("origin-avatar-updated", onUpdate);
    return () => window.removeEventListener("origin-avatar-updated", onUpdate);
  }, []);

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
      <button className="btn btn-primary text-[13px] flex-none">
        <IconPlus size={14} />
        <span className="hidden sm:inline">Quick create</span>
      </button>
      <button className="btn btn-icon btn-secondary relative flex-none" aria-label="Notifications">
        <IconBell size={16} />
        <span
          className="absolute top-[7px] right-2 w-[7px] h-[7px] rounded-full"
          style={{ background: "var(--color-accent)", boxShadow: "0 0 6px var(--color-accent)" }}
        />
      </button>
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
