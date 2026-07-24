"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { IconPlus, IconArrowRight } from "@/components/icons";

type Member = { id: string; full_name: string | null; role: string; created_at: string };
type PendingInvite = { id: string; email: string; role: string; created_at: string };

export default function SettingsPage() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [tenantName, setTenantName] = useState("My Business");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenant?.name) {
          setLive(true);
          setTenantName(data.tenant.name);
        }
      })
      .catch(() => {});
    loadTeam();
  }, [checked, hasSession]);

  function loadTeam() {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          if (data.members) setMembers(data.members);
          if (data.invites) setInvites(data.invites);
        }
      })
      .catch(() => {});
  }

  async function saveName() {
    if (!live) return;
    setSavingName(true);
    const res = await fetch("/api/tenant", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tenantName }),
    });
    setSavingName(false);
    if (res.ok) {
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 1800);
    }
  }

  async function sendInvite() {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      setInviteError("Enter a valid email.");
      return;
    }
    setInviting(true);
    setInviteError("");
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setInviteError(data.error || "Couldn't send that invite.");
      setInviting(false);
      return;
    }
    setInvites((prev) => [{ id: data.invite.id, email: data.invite.email, role: data.invite.role, created_at: data.invite.created_at }, ...prev]);
    setInviteEmail("");
    setInviting(false);
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Settings" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0 max-w-[720px]">
          <div>
            <h3 className="m-0 text-[22px]">Settings</h3>
            <div className="text-muted text-[12.5px] mt-[3px]">Your business, your team, and how Origin is set up.</div>
          </div>

          <div className="card elev-sm p-5 gap-3.5">
            <div className="card-title text-sm">Business</div>
            <div className="field">
              <label>Business name</label>
              <input className="input" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
            </div>
            <button className="btn btn-primary text-[12.5px] self-start" onClick={saveName} disabled={savingName || !live}>
              {nameSaved ? "Saved!" : savingName ? "Saving…" : "Save changes"}
            </button>
            {!live && <div className="text-[11.5px] text-[var(--color-neutral-500)]">Sign in to save this for real.</div>}
          </div>

          <div className="card elev-sm p-5 gap-3.5">
            <div className="flex items-center gap-2">
              <div className="card-title text-sm">Team</div>
              <span className="tag tag-neutral ml-auto text-[10px]">{members.length} {members.length === 1 ? "member" : "members"}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: "var(--color-surface)" }}>
                  <span className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-medium flex-none" style={{ background: "var(--color-accent-900)", color: "var(--color-accent-300)" }}>
                    {(m.full_name || "?").charAt(0).toUpperCase()}
                  </span>
                  <span className="text-[13px] flex-1 truncate">{m.full_name || "Unnamed"}</span>
                  <span className="tag tag-outline text-[9.5px]">{m.role}</span>
                </div>
              ))}
              {invites.map((i) => (
                <div key={i.id} className="flex items-center gap-2.5 p-2 rounded-lg border border-dashed" style={{ borderColor: "var(--color-divider)" }}>
                  <span className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-medium flex-none text-[var(--color-neutral-500)]" style={{ background: "var(--color-surface)" }}>
                    …
                  </span>
                  <span className="text-[13px] flex-1 truncate text-[var(--color-neutral-400)]">{i.email}</span>
                  <span className="tag tag-neutral text-[9.5px]">Pending · {i.role}</span>
                </div>
              ))}
              {members.length === 0 && invites.length === 0 && (
                <div className="text-[12.5px] text-[var(--color-neutral-500)]">
                  {live ? "Just you, for now." : "Sign in to see and invite your team."}
                </div>
              )}
            </div>

            <div className="flex gap-1.5 pt-1">
              <input
                className="input text-[12.5px] flex-1"
                placeholder="teammate@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <select className="input text-[12.5px] w-[100px] flex-none" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as "member" | "admin")}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <button className="btn btn-primary text-[12.5px] flex-none" onClick={sendInvite} disabled={inviting || !live}>
                <IconPlus size={13} />
                Invite
              </button>
            </div>
            {inviteError && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{inviteError}</div>}
            {live && invites.length > 0 && (
              <div className="text-[11px] text-[var(--color-neutral-500)] leading-[1.6]">
                No email is sent automatically yet — share your signup link with them directly. When they sign up with the invited email, they&rsquo;ll join this business instead of starting a new one.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <a href="/profile" className="card elev-sm p-4 gap-1 no-underline text-[var(--color-text)] hover:border-[var(--color-neutral-600)] transition-colors">
              <div className="card-title text-sm flex items-center gap-2">Profile &amp; avatar <IconArrowRight size={12} className="ml-auto text-[var(--color-neutral-500)]" /></div>
              <div className="text-[12px] text-[var(--color-neutral-500)]">Your name, photo, and personal preferences.</div>
            </a>
            <a href="/billing" className="card elev-sm p-4 gap-1 no-underline text-[var(--color-text)] hover:border-[var(--color-neutral-600)] transition-colors">
              <div className="card-title text-sm flex items-center gap-2">Billing <IconArrowRight size={12} className="ml-auto text-[var(--color-neutral-500)]" /></div>
              <div className="text-[12px] text-[var(--color-neutral-500)]">Plan, payment method, and invoices.</div>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
