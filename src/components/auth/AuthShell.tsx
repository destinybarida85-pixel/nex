import { IconLogoMark } from "@/components/icons";
import AuthBlobScene from "./AuthBlobScene";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10" style={{ background: "#e9e9f0" }}>
      <div className="w-full flex flex-col items-center gap-4" style={{ maxWidth: 940 }}>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: "#ffffff", boxShadow: "0 1px 0 rgba(23,23,28,0.06), 0 8px 20px -12px rgba(23,23,28,0.15)" }}
        >
          <IconLogoMark size={20} />
          <span className="text-[12.5px] font-medium" style={{ color: "#3a3a44" }}>app.origin.io</span>
        </div>

        <div
          className="w-full rounded-[28px] overflow-hidden grid grid-cols-1 md:grid-cols-2"
          style={{ background: "#ffffff", boxShadow: "0 30px 70px -30px rgba(23,23,28,0.35), 0 1px 0 rgba(23,23,28,0.06)", minHeight: 560 }}
        >
          <div className="hidden md:block relative">
            <AuthBlobScene />
          </div>

          <div className="nx-auth-light flex flex-col justify-center p-8 sm:p-12">
            <div className="w-full max-w-[320px] mx-auto">{children}</div>
          </div>
        </div>

        <div className="text-[11px] text-center max-w-[320px]" style={{ color: "#8a8a94" }}>
          No card required · Funds held by licensed banking partners
        </div>
      </div>
    </div>
  );
}
