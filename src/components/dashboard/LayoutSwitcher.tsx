const variants = [
  { key: "default", label: "Default", href: "/dashboard" },
  { key: "command", label: "Command center", href: "/dashboard/command-center" },
  { key: "rail", label: "Right rail", href: "/dashboard/rail" },
];

export default function LayoutSwitcher({ current }: { current: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[10.5px] tracking-[.06em] uppercase text-[var(--color-neutral-600)]">
        Layout exploration
      </span>
      <div className="seg">
        {variants.map((v) => (
          <a
            key={v.key}
            href={v.href}
            className="seg-opt no-underline"
            style={
              v.key === current
                ? { color: "var(--color-accent)", boxShadow: "inset 0 0 0 1px var(--color-accent)" }
                : { color: "var(--color-neutral-400)" }
            }
          >
            {v.label}
          </a>
        ))}
      </div>
    </div>
  );
}
