import { useMemo, useState } from "react";
import { Boxes, Package, Plus, Wallet } from "lucide-react";
import AppLayout from "./components/layout/AppLayout";
import CategoryDonutChart from "./components/dashboard/CategoryDonutChart";
import DataTable from "./components/dashboard/DataTable";
import KpiCard from "./components/dashboard/KpiCard";
import MaterialFormModal from "./components/dashboard/MaterialFormModal";
import MiniBars from "./components/dashboard/MiniBars";
import StatusFilter from "./components/dashboard/StatusFilter";
import useMaterialTable from "./hooks/useMaterialTable";
import useMaterials from "./hooks/useMaterials";
import {
  formatNumber,
  formatRupiah,
  formatRupiahCompact,
  getSubtotal,
} from "./utils/format";
import { MATERIAL_STATUSES } from "./utils/validation";

const KPI_ITEMS = [
  {
    key: "totalNilai",
    label: "Total Nilai",
    icon: Wallet,
    span: "xl:col-span-2",
    emphasis: true,
  },
  { key: "totalMaterial", label: "Total Material", icon: Package },
  { key: "totalQty", label: "Total Qty", icon: Boxes },
];

export default function App() {
  const { materials, isLoading, error, addMaterial } = useMaterials();
  const table = useMaterialTable(materials);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalNilai = materials.reduce(
    (sum, item) => sum + getSubtotal(item),
    0,
  );
  const totalQty = materials.reduce((sum, item) => sum + item.qty, 0);

  const kpiValues = {
    totalNilai: formatRupiahCompact(totalNilai),
    totalMaterial: formatNumber(materials.length),
    totalQty: formatNumber(totalQty),
  };

  const kpiHints = {
    totalNilai: formatRupiah(totalNilai),
  };

  const kpiCharts = useMemo(() => {
    const byDate = [...materials].sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalNilai: byDate.map((item) => getSubtotal(item)),
      totalMaterial: MATERIAL_STATUSES.map(
        (status) => materials.filter((item) => item.status === status).length,
      ),
      totalQty: byDate.map((item) => Number(item.qty)),
    };
  }, [materials]);

  return (
    <AppLayout>
      <div className="grid flex-1 grid-cols-1 gap-4 grid-rows-[auto_auto_auto_auto_1fr] sm:grid-cols-2 sm:grid-rows-[auto_auto_1fr] xl:grid-cols-4 xl:grid-rows-[auto_1fr]">
        {KPI_ITEMS.map((item) => (
          <KpiCard
            key={item.key}
            label={item.label}
            value={kpiValues[item.key]}
            hint={kpiHints[item.key]}
            chart={<MiniBars values={kpiCharts[item.key]} />}
            icon={item.icon}
            span={item.span}
            emphasis={item.emphasis}
          />
        ))}

        <CategoryDonutChart materials={materials} />

        <article className="flex min-h-56 min-w-0 flex-col rounded-card border border-line bg-surface p-5 shadow-card sm:col-span-2 xl:col-span-3">
          <DataTable
            rows={table.rows}
            isLoading={isLoading}
            search={table.search}
            onSearchChange={table.setSearch}
            page={table.page}
            totalPages={table.totalPages}
            onPageChange={table.goToPage}
            totalFiltered={table.totalFiltered}
            toolbar={
              <>
                <StatusFilter
                  value={table.statusFilter}
                  onChange={table.setStatusFilter}
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-field bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                  <Plus strokeWidth={2.2} className="size-4" />
                  Tambah
                </button>
              </>
            }
          />

          {error && (
            <p className="mt-3 rounded-field bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}
        </article>
      </div>

      {isModalOpen && (
        <MaterialFormModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={addMaterial}
        />
      )}
    </AppLayout>
  );
}
