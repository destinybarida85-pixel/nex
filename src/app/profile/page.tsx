"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { IconCamera } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured && !data.error) {
          setLive(true);
          setName(data.fullName || "");
          setEmail(data.email || "");
          setAvatarUrl(data.avatarUrl || null);
        }
      })
      .catch(() => {});
  }, [checked, hasSession]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setError("");
    setUploading(true);
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
      window.dispatchEvent(new Event("origin-avatar-updated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't upload that photo.");
    } finally {
      setUploading(false);
    }
  }

  async function removeAvatar() {
    setError("");
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: null }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setError(data.error || "Couldn't remove your photo.");
      return;
    }
    setAvatarUrl(null);
    window.dispatchEvent(new Event("origin-avatar-updated"));
  }

  async function saveProfile() {
    setSaving(true);
    setError("");
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: name }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok || data.error) {
      setError(data.error || "Couldn't save your changes.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/signin");
    }
  }

  const initials = name.trim() ? name.trim().slice(0, 2).toUpperCase() : "?";

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Profile" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0 max-w-[640px]">
          <div>
            <h3 className="m-0 text-[22px]">Profile</h3>
            <div className="text-muted text-[13.5px] mt-[3px]">Your account and preferences</div>
          </div>

          {checked && !hasSession && (
            <div className="p-3 rounded-lg text-[13.5px]" style={{ background: "color-mix(in srgb, #e0665f 15%, transparent)", color: "#e0665f" }}>
              You&rsquo;re not signed in, so there&rsquo;s no real profile to show here. Sign in, then reload this page.
            </div>
          )}

          <div className="card elev-sm p-5 gap-4">
            <div className="card-title text-sm">Avatar</div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full grid place-items-center text-xl font-medium overflow-hidden"
                  style={
                    avatarUrl
                      ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : { background: "linear-gradient(135deg, var(--color-accent-2-600), var(--color-accent-900))", color: "var(--color-accent-100)" }
                  }
                >
                  {!avatarUrl && initials}
                </div>
                <button
                  className="absolute -bottom-1 -right-1 btn btn-icon btn-primary"
                  style={{ width: 30, height: 30, background: "var(--color-bg)" }}
                  aria-label="Upload avatar"
                  onClick={() => fileRef.current?.click()}
                  disabled={!live || uploading}
                >
                  <IconCamera size={14} />
                </button>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={handleFile} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button className="btn btn-secondary text-[13.5px]" onClick={() => fileRef.current?.click()} disabled={!live || uploading}>
                    {uploading ? "Uploading…" : "Upload photo"}
                  </button>
                  {avatarUrl && (
                    <button className="btn btn-ghost text-[13.5px]" onClick={removeAvatar} disabled={!live}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-[var(--color-neutral-500)]">JPG, PNG, WebP, or GIF — synced to your account</div>
              </div>
            </div>
          </div>

          <div className="card elev-sm p-5 gap-3.5">
            <div className="card-title text-sm">Account</div>
            <div className="field">
              <label>Full name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} disabled={!live} />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="input" value={email} disabled />
              <div className="text-[11px] text-[var(--color-neutral-500)] mt-1">Changing your sign-in email isn&rsquo;t supported here yet.</div>
            </div>
            {error && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
            <button className="btn btn-primary text-[13.5px] self-start" onClick={saveProfile} disabled={!live || saving}>
              {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
            </button>
          </div>

          <div className="card elev-sm p-5 gap-2.5">
            <div className="card-title text-sm">Session</div>
            <button className="btn btn-secondary text-[13.5px] self-start" onClick={handleSignOut} disabled={signingOut}>
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
