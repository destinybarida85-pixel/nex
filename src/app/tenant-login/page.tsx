const tenantAccent = "#63c3b2";

export default function TenantLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-neutral-900)] p-6">
      <div
        className="w-full max-w-[1000px] lg:h-[640px] flex flex-col lg:flex-row bg-[var(--color-bg)] text-[var(--color-text)] rounded-2xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <div
          className="relative overflow-hidden lg:flex-none"
          style={{
            flex: "1.1",
            background: `linear-gradient(160deg, color-mix(in srgb, ${tenantAccent} 10%, var(--color-bg)), var(--color-bg) 70%)`,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(420px 320px at 20% 25%, color-mix(in srgb, ${tenantAccent} 16%, transparent), transparent)`,
            }}
          />
          <div className="relative p-6 lg:p-11 flex flex-col h-full box-border min-h-[220px] lg:min-h-0">
            <div className="flex items-center gap-2.5">
              <span
                className="w-[34px] h-[34px] rounded-[9px] grid place-items-center font-medium text-[16px]"
                style={{ background: `color-mix(in srgb, ${tenantAccent} 18%, transparent)`, color: tenantAccent }}
              >
                A
              </span>
              <span className="font-medium text-[17px]">Atlas Chambers</span>
            </div>
            <div className="flex-1" />
            <h3 className="m-0 text-[27px] max-w-[340px] leading-[1.2]">Your practice, in one place.</h3>
            <p className="text-[13px] text-[var(--color-neutral-400)] max-w-[340px] mt-2.5">
              Matters, trust accounting, documents and signatures: the client portal of Atlas Chambers LLP.
            </p>
            <div className="mt-[22px] flex gap-3.5 text-[11px] text-[var(--color-neutral-500)]">
              <span>© 2026 Atlas Chambers LLP</span>
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-10 border-t lg:border-t-0 lg:border-l border-[var(--color-divider)]">
          <div className="w-full max-w-[320px] flex flex-col gap-3.5">
            <div>
              <h4 className="m-0 text-[20px]">Sign in</h4>
              <div className="text-[12.5px] text-[var(--color-neutral-500)] mt-[3px]">
                Use your Atlas Chambers account.
              </div>
            </div>
            <div className="field">
              <label>Email</label>
              <input className="input" defaultValue="counsel@atlaschambers.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input" type="password" defaultValue="password123" />
            </div>
            <button
              className="btn btn-block text-[13.5px]"
              style={{ color: tenantAccent, border: `1px solid ${tenantAccent}` }}
            >
              Continue
            </button>
            <div className="flex items-center gap-2.5 text-[11px] text-[var(--color-neutral-600)]">
              <span className="flex-1 h-px bg-[var(--color-divider)]" />
              or
              <span className="flex-1 h-px bg-[var(--color-divider)]" />
            </div>
            <button className="btn btn-secondary btn-block text-[12.5px]" style={{ margin: 0 }}>
              Single sign-on (SSO)
            </button>
            <div className="text-[11px] text-[var(--color-neutral-600)] text-center">
              Secured by encrypted sign-in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
