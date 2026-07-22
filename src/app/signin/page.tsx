"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { IconGoogle, IconLogoMark } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { isBackendConfigured } from "@/lib/backendStatus";
import { formatAuthError } from "@/lib/authError";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);

  async function handleGoogle() {
    if (!isBackendConfigured) {
      setError("Backend isn't connected yet, so Google sign-in isn't live. Ask your developer to add Supabase credentials.");
      return;
    }
    setLoading("google");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}${redirectTarget}` },
      });
      if (error) {
        setError(formatAuthError(error, "Couldn't reach Google sign-in. Please try again in a moment."));
        setLoading(null);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter both email and password.");
      return;
    }
    if (!isBackendConfigured) {
      setError("Backend isn't connected yet, so accounts can't sign in for real. Ask your developer to add Supabase credentials.");
      return;
    }
    setError("");
    setLoading("email");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(formatAuthError(error, "Couldn't sign you in. Please try again in a moment."));
        setLoading(null);
        return;
      }
      router.push(redirectTarget);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(null);
    }
  }

  return (
    <AuthShell>
      <div className="flex items-center gap-3 mb-11">
        <IconLogoMark size={34} />
        <span style={{ fontSize: 19, fontWeight: 600 }}>Origin</span>
      </div>
      <div className="mb-9">
        <h4 className="m-0" style={{ fontSize: 42, lineHeight: 1.1, fontWeight: 700 }}>Welcome back</h4>
        <div className="text-[16px] text-[var(--color-neutral-500)] mt-2.5">Enter your details below.</div>
      </div>

      <button
        className="btn btn-secondary btn-block gap-3"
        style={{ marginTop: 0, minHeight: 56, fontSize: 16, fontWeight: 600 }}
        onClick={handleGoogle}
        disabled={!!loading}
      >
        <IconGoogle size={20} />
        {loading === "google" ? "Connecting to Google…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 text-[14px] text-[var(--color-neutral-600)] my-7">
        <span className="flex-1 h-px bg-[var(--color-divider)]" />
        or
        <span className="flex-1 h-px bg-[var(--color-divider)]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="field">
          <label style={{ fontSize: 15, fontWeight: 600 }}>Email</label>
          <input
            className="input"
            style={{ minHeight: 56, fontSize: 16, padding: "12px 16px" }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="field">
          <label style={{ fontSize: 15, fontWeight: 600 }}>Password</label>
          <input
            className="input"
            style={{ minHeight: 56, fontSize: 16, padding: "12px 16px" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
          />
        </div>
        {error && <div className="text-[14px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 6, minHeight: 56, fontSize: 17, fontWeight: 700 }}
          disabled={!!loading}
        >
          {loading === "email" ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="text-[15px] text-[var(--color-neutral-500)] text-center mt-8">
        Don&rsquo;t have an account? <a href="/signup" style={{ color: "var(--color-accent-300)", fontWeight: 600 }}>Sign up</a>
      </div>
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
