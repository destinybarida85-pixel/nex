import { departments as demoDepartments, employees as demoEmployees, type Employee } from "./directory";

type DeptGroup = { name: string; head?: string; count: number };

function realDepartments(employees: Employee[]): DeptGroup[] {
  const map = new Map<string, number>();
  for (const e of employees) {
    map.set(e.department, (map.get(e.department) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

export default function OrgChart({ employees, live }: { employees: Employee[]; live: boolean }) {
  if (live && employees.length === 0) {
    return (
      <div className="card elev-sm p-[24px_20px] flex flex-col gap-1.5">
        <div className="card-title text-[14px]">Organization chart</div>
        <div className="text-[12.5px] text-[var(--color-neutral-500)] py-3">
          Add your first employee above to start building this out.
        </div>
      </div>
    );
  }

  // Demo/preview mode (not signed in, or backend not configured yet) shows illustrative
  // sample data, same convention as DirectoryTable's "Showing X of 22 employees" state.
  // Once live, everything below is derived from the tenant's real employee directory.
  const topPerson = live ? employees.find((e) => /ceo|founder|owner/i.test(e.role)) : demoEmployees[0];
  const deptGroups: DeptGroup[] = live ? realDepartments(employees) : demoDepartments;

  return (
    <div className="card elev-sm p-[24px_20px] flex flex-col items-center gap-0">
      <div className="card-title text-[14px] self-start mb-5">Organization chart</div>

      {topPerson && (
        <>
          <div
            className="flex items-center gap-2.5 rounded-xl px-4 py-2.5"
            style={{ background: "var(--color-accent-900)", boxShadow: "var(--shadow-sm)" }}
          >
            <span
              className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-semibold flex-none"
              style={{ background: "var(--color-accent-500)", color: "var(--color-accent-100)" }}
            >
              {topPerson.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="text-[13.5px] font-medium">{topPerson.name}</div>
              <div className="text-[10.5px] text-[var(--color-neutral-400)]">{topPerson.role}</div>
            </div>
          </div>

          <div className="w-px h-6" style={{ background: "var(--color-divider)" }} />
        </>
      )}

      <div className="relative w-full">
        <div
          className="absolute top-0 left-[12.5%] right-[12.5%] h-px"
          style={{ background: "var(--color-divider)" }}
        />
        <div className="flex justify-center gap-6 pt-6 flex-wrap">
          {deptGroups.map((d) => (
            <div key={d.name} className="flex flex-col items-center gap-0 w-[130px]">
              <div className="w-px h-4" style={{ background: "var(--color-divider)" }} />
              <div className="card elev-sm gap-1.5 p-3 w-full items-center text-center">
                <span
                  className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-medium"
                  style={{ background: "var(--color-neutral-800)", color: "var(--color-neutral-300)" }}
                >
                  {d.name.charAt(0).toUpperCase()}
                </span>
                <div className="text-[13px] font-medium">{d.name}</div>
                {d.head && <div className="text-[10px] text-[var(--color-neutral-500)]">{d.head}</div>}
                <span className="tag tag-neutral text-[9px]">{d.count} {d.count === 1 ? "report" : "reports"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
