import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import StripePaymentLinksSection from "@/components/payments/StripePaymentLinksSection";
import Beneficiaries from "@/components/payments/Beneficiaries";
import PaymentHistoryTable from "@/components/payments/PaymentHistoryTable";
import WebhookLog from "@/components/payments/WebhookLog";
import { IconQrCode, IconRepeat } from "@/components/icons";

const kpis = [
  { label: "Processed · 30d", value: "$33,590.18", meta: "▲ 9.4%", metaLabel: "vs June" },
  { label: "Active payment links", value: "2", metaLabel: "12 uses this month" },
  { label: "Active subscriptions", value: "1", metaLabel: "$4,500/mo" },
  { label: "Refunds issued", value: "$0.00", metaLabel: "0 this month" },
];

export default function PaymentsPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Payments" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]">Payments</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">Links, recurring billing and transfers for Meridian Studio</div>
            </div>
            <div className="flex-1 hidden sm:block" />
            <button className="btn btn-secondary text-[13px]">
              <IconQrCode size={14} />
              QR code
            </button>
            <button className="btn btn-secondary text-[13px]">
              <IconRepeat size={14} />
              New recurring
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="card elev-sm gap-1 p-[14px_16px]">
                <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">{kpi.label}</div>
                <div className="font-medium text-[23px]">{kpi.value}</div>
                <div className="card-meta">
                  {kpi.meta && <span className="tag tag-accent text-[9.5px]">{kpi.meta}</span>}
                  {kpi.metaLabel}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3.5 items-start grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <StripePaymentLinksSection />
            <Beneficiaries />
          </div>

          <PaymentHistoryTable />
          <WebhookLog />
        </main>
      </div>
    </div>
  );
}
