import Image from "next/image";

type IconProps = { size?: number; className?: string };

const base = (size = 16) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconDashboard({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.5V20h12V9.5" />
    </svg>
  );
}
export function IconEdit({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
export function IconAnalytics({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 20V12M12 20V5M19 20v-5" />
    </svg>
  );
}
export function IconCalendar({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </svg>
  );
}
export function IconWallet({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M16 13h3" />
    </svg>
  );
}
export function IconPayments({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10.5h18" />
    </svg>
  );
}
export function IconInvoices({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 3h8l4 4v14H7z" />
      <path d="M11 12h5M11 16h5" />
    </svg>
  );
}
export function IconPayroll({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.6-3.4 2.8-5 5.5-5s4.9 1.6 5.5 5" />
      <path d="M17 8h4M17 12h4" />
    </svg>
  );
}
export function IconDocuments({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M13 3H6v18h12V8z" />
      <path d="M13 3v5h5" />
    </svg>
  );
}
export function IconESign({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 20c4-4 6-1 8-4s1-6 5-7" />
      <path d="M14 6l4 4 3-9z" />
    </svg>
  );
}
export function IconProjects({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="10" y="4" width="5" height="10" rx="1" />
      <rect x="17" y="4" width="4" height="13" rx="1" />
    </svg>
  );
}
export function IconClients({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" />
    </svg>
  );
}
export function IconEmployees({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="8" cy="9" r="2.8" />
      <circle cx="16" cy="9" r="2.8" />
      <path d="M2.5 19c.5-3 2.6-4.5 5.5-4.5S13 16 13.5 19M13.5 15.2c.8-.5 1.6-.7 2.5-.7 2.9 0 5 1.5 5.5 4.5" />
    </svg>
  );
}
export function IconSparkle({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />
    </svg>
  );
}
export function IconSettings({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </svg>
  );
}
export function IconGlobe({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c-5 5.5-5 12.5 0 18M12 3c5 5.5 5 12.5 0 18" />
    </svg>
  );
}
export function IconApi({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
    </svg>
  );
}
export function IconSearch({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={1.8}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
export function IconPlus({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
export function IconBell({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}
export function IconMessages({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" />
    </svg>
  );
}
export function IconDownload({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={1.8}>
      <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
      <path d="M5 20h14" />
    </svg>
  );
}
export function IconChevronUpDown({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={2}>
      <path d="M7 9l5-5 5 5M7 15l5 5 5-5" />
    </svg>
  );
}
export function IconEye({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
export function IconEyeOff({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.3 4.2M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7a10.6 10.6 0 0 0 3.4-.6" />
      <path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
export function IconSend({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />
    </svg>
  );
}
export function IconReceive({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5" />
      <path d="M4 20h16" />
    </svg>
  );
}
export function IconArrowUpCircle({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={1.8}>
      <path d="M12 15V3m0 12l-4.5-4.5M12 15l4.5-4.5" />
    </svg>
  );
}
export function IconArrowDownCircle({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={1.8}>
      <path d="M12 3v12m0 0l4.5-4.5M12 15l-4.5 4.5" />
    </svg>
  );
}
export function IconPerson({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M4 19c.6-3 2.5-4.5 5-4.5s4.4 1.5 5 4.5" />
    </svg>
  );
}
export function IconQrCode({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v1M20 19v1h-3" />
    </svg>
  );
}
export function IconGrid({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
  );
}
export function IconToggles({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </svg>
  );
}
export function IconCheckCircle({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5.4" />
    </svg>
  );
}
export function IconShieldCheck({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4.5" />
    </svg>
  );
}
export function IconPen({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 20l4-1 10-10-3-3L5 16z" />
      <path d="M14 7l3 3" />
    </svg>
  );
}
export function IconLock({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
export function IconX({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
export function IconMail({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </svg>
  );
}
export function IconLink({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 15l6-6" />
      <path d="M11 6l1.5-1.5a3.54 3.54 0 0 1 5 5L16 11" />
      <path d="M13 18l-1.5 1.5a3.54 3.54 0 0 1-5-5L8 13" />
    </svg>
  );
}
export function IconActivity({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}
export function IconRepeat({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 7h13l-3-3M20 17H7l3 3" />
    </svg>
  );
}
export function IconMenu({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function IconGoogle({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <path fill="#EA4335" d="M24 9.5c3.4 0 6.4 1.17 8.8 3.46l6.55-6.55C35.3 2.65 30.05 0.5 24 0.5 14.85 0.5 6.95 5.73 3.1 13.34l7.62 5.92C12.5 13.5 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.42-4.74H24v9.02h12.65c-.55 2.9-2.2 5.36-4.68 7.02l7.28 5.65C43.5 37.5 46.5 31.5 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.72 19.26A14.5 14.5 0 0 0 9.5 24c0 1.66.28 3.26.78 4.74l-7.62 5.92A23.94 23.94 0 0 1 0.5 24c0-3.87.93-7.53 2.6-10.66l7.62 5.92z" />
      <path fill="#34A853" d="M24 47.5c6.05 0 11.13-2 14.84-5.42l-7.28-5.65c-2.02 1.36-4.6 2.17-7.56 2.17-6.2 0-11.5-4-13.28-9.76l-7.62 5.92C6.95 41.77 14.85 47.5 24 47.5z" />
    </svg>
  );
}
export function MobileLogoMark({ size = 30, initial = "O" }: { size?: number; initial?: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flex: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "linear-gradient(140deg, var(--color-accent-400), var(--color-accent-800))",
          display: "grid",
          placeItems: "center",
          color: "var(--color-accent-100)",
          fontWeight: 600,
          fontSize: size * 0.42,
          fontFamily: "var(--font-inter)",
          boxShadow: "0 0 0 1px color-mix(in srgb, var(--color-accent) 40%, transparent)",
        }}
      >
        {initial}
      </div>
      <svg
        width={size + 12}
        height={size + 12}
        viewBox="0 0 100 100"
        style={{ position: "absolute", top: -6, left: -6, animation: "nx-orbit-spin 9s linear infinite" }}
      >
        <ellipse
          cx="50"
          cy="50"
          rx="48"
          ry="20"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.4"
          opacity="0.55"
        />
        <circle cx="98" cy="50" r="3.2" fill="var(--color-accent-300)" />
      </svg>
    </div>
  );
}
export function IconCamera({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  );
}
export function IconArrowRight({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
export function IconLogoMark({ size = 26, className }: IconProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <Image src="/logo.png" alt="Origin" width={size} height={size} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}
