export default function KpiCard({
  label,
  value,
  hint,
  chart,
  icon: IconComponent,
  span = "",
  emphasis = false,
}) {
  return (
    <article
      className={`flex min-h-28 flex-col rounded-card border border-line bg-surface p-5 shadow-card ${span}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-ink-400">{label}</p>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink-400">
          <IconComponent strokeWidth={1.9} className="size-4" />
        </span>
      </div>

      <div className="mt-auto pt-4">
        <p
          className={`font-semibold tracking-tight text-ink-900 tabular-nums ${
            emphasis ? "text-3xl" : "text-2xl"
          }`}
        >
          {value}
        </p>

        {hint && (
          <p className="mt-1 truncate text-xs text-ink-400 tabular-nums">
            {hint}
          </p>
        )}

        {chart && <div className="mt-3">{chart}</div>}
      </div>
    </article>
  );
}
