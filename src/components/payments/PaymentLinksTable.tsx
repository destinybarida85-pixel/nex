import { paymentLinks } from "./data";
import { IconLink } from "@/components/icons";

export default function PaymentLinksTable() {
  return (
    <div className="card elev-sm p-[16px_18px] gap-2.5">
      <div className="flex items-center gap-2">
        <IconLink size={14} className="text-[var(--color-accent)]" />
        <div className="card-title text-sm">Payment links</div>
      </div>
      <table className="table text-[12.5px]">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Uses</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paymentLinks.map((l) => (
            <tr key={l.name}>
              <td>{l.name}</td>
              <td>{l.amount}</td>
              <td>{l.type}</td>
              <td>{l.uses}</td>
              <td>
                <span className={`tag ${l.statusTag}`}>{l.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
