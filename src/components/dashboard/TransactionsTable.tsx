const rows = [
  { party: "Halcyon Ventures", type: "Invoice #INV-2041", date: "Jul 21", status: "Received", tag: "tag-accent", amount: "+$18,500.00" },
  { party: "AWS", type: "Vendor payment", date: "Jul 20", status: "Cleared", tag: "tag-neutral", amount: "−$2,340.18" },
  { party: "Payroll · 14 employees", type: "Salary run", date: "Jul 18", status: "Cleared", tag: "tag-neutral", amount: "−$41,200.00" },
  { party: "Northbeam Co.", type: "Payment link", date: "Jul 17", status: "Received", tag: "tag-accent", amount: "+$6,750.00" },
  { party: "Figment Design", type: "Invoice #INV-2038", date: "Jul 15", status: "Pending", tag: "tag-outline", amount: "+$4,200.00" },
];

export default function TransactionsTable() {
  return (
    <div className="card elev-sm p-[18px_20px] gap-2.5">
      <div className="flex items-baseline gap-2.5">
        <div className="card-title text-[15px]">Recent transactions</div>
        <div className="flex-1" />
        <a href="#" className="btn btn-ghost text-[12.5px]">View all</a>
      </div>
      <div className="overflow-x-auto -mx-1">
        <table className="table text-[13px] min-w-[520px] px-1">
          <thead>
            <tr>
              <th>Counterparty</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.party + r.date}>
                <td>{r.party}</td>
                <td>{r.type}</td>
                <td>{r.date}</td>
                <td>
                  <span className={`tag ${r.tag}`}>{r.status}</span>
                </td>
                <td className="text-right">{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
