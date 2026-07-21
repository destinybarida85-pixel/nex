import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCards from "@/components/dashboard/KpiCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import SideStack from "@/components/dashboard/SideStack";
import LayoutSwitcher from "@/components/dashboard/LayoutSwitcher";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <LayoutSwitcher current="default" />
          <DashboardHeader />
          <KpiCards />
          <div className="grid gap-3.5 grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <RevenueChart />
            <CashFlowChart />
          </div>
          <div className="grid gap-3.5 items-start grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <TransactionsTable />
            <SideStack />
          </div>
        </main>
      </div>
    </div>
  );
}
