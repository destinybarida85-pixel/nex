import { employees } from "./directory";
import { IconSearch } from "@/components/icons";

export default function DirectoryTable() {
  return (
    <div className="card elev-sm p-[16px_18px] gap-2.5">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="card-title text-sm">Directory</div>
        <div className="flex-1 hidden sm:block" />
        <div className="flex items-center gap-2 w-full sm:w-[220px] px-2.5 py-1.5 bg-[var(--color-bg)] border border-[var(--color-divider)] rounded-lg text-[var(--color-neutral-500)] text-xs">
          <IconSearch size={13} />
          Search employees…
        </div>
      </div>
      <div className="overflow-x-auto">
      <table className="table text-[12.5px] min-w-[560px]">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Location</th>
            <th>Start date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.name}>
              <td>{e.name}</td>
              <td>{e.role}</td>
              <td>{e.department}</td>
              <td>{e.location}</td>
              <td>{e.start}</td>
              <td>
                <span className={`tag ${e.statusTag}`}>{e.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="card-meta justify-between">
        <span>Showing {employees.length} of 22 employees</span>
      </div>
    </div>
  );
}
