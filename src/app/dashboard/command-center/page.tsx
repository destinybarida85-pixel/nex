import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HeroBalance from "@/components/dashboard/HeroBalance";
import RevenueChart from "@/components/dashboard/RevenueChart";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import TransactionsCompact from "@/components/dashboard/TransactionsCompact";
import SideStack from "@/components/dashboard/SideStack";
import LayoutSwitcher from "@/components/dashboard/LayoutSwitcher";

export default function CommandCenterPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Dashboard" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <LayoutSwitcher current="command" />
          <DashboardHeader />
          <HeroBalance />
          <div className="grid gap-3.5 items-start grid-cols-1 lg:grid-cols-3">
            <TransactionsCompact />
            <CashFlowChart />
            <SideStack />
          </div>
          <RevenueChart />
        </main>
      </div>
    </div>
  );
}
