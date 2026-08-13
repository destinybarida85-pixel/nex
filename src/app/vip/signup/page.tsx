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

export default function VipSignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Fill in your name, email and password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, company_name: `${name}'s Business` } },
      });
      if (error) {
        setError(formatAuthError(error, "Couldn't create your account. Please try again."));
        setLoading(false);
        return;
      }
      if (data.session) {
        router.push("/vip/console");
      } else {
        setCheckEmail(true);
        setLoading(false);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-8"
        style={{ ...vipVars, background: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <div className="w-full max-w-[420px]">
          <div className="flex items-center gap-3 mb-8">
            <IconLogoMark size={28} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>Primue</span>
            <span className="tag text-[10px]" style={{ border: "1px solid #fff", color: "#fff" }}>VIP</span>
          </div>
          <h4 className="m-0 mb-3" style={{ fontSize: 28, fontWeight: 700 }}>Check your email</h4>
          <div className="text-[14.5px] leading-[1.6]" style={{ color: "var(--color-neutral-500)" }}>
            We sent a confirmation link to <strong style={{ color: "#fff" }}>{email}</strong>. Click it, then come back and sign in.
          </div>
          <a
            href="/vip/login"
            className="btn btn-block mt-7"
            style={{ border: "1px solid var(--color-divider)", color: "#fff", minHeight: 50 }}
          >
            Back to sign in
          </a>
        </div>
      </div>
    );
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
        <h4 className="m-0 mb-1.5" style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Create your account.
        </h4>
        <div className="text-[14px] mb-8" style={{ color: "var(--color-neutral-500)" }}>
          You&rsquo;ll choose VIP after — this just sets up your sign-in.
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="field">
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-neutral-500)" }}>Full name</label>
            <input
              className="input"
              style={{ background: "var(--color-surface)", color: "#fff", border: "1px solid var(--color-divider)", minHeight: 50 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amara Osei"
            />
          </div>
          <div className="field">
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-neutral-500)" }}>Work email</label>
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
              placeholder="At least 8 characters"
            />
          </div>
          {error && <div className="text-[13.5px]" style={{ color: "#ff8a8a" }}>{error}</div>}
          <button
            className="btn btn-block"
            style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #fff", minHeight: 50, fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="text-[13.5px] text-center mt-6" style={{ color: "var(--color-neutral-500)" }}>
          Already have an account? <a href="/vip/login" style={{ color: "#fff", fontWeight: 600 }}>Sign in</a>
        </div>
        <div className="text-[12px] text-center mt-3" style={{ color: "var(--color-neutral-600)" }}>
          <a href="/vip" style={{ color: "var(--color-neutral-600)" }}>← Back to VIP</a>
        </div>
      </div>
    </div>
  );
}
