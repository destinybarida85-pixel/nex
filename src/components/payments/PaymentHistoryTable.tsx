import { paymentHistory } from "./data";

export default function PaymentHistoryTable() {
  return (
    <div className="card elev-sm p-[16px_18px] gap-2.5">
      <div className="flex items-baseline">
        <div className="card-title text-sm">Payment history</div>
        <a href="#" className="btn btn-ghost text-[12.5px] ml-auto">View all</a>
      </div>
      <table className="table text-[13px]">
        <thead>
          <tr>
            <th>Counterparty</th>
            <th>Method</th>
            <th>Date</th>
            <th>Status</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((p) => (
            <tr key={p.party + p.date}>
              <td>{p.party}</td>
              <td>{p.method}</td>
              <td>{p.date}</td>
              <td>
                <span className={`tag ${p.statusTag}`}>{p.status}</span>
              </td>
              <td className="text-right">{p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
