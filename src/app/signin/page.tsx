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
      <div className="flex items-center gap-2.5 mb-10">
        <IconLogoMark size={30} />
        <span className="text-[17px] font-medium">Origin</span>
      </div>
      <div className="mb-8">
        <h4 className="m-0" style={{ fontSize: 34, lineHeight: 1.15 }}>Welcome back</h4>
        <div className="text-[15px] text-[var(--color-neutral-500)] mt-2">Enter your details below.</div>
      </div>

      <button
        className="btn btn-secondary btn-block gap-3"
        style={{ marginTop: 0, minHeight: 52, fontSize: 15 }}
        onClick={handleGoogle}
        disabled={!!loading}
      >
        <IconGoogle size={19} />
        {loading === "google" ? "Connecting to Google…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 text-[13px] text-[var(--color-neutral-600)] my-6">
        <span className="flex-1 h-px bg-[var(--color-divider)]" />
        or
        <span className="flex-1 h-px bg-[var(--color-divider)]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="field">
          <label style={{ fontSize: 14 }}>Email</label>
          <input
            className="input"
            style={{ minHeight: 52, fontSize: 15, padding: "10px 14px" }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="field">
          <label style={{ fontSize: 14 }}>Password</label>
          <input
            className="input"
            style={{ minHeight: 52, fontSize: 15, padding: "10px 14px" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
          />
        </div>
        {error && <div className="text-[13px]" style={{ color: "var(--color-accent-300)" }}>{error}</div>}
        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 6, minHeight: 52, fontSize: 15.5 }}
          disabled={!!loading}
        >
          {loading === "email" ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="text-[14px] text-[var(--color-neutral-500)] text-center mt-7">
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
