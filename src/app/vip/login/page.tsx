"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconLogoMark } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { isBackendConfigured } from "@/lib/backendStatus";
import { formatAuthError } from "@/lib/authError";

const vipVars = {
  "--color-bg": "#0a0a0a",
  "--color-surface": "#161616",
  "--color-text": "#f5f5f5",
  "--color-accent": "#ffffff",
  "--color-divider": "rgba(255,255,255,0.14)",
  "--color-neutral-500": "#8a8a8a",
  "--color-neutral-600": "#6b6b6b",
} as React.CSSProperties;

export default function VipLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter both email and password.");
      return;
    }
    if (!isBackendConfigured) {
      setError("Backend isn't connected yet.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(formatAuthError(error, "Couldn't sign you in. Please try again."));
        setLoading(false);
        return;
      }
      router.push("/vip/console");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-8"
      style={{ ...vipVars, background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-3 mb-3">
          <IconLogoMark size={28} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>Primue</span>
          <span className="tag text-[10px]" style={{ border: "1px solid #fff", color: "#fff" }}>VIP</span>
        </div>
        <h4 className="m-0 mb-8" style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Enter your control center.
        </h4>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="field">
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-neutral-500)" }}>Email</label>
            <input
              className="input"
              style={{ background: "var(--color-surface)", color: "#fff", border: "1px solid var(--color-divider)", minHeight: 50 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div className="field">
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-neutral-500)" }}>Password</label>
            <input
              className="input"
              style={{ background: "var(--color-surface)", color: "#fff", border: "1px solid var(--color-divider)", minHeight: 50 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
            />
          </div>
          {error && <div className="text-[13.5px]" style={{ color: "#ff8a8a" }}>{error}</div>}
          <button
            className="btn btn-block"
            style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff", minHeight: 50, fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="text-[13.5px] text-center mt-6" style={{ color: "var(--color-neutral-500)" }}>
          New to VIP? <a href="/vip/signup" style={{ color: "#fff", fontWeight: 600 }}>Create your account</a>
        </div>
        <div className="text-[12px] text-center mt-3" style={{ color: "var(--color-neutral-600)" }}>
          <a href="/vip" style={{ color: "var(--color-neutral-600)" }}>← Back to VIP</a>
        </div>
      </div>
    </div>
  );
}
