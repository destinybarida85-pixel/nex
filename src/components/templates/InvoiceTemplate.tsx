const lineItems = [
  { desc: "Brand identity system", qty: 1, rate: "$6,200.00", amount: "$6,200.00" },
  { desc: "Design ops consulting", qty: "8 hrs", rate: "$200.00", amount: "$1,600.00" },
  { desc: "Rush delivery fee", qty: 1, rate: "$400.00", amount: "$400.00" },
];

export default function InvoiceTemplate({ tenantName, tenantAccent, poweredBy }: { tenantName: string; tenantAccent: string; poweredBy: boolean }) {
  return (
    <div
      className="rounded-xl overflow-hidden mx-auto"
      style={{ background: "#f5f5f7", color: "#1a1a1f", maxWidth: 620, boxShadow: "var(--shadow-md)" }}
    >
      <div className="p-10 flex flex-col gap-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-[9px] grid place-items-center font-semibold text-[15px]"
              style={{ background: tenantAccent, color: "#fff" }}
            >
              {tenantName.charAt(0)}
            </span>
            <span className="font-medium text-[16px]">{tenantName}</span>
          </div>
          <div className="text-right">
            <div className="text-[20px] font-medium tracking-[0.04em]" style={{ color: tenantAccent }}>
              INVOICE
            </div>
            <div className="text-[12px] mt-0.5" style={{ color: "#6b6b76" }}>
              INV-2042
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-[12.5px]" style={{ color: "#4a4a54" }}>
          <div>
            <div className="text-[10px] tracking-[.08em] uppercase mb-1.5" style={{ color: "#9a9aa6" }}>Bill from</div>
            <div style={{ color: "#1a1a1f" }}>{tenantName}</div>
            <div>118 Harbor St, Suite 4B</div>
            <div>billing@{tenantName.toLowerCase().replace(/\s+/g, "")}.com</div>
          </div>
          <div>
            <div className="text-[10px] tracking-[.08em] uppercase mb-1.5" style={{ color: "#9a9aa6" }}>Bill to</div>
            <div style={{ color: "#1a1a1f" }}>Figment Design</div>
            <div>44 Wharf Row, Unit 2</div>
            <div>accounts@figmentdesign.co</div>
          </div>
        </div>

        <div className="flex gap-8 text-[12px]" style={{ color: "#6b6b76" }}>
          <div>
            <div className="uppercase tracking-[.06em] text-[10px]">Invoice date</div>
            <div style={{ color: "#1a1a1f" }}>Jul 21, 2026</div>
          </div>
          <div>
            <div className="uppercase tracking-[.06em] text-[10px]">Due date</div>
            <div style={{ color: "#1a1a1f" }}>Aug 5, 2026</div>
          </div>
          <div>
            <div className="uppercase tracking-[.06em] text-[10px]">Terms</div>
            <div style={{ color: "#1a1a1f" }}>Net 15</div>
          </div>
        </div>

        <table className="w-full text-[12.5px]" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${tenantAccent}` }}>
              <th className="text-left pb-2 font-medium" style={{ color: "#6b6b76" }}>Description</th>
              <th className="text-right pb-2 font-medium" style={{ color: "#6b6b76" }}>Qty</th>
              <th className="text-right pb-2 font-medium" style={{ color: "#6b6b76" }}>Rate</th>
              <th className="text-right pb-2 font-medium" style={{ color: "#6b6b76" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.desc} style={{ borderBottom: "1px solid #e4e4ea" }}>
                <td className="py-2.5">{item.desc}</td>
                <td className="text-right py-2.5">{item.qty}</td>
                <td className="text-right py-2.5">{item.rate}</td>
                <td className="text-right py-2.5">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-[220px] flex flex-col gap-1.5 text-[12.5px]">
            <div className="flex justify-between" style={{ color: "#6b6b76" }}>
              <span>Subtotal</span>
              <span>$8,200.00</span>
            </div>
            <div className="flex justify-between" style={{ color: "#6b6b76" }}>
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-[16px] font-medium pt-1.5" style={{ borderTop: `1.5px solid ${tenantAccent}`, color: "#1a1a1f" }}>
              <span>Total due</span>
              <span>$8,200.00</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-4 text-[11.5px]" style={{ background: "#eceef0", color: "#4a4a54" }}>
          Pay by wire or ACH to virtual account <strong>0219 4417 8830</strong> · Column Bank N.A. Questions? Reply to this invoice or contact {tenantName}&rsquo;s billing team.
        </div>

        {poweredBy && (
          <div className="text-center text-[10.5px]" style={{ color: "#9a9aa6" }}>
            Powered by Nex
          </div>
        )}
      </div>
    </div>
  );
}
