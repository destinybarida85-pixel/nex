import { EXPENSE_CATEGORY_COLORS, type ExpenseCategory } from "@/lib/expenseCategories";

const demoCategories = [
  { label: "Payroll" as ExpenseCategory, value: 41200 },
  { label: "Software & tools" as ExpenseCategory, value: 5240 },
  { label: "Vendor payments" as ExpenseCategory, value: 2340 },
  { label: "Office & ops" as ExpenseCategory, value: 1890 },
];

// realTotals (in cents) comes from categorizing the tenant's own debit
// transactions by keyword — see src/lib/expenseCategories.ts. When absent
// (not signed in, or not live yet), this falls back to the same illustrative
// numbers it always showed, unchanged.
export default function ExpenseBreakdown({ realTotals }: { realTotals?: Record<ExpenseCategory, number> } = {}) {
  const live = !!realTotals;
  const data = realTotals
    ? (Object.entries(realTotals) as [ExpenseCategory, number][])
        .map(([label, cents]) => ({ label, value: cents / 100 }))
        .filter((c) => c.value > 0)
        .sort((a, b) => b.value - a.value)
    : demoCategories;
  const total = data.reduce((s, c) => s + c.value, 0);

  return (
    <div className="card elev-sm p-5 gap-3">
      <div className="flex items-baseline">
        <div className="card-title text-[14px]">Expense breakdown</div>
        {live && <span className="card-meta ml-auto">Real, this period</span>}
      </div>
      {total === 0 ? (
        <div className="text-[13px] text-[var(--color-neutral-500)] py-2">No expenses recorded in this period yet.</div>
      ) : (
        <>
          <div className="flex h-2.5 rounded-full overflow-hidden">
            {data.map((c) => (
              <div key={c.label} style={{ width: `${(c.value / total) * 100}%`, background: EXPENSE_CATEGORY_COLORS[c.label] }} />
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-1">
            {data.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-[13px]">
                <span className="w-2 h-2 rounded-[3px] flex-none" style={{ background: EXPENSE_CATEGORY_COLORS[c.label] }} />
                <span className="flex-1">{c.label}</span>
                <span className="text-[var(--color-neutral-500)]">${c.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {live && (
        <div className="text-[10px] text-[var(--color-neutral-600)] mt-0.5">
          Categorized automatically from transaction names — may occasionally misclassify an unfamiliar counterparty.
        </div>
      )}
    </div>
  );
}
