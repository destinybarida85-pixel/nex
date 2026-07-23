export default function EmailTemplate({ tenantName, tenantAccent, poweredBy }: { tenantName: string; tenantAccent: string; poweredBy: boolean }) {
  return (
    <div
      className="rounded-xl overflow-hidden mx-auto border border-[var(--color-divider)] flex-none"
      style={{ width: 560 }}
    >
      <div className="p-4 flex flex-col gap-2 text-[12px]" style={{ background: "var(--color-surface)" }}>
        <div className="flex gap-2">
          <span className="w-14 flex-none text-[var(--color-neutral-500)]">From</span>
          <span>{tenantName} &lt;noreply@{tenantName.toLowerCase().replace(/\s+/g, "")}.com&gt;</span>
        </div>
        <div className="flex gap-2">
          <span className="w-14 flex-none text-[var(--color-neutral-500)]">To</span>
          <span>jordan@halcyonventures.com</span>
        </div>
        <div className="flex gap-2">
          <span className="w-14 flex-none text-[var(--color-neutral-500)]">Subject</span>
          <span className="font-medium">Please review and sign: MSA · Halcyon Ventures</span>
        </div>
      </div>

      <div className="p-10 flex flex-col gap-6" style={{ background: "#f5f5f7", color: "#1a1a1f" }}>
        <div className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-[8px] grid place-items-center font-semibold text-[13px]"
            style={{ background: tenantAccent, color: "#fff" }}
          >
            {tenantName.charAt(0)}
          </span>
          <span className="font-medium text-[15px]">{tenantName}</span>
        </div>

        <div className="flex flex-col gap-3.5 text-[13.5px] leading-[1.65]" style={{ color: "#3a3a44" }}>
          <p className="m-0">Hi Jordan,</p>
          <p className="m-0">
            {tenantName} has sent you a Master Services Agreement for signature. Please review the document and
            sign at your earliest convenience. This link expires in 7 days.
          </p>
        </div>

        <a
          href="/sign"
          className="self-start px-6 py-3 rounded-lg font-medium text-[13.5px] no-underline"
          style={{ background: tenantAccent, color: "#fff" }}
        >
          Review &amp; sign document
        </a>

        <p className="m-0 text-[12px]" style={{ color: "#6b6b76" }}>
          Or copy this link into your browser: <span style={{ color: tenantAccent }}>app.origin.io/sign/8f21-40a9</span>
        </p>

        <div className="pt-5 flex flex-col gap-1 text-[11px]" style={{ borderTop: "1px solid #e4e4ea", color: "#9a9aa6" }}>
          <span>{tenantName} · 118 Harbor St, Suite 4B</span>
          <span>
            Sent via secure e-signature · protected by tamper-evident signature hashing
            {poweredBy ? " · Powered by Origin" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
