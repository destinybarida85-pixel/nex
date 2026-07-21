const categories = [
  { label: "Payroll", value: 41200, color: "var(--color-accent)" },
  { label: "Software & tools", value: 5240, color: "var(--color-accent-600)" },
  { label: "Vendor payments", value: 2340, color: "var(--color-neutral-600)" },
  { label: "Office & ops", value: 1890, color: "var(--color-neutral-700)" },
];
const total = categories.reduce((s, c) => s + c.value, 0);

export default function ExpenseBreakdown() {
  return (
    <div className="card elev-sm p-5 gap-3">
      <div className="card-title text-[13px]">Expense breakdown</div>
      <div className="flex h-2.5 rounded-full overflow-hidden">
        {categories.map((c) => (
          <div key={c.label} style={{ width: `${(c.value / total) * 100}%`, background: c.color }} />
        ))}
      </div>
      <div className="flex flex-col gap-2 mt-1">
        {categories.map((c) => (
          <div key={c.label} className="flex items-center gap-2 text-[12px]">
            <span className="w-2 h-2 rounded-[3px] flex-none" style={{ background: c.color }} />
            <span className="flex-1">{c.label}</span>
            <span className="text-[var(--color-neutral-500)]">${c.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
