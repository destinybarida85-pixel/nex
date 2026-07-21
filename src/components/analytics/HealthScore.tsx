export default function HealthScore({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="card elev-sm p-5 gap-3 items-center">
      <div className="card-title text-[13px] self-start">Business health score</div>
      <div className="relative w-[140px] h-[140px]">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--color-neutral-800)" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-medium text-[30px]">{score}</div>
          <div className="text-[10px] text-[var(--color-neutral-500)]">out of 100</div>
        </div>
      </div>
      <div className="text-[11.5px] text-center text-[var(--color-neutral-400)] max-w-[180px]">
        Strong cash position and low burn. Watch software spend, up 22% this quarter.
      </div>
    </div>
  );
}
