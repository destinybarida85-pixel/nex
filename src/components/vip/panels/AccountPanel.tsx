"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCamera, IconCheckCircle } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { useVipTheme } from "@/components/vip/theme";

const PLAN_LABEL: Record<string, string> = {
  none: "No plan",
  starter: "Starter",
  growth: "Growth",
  vip: "VIP",
};

export default function AccountPanel() {
  const { tokens } = useVipTheme();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [signingOut, setSigningOut] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [plan, setPlan] = useState("none");
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && !data.error) {
          setName(data.fullName || "");
          setEmail(data.email || "");
          setAvatarUrl(data.avatarUrl || null);
          setCreatedAt(data.createdAt || null);
        }
      })
      .catch(() => {});
    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && data.tenant) {
          setPlan(data.tenant.plan ?? "none");
          setSubStatus(data.tenant.subscription_status ?? null);
        }
      })
      .catch(() => {});
  }, []);

  async function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProfileError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Upload failed.");
      const res2 = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: data.url }),
      });
      const data2 = await res2.json();
      if (!res2.ok || data2.error) throw new Error(data2.error || "Couldn't save your photo.");
      setAvatarUrl(data2.avatarUrl);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Couldn't upload that photo.");
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile() {
    setSavingProfile(true);
    setProfileError("");
    setProfileSaved(false);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Couldn't save that.");
      setProfileSaved(true);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Couldn't reach the server.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword() {
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    setChangingPassword(true);
    setPasswordError("");
    setPasswordSaved(false);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      setPasswordSaved(true);
      setNewPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Couldn't change your password.");
    } finally {
      setChangingPassword(false);
    }
  }

  async function openBillingPortal() {
    setPortalLoading(true);
    setPortalError("");
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setPortalError(err instanceof Error ? err.message : "Couldn't open billing.");
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/vip/login");
    }
  }

  const initials = name.trim() ? name.trim().slice(0, 2).toUpperCase() : "?";

  return (
    <div className="flex flex-col gap-4 max-w-[1080px]">
      <div>
        <h3 className="m-0 text-[22px]" style={{ color: tokens.text }}>Account</h3>
        <div className="text-[13.5px] mt-1.5" style={{ color: tokens.textSecondary }}>Your profile, security, and subscription.</div>
      </div>

      <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-3">
        <div className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>Plan</span>
          <span className="text-[16px] font-medium" style={{ color: tokens.text }}>{PLAN_LABEL[plan] ?? plan}</span>
        </div>
        <div className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>Status</span>
          <span className="text-[16px] font-medium capitalize" style={{ color: tokens.text }}>{subStatus || "—"}</span>
        </div>
        <div className="card elev-sm gap-1.5 p-4" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <span className="text-[11px] tracking-[.06em] uppercase" style={{ color: tokens.textQuaternary }}>Member since</span>
          <span className="text-[16px] font-medium" style={{ color: tokens.text }}>
            {createdAt ? new Date(createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "—"}
          </span>
        </div>
      </div>

      <div className="grid gap-3.5 grid-cols-1 md:grid-cols-[1.6fr_1fr]">
        <div className="card elev-sm gap-3.5 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
          <div className="text-[13.5px] font-medium" style={{ color: tokens.text }}>Profile</div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full grid place-items-center text-[16px] font-medium overflow-hidden"
                style={avatarUrl ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: tokens.avatarFallbackBg, color: tokens.avatarFallbackText }}
              >
                {!avatarUrl && initials}
              </div>
              <button
                className="absolute -bottom-1 -right-1 btn btn-icon"
                style={{ width: 26, height: 26, background: tokens.bg, border: `1px solid ${tokens.text}`, color: tokens.text }}
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                aria-label="Upload avatar"
              >
                <IconCamera size={12} />
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={handleAvatarFile} />
            </div>
            <div className="flex-1 flex flex-col gap-2.5">
              <input
                className="input text-[14px]"
                style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
              <input className="input text-[13px]" style={{ background: tokens.surfaceInset, color: tokens.textQuaternary, border: `1px solid ${tokens.border}` }} value={email} disabled />
            </div>
          </div>
          {profileError && <div className="text-[12px]" style={{ color: tokens.danger }}>{profileError}</div>}
          {profileSaved && !profileError && <div className="text-[12px] flex items-center gap-1.5" style={{ color: tokens.success }}><IconCheckCircle size={12} /> Saved</div>}
          <button className="btn text-[13px] self-start" style={{ background: tokens.accentBg, color: tokens.accentText, border: `1px solid ${tokens.accentBg}` }} onClick={saveProfile} disabled={savingProfile}>
            {savingProfile ? "Saving…" : "Save"}
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="card elev-sm gap-3.5 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <div className="text-[13.5px] font-medium" style={{ color: tokens.text }}>Security</div>
            <div className="field">
              <label style={{ fontSize: 12, fontWeight: 600, color: tokens.textTertiary }}>New password</label>
              <input
                className="input text-[14px]"
                style={{ background: tokens.surfaceInset, color: tokens.text, border: `1px solid ${tokens.border}` }}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
            {passwordError && <div className="text-[12px]" style={{ color: tokens.danger }}>{passwordError}</div>}
            {passwordSaved && !passwordError && <div className="text-[12px] flex items-center gap-1.5" style={{ color: tokens.success }}><IconCheckCircle size={12} /> Password changed</div>}
            <button className="btn text-[13px] self-start" style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary }} onClick={changePassword} disabled={changingPassword || !newPassword}>
              {changingPassword ? "Changing…" : "Change password"}
            </button>
          </div>

          <div className="card elev-sm gap-3 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <div className="text-[13.5px] font-medium" style={{ color: tokens.text }}>Subscription</div>
            <div className="flex items-center gap-2">
              <span className="tag text-[10px]" style={{ border: `1px solid ${tokens.text}`, color: tokens.text }}>{PLAN_LABEL[plan] ?? plan}</span>
              {subStatus && <span className="text-[12px]" style={{ color: tokens.textQuaternary }}>{subStatus}</span>}
            </div>
            {portalError && <div className="text-[12px]" style={{ color: tokens.danger }}>{portalError}</div>}
            <button className="btn text-[13px] self-start" style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary }} onClick={openBillingPortal} disabled={portalLoading}>
              {portalLoading ? "Opening…" : "Manage billing on Stripe →"}
            </button>
            <div className="text-[11.5px]" style={{ color: tokens.textQuaternary }}>
              Opens Stripe&rsquo;s real billing portal — update your card, view invoices, or cancel from there.
            </div>
          </div>

          <div className="card elev-sm gap-2.5 p-5" style={{ background: tokens.surface, border: `1px solid ${tokens.border}` }}>
            <div className="text-[13.5px] font-medium" style={{ color: tokens.text }}>Session</div>
            <button
              className="btn text-[13px] self-start"
              style={{ border: `1px solid ${tokens.border}`, color: tokens.textSecondary }}
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
