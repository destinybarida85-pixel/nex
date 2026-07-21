import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCards from "@/components/dashboard/KpiCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import SideStack from "@/components/dashboard/SideStack";
import LayoutSwitcher from "@/components/dashboard/LayoutSwitcher";

export default function RailPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Dashboard" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <div className="flex-1 flex min-h-0">
          <main className="flex-1 min-w-0 p-[24px_28px_28px] flex flex-col gap-5 overflow-y-auto">
            <LayoutSwitcher current="rail" />
            <DashboardHeader />
            <KpiCards />
            <RevenueChart />
            <CashFlowChart />
            <TransactionsTable />
          </main>

          <aside className="w-[300px] flex-none border-l border-[var(--color-divider)] p-[20px_16px] overflow-y-auto">
            <div className="text-[10.5px] tracking-[.08em] uppercase text-[var(--color-neutral-500)] mb-3">
              Insights
            </div>
            <SideStack />
          </aside>
        </div>
      </div>
    </div>
  );
}
