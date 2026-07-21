export default function RevenueChart() {
  return (
    <div className="card elev-sm p-[18px_20px] gap-3">
      <div className="flex items-baseline gap-2.5">
        <div className="card-title text-[15px]">Revenue analytics</div>
        <div className="card-meta">Jul 2025 – Jul 2026</div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-neutral-400)]">
          <span className="w-3.5 h-0.5 rounded-sm" style={{ background: "var(--color-accent)" }} />
          Revenue
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-neutral-400)]">
          <span className="w-3.5 h-0.5 rounded-sm" style={{ background: "var(--color-neutral-600)" }} />
          Expenses
        </div>
      </div>
      <svg viewBox="0 0 760 220" className="w-full h-auto block" role="img" aria-label="Revenue trending up across twelve months">
        <defs>
          <linearGradient id="rev1a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#968ae0" stopOpacity="0.28" />
            <stop offset="1" stopColor="#968ae0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="rgba(233,233,237,0.09)" strokeWidth="1">
          <path d="M0 55h760M0 105h760M0 155h760M0 205h760" />
        </g>
        <path
          d="M0 168 L65 150 L130 158 L195 132 L260 140 L325 112 L390 120 L455 96 L520 104 L585 72 L650 80 L720 52 L760 46 L760 220 L0 220 Z"
          fill="url(#rev1a)"
        />
        <path
          d="M0 168 L65 150 L130 158 L195 132 L260 140 L325 112 L390 120 L455 96 L520 104 L585 72 L650 80 L720 52 L760 46"
          fill="none"
          stroke="#968ae0"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M0 192 L65 188 L130 194 L195 184 L260 190 L325 180 L390 186 L455 176 L520 182 L585 172 L650 178 L720 170 L760 168"
          fill="none"
          stroke="#595d6c"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="585" cy="72" r="3.5" fill="#161826" stroke="#968ae0" strokeWidth="2" />
        <g fontFamily="Inter, sans-serif" fontSize="10" fill="rgba(233,233,237,0.45)">
          <text x="0" y="218">Jul</text>
          <text x="128" y="218">Sep</text>
          <text x="258" y="218">Nov</text>
          <text x="388" y="218">Jan</text>
          <text x="518" y="218">Mar</text>
          <text x="648" y="218">May</text>
          <text x="742" y="218">Jul</text>
        </g>
      </svg>
    </div>
  );
}
