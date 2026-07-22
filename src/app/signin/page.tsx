"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { IconGoogle, IconLogoMark } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { isBackendConfigured } from "@/lib/backendStatus";

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
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirectTarget}` },
    });
    if (error) {
      setError(error.message);
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
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(null);
      return;
    }
    router.push(redirectTarget);
  }

  return (
    <AuthShell>
      <div className="flex items-center gap-2 mb-8">
        <IconLogoMark size={22} />
        <span className="text-[14px] font-medium">Origin</span>
      </div>
      <div className="mb-6">
        <h4 className="m-0 text-[22px]">Welcome back</h4>
        <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-1">Enter your details below.</div>
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
          <label>Email</label>
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
            placeholder="••••••••••"
          />
        </div>
        {error && <div className="text-[11.5px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
        <button className="btn btn-primary btn-block" style={{ marginTop: 4 }} disabled={!!loading}>
          {loading === "email" ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="text-[12px] text-[var(--color-neutral-500)] text-center mt-5">
        Don&rsquo;t have an account? <a href="/signup" style={{ color: "var(--color-accent-300)" }}>Sign up</a>
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
