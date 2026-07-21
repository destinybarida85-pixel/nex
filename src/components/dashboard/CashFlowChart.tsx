export default function CashFlowChart() {
  return (
    <div className="card elev-sm p-[18px_20px] gap-3">
      <div className="flex items-baseline gap-2.5">
        <div className="card-title text-[15px]">Cash flow</div>
        <div className="flex-1" />
        <div className="card-meta">6 months</div>
      </div>
      <svg viewBox="0 0 320 190" className="w-full h-auto block" role="img" aria-label="Monthly cash in and out">
        <g stroke="rgba(233,233,237,0.09)" strokeWidth="1">
          <path d="M0 45h320M0 90h320M0 135h320" />
        </g>
        <g>
          <rect x="14" y="92" width="14" height="88" rx="3" fill="#968ae0" />
          <rect x="32" y="128" width="14" height="52" rx="3" fill="#3f424d" />
          <rect x="66" y="78" width="14" height="102" rx="3" fill="#968ae0" />
          <rect x="84" y="118" width="14" height="62" rx="3" fill="#3f424d" />
          <rect x="118" y="98" width="14" height="82" rx="3" fill="#968ae0" />
          <rect x="136" y="132" width="14" height="48" rx="3" fill="#3f424d" />
          <rect x="170" y="62" width="14" height="118" rx="3" fill="#968ae0" />
          <rect x="188" y="122" width="14" height="58" rx="3" fill="#3f424d" />
          <rect x="222" y="70" width="14" height="110" rx="3" fill="#968ae0" />
          <rect x="240" y="112" width="14" height="68" rx="3" fill="#3f424d" />
          <rect x="274" y="42" width="14" height="138" rx="3" fill="#968ae0" />
          <rect x="292" y="118" width="14" height="62" rx="3" fill="#3f424d" />
        </g>
      </svg>
      <div className="card-meta justify-between">
        <span>Feb · Mar · Apr · May · Jun · Jul</span>
        <span style={{ color: "var(--color-accent-300)" }}>Net +$22.4k avg</span>
      </div>
    </div>
  );
}
