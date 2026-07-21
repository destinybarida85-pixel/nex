"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { IconGoogle } from "@/components/icons";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);

  function goToDashboard() {
    setTimeout(() => router.push("/dashboard"), 900);
  }

  function handleGoogle() {
    setLoading("google");
    goToDashboard();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Fill in your name, email and password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading("email");
    goToDashboard();
  }

  return (
    <AuthShell>
      <div className="mb-6">
        <h4 className="m-0 text-[20px]">Create your account</h4>
        <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-1">Start free — no card required.</div>
      </div>

      <button
        className="btn btn-secondary btn-block text-[13px] gap-2.5"
        style={{ marginTop: 0 }}
        onClick={handleGoogle}
        disabled={!!loading}
      >
        <IconGoogle size={16} />
        {loading === "google" ? "Connecting to Google…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-2.5 text-[11px] text-[var(--color-neutral-600)] my-4">
        <span className="flex-1 h-px bg-[var(--color-divider)]" />
        or
        <span className="flex-1 h-px bg-[var(--color-divider)]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="field">
          <label>Full name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Amara Osei" />
        </div>
        <div className="field">
          <label>Work email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        {error && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
        <button className="btn btn-primary btn-block" style={{ marginTop: 4 }} disabled={!!loading}>
          {loading === "email" ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="text-[10.5px] leading-[1.5] text-[var(--color-neutral-600)] text-center mt-4">
        By continuing, you agree to Nex&rsquo;s Terms of Service and Privacy Policy.
      </div>

      <div className="text-[12px] text-[var(--color-neutral-500)] text-center mt-4">
        Already have an account? <a href="/signin" style={{ color: "var(--color-accent-300)" }}>Sign in</a>
      </div>
    </AuthShell>
  );
}
