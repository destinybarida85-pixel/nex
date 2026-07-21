import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import OrgChart from "@/components/employees/OrgChart";
import DirectoryTable from "@/components/employees/DirectoryTable";
import { IconPlus } from "@/components/icons";

const kpis = [
  { label: "Total employees", value: "22", meta: "▲ 3", metaLabel: "this quarter" },
  { label: "Open roles", value: "2", metaLabel: "Product, Engineering" },
  { label: "Avg tenure", value: "1.4 yrs", metaLabel: "across team" },
  { label: "Departments", value: "4", metaLabel: "+ Leadership" },
];

export default function EmployeesPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar active="Employees" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="p-4 pt-16 sm:p-[24px_28px_28px] flex flex-col gap-5 min-w-0">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <h3 className="m-0 text-[22px]">Employees</h3>
              <div className="text-muted text-[12.5px] mt-[3px]">Directory, structure and headcount for Meridian Studio</div>
            </div>
            <div className="flex-1 hidden sm:block" />
            <button className="btn btn-primary text-[13px]">
              <IconPlus size={14} />
              Add employee
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

          <OrgChart />
          <DirectoryTable />
        </main>
      </div>
    </div>
  );
}
