export default function GrowthChart() {
  return (
    <div className="card elev-sm p-5 gap-3">
      <div className="flex items-baseline">
        <div className="card-title text-[13px]">Customer growth</div>
        <span className="card-meta ml-auto" style={{ color: "var(--color-accent-300)" }}>▲ 18% QoQ</span>
      </div>
      <svg viewBox="0 0 320 90" className="w-full h-auto block" role="img" aria-label="Customer count growing over six months">
        <g stroke="rgba(233,233,237,0.09)" strokeWidth="1">
          <path d="M0 30h320M0 60h320" />
        </g>
        <g fill="var(--color-accent)">
          <rect x="10" y="60" width="20" height="20" rx="3" opacity="0.5" />
          <rect x="60" y="52" width="20" height="28" rx="3" opacity="0.6" />
          <rect x="110" y="44" width="20" height="36" rx="3" opacity="0.7" />
          <rect x="160" y="34" width="20" height="46" rx="3" opacity="0.8" />
          <rect x="210" y="22" width="20" height="58" rx="3" opacity="0.9" />
          <rect x="260" y="10" width="20" height="70" rx="3" />
        </g>
      </svg>
      <div className="card-meta justify-between">
        <span>Feb</span>
        <span>Jul</span>
      </div>
    </div>
  );
}
