import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { formatRupiah, formatRupiahCompact } from "../../utils/format";

const SLICE_COLORS = [
  "#1d63ed",
  "#2f7cff",
  "#59a0ff",
  "#8ec0ff",
  "#bcd8ff",
  "#98a2b3",
];

const TOP_SLICE_COUNT = 5;

const TOOLTIP_STYLE = {
  borderRadius: "0.625rem",
  border: "1px solid #e9ecf1",
  fontSize: "0.75rem",
  padding: "8px 10px",
};

function buildSlices(materials) {
  const totals = new Map();

  materials.forEach((item) => {
    const subtotal = Number(item.qty) * Number(item.price);
    totals.set(item.category, (totals.get(item.category) ?? 0) + subtotal);
  });

  const sorted = [...totals.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (sorted.length <= TOP_SLICE_COUNT) return sorted;

  const restValue = sorted
    .slice(TOP_SLICE_COUNT)
    .reduce((sum, item) => sum + item.value, 0);

  return [
    ...sorted.slice(0, TOP_SLICE_COUNT),
    { name: "Lainnya", value: restValue },
  ];
}

function ChartTitle() {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink-400">Komposisi Nilai</p>
        <p className="mt-0.5 text-xs text-ink-400">Per kategori material</p>
      </div>

      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink-400">
        <PieChartIcon strokeWidth={1.9} className="size-4" />
      </span>
    </div>
  );
}

export default function CategoryDonutChart({ materials }) {
  const slices = useMemo(() => buildSlices(materials), [materials]);
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <article className="flex min-h-28 flex-col rounded-card border border-line bg-surface p-5 shadow-card">
      <ChartTitle />

      {slices.length === 0 ? (
        <div className="mt-4 flex flex-1 items-center justify-center rounded-field border border-dashed border-line text-sm text-ink-400">
          Belum ada data
        </div>
      ) : (
        <div className="mt-4 flex min-h-0 flex-1 flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <div className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36 lg:max-h-40 lg:max-w-40 lg:flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="64%"
                  outerRadius="100%"
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {slices.map((slice, index) => (
                    <Cell
                      key={slice.name}
                      fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => formatRupiah(value)}
                  contentStyle={TOOLTIP_STYLE}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] tracking-wide text-ink-400 uppercase">
                Total
              </span>
              <span className="text-sm font-semibold text-ink-900 tabular-nums">
                {formatRupiahCompact(total)}
              </span>
            </div>
          </div>

          <ul className="w-full min-w-0 flex-1 space-y-2">
            {slices.map((slice, index) => (
              <li key={slice.name} className="flex items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      SLICE_COLORS[index % SLICE_COLORS.length],
                  }}
                />
                <span className="min-w-0 flex-1 truncate text-xs text-ink-600">
                  {slice.name}
                </span>
                <span className="shrink-0 text-xs font-medium text-ink-900 tabular-nums">
                  {total === 0 ? 0 : Math.round((slice.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}