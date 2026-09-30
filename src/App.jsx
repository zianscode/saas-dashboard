import AppLayout from "./components/layout/AppLayout";
import { Wallet, Package, Boxes, Calculator, Table2 } from "lucide-react";

const KPI_CARDS = [
  {
    key: "totalNilai",
    label: "Total Nilai",
    icon: Wallet,
    span: "xl:col-span-2",
    emphasis: true,
  },
  { key: "totalMaterial", label: "Total Material", icon: Package, span: "" },
  { key: "totalQty", label: "Total Qty", icon: Boxes, span: "" },
  { key: "avgPerItem", label: "Rata rata Item", icon: Calculator, span: "" },
];

export default function App() {
  return (
    <AppLayout>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-[minmax(7rem,1fr)_minmax(0,1.75fr)] xl:grid-cols-4">
        {KPI_CARDS.map((card) => {
          const IconComponent = card.icon;

          return (
            <article
              key={card.key}
              className={`flex min-h-28 flex-col justify-between rounded-card border border-line bg-surface p-5 shadow-card ${card.span}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-medium text-ink-400">{card.label}</p>
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink-400">
                  <IconComponent strokeWidth={1.9} className="size-4" />
                </span>
              </div>

              <p
                className={`mt-5 font-semibold tracking-tight text-ink-900 tabular-nums ${
                  card.emphasis ? "text-3xl" : "text-2xl"
                }`}
              >
                —
              </p>
            </article>
          );
        })}

        <article className="flex min-h-56 min-w-0 flex-col rounded-card border border-line bg-surface p-5 shadow-card sm:col-span-2 xl:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-medium text-ink-400">Data Material</p>
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink-400">
              <Table2 strokeWidth={1.9} className="size-4" />
            </span>
          </div>

          <div className="mt-5 flex-1 rounded-field border border-dashed border-line" />
        </article>
      </div>
    </AppLayout>
  );
}