import {
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Search,
  Table2,
} from "lucide-react";
import {
  formatDateCompact,
  formatNumber,
  formatRupiah,
  getSubtotal,
} from "../../utils/format";

const STATUS_STYLES = {
  Selesai: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Proses: "bg-brand-50 text-brand-700 ring-brand-600/20",
  Tertunda: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Dibatalkan: "bg-red-50 text-red-700 ring-red-600/20",
};

const FALLBACK_STATUS_STYLE = "bg-surface-muted text-ink-600 ring-line";

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        STATUS_STYLES[status] ?? FALLBACK_STATUS_STYLE
      }`}
    >
      {status}
    </span>
  );
}

export default function DataTable({
  rows,
  isLoading,
  search,
  onSearchChange,
  page,
  totalPages,
  onPageChange,
  totalFiltered,
  toolbar,
}) {
  const hasRows = rows.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink-400">
            <Table2 strokeWidth={1.9} className="size-4" />
          </span>
          <div>
            <p className="text-xs font-medium text-ink-400">Data Material</p>
            <p className="mt-0.5 text-sm font-semibold text-ink-900 tabular-nums">
              {isLoading
                ? "Memuat data..."
                : `${formatNumber(totalFiltered)} material`}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          {toolbar}

          <label className="relative block w-full sm:w-56">
            <span className="sr-only">Cari material</span>
            <Search
              strokeWidth={1.9}
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari material..."
              className="w-full rounded-field border border-line bg-surface py-2 pr-3 pl-9 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500"
            />
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 flex flex-1 items-center justify-center rounded-field border border-dashed border-line text-sm text-ink-400">
          Memuat data material...
        </div>
      ) : totalFiltered === 0 ? (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-2 rounded-field border border-dashed border-line px-4 py-10 text-center">
          <PackageSearch strokeWidth={1.7} className="size-6 text-ink-400" />
          <p className="text-sm font-medium text-ink-600">
            Material tidak ditemukan
          </p>
          <p className="text-xs text-ink-400">
            {search
              ? `Tidak ada hasil untuk "${search}"`
              : "Belum ada data material"}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 hidden min-h-0 flex-1 overflow-auto rounded-field border border-line sm:block">
            <table className="w-full min-w-2xl border-collapse text-sm">
              <thead className="sticky top-0 bg-surface-muted text-left text-xs font-medium text-ink-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Material
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Qty
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Harga
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Total
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Tanggal
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-surface-muted"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-900">
                        {row.materialName}
                      </p>
                      <p className="text-xs text-ink-400">{row.category}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-600 tabular-nums">
                      {formatNumber(row.qty)} {row.unit}
                    </td>
                    <td className="px-4 py-3 text-ink-600 tabular-nums">
                      {formatRupiah(row.price)}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink-900 tabular-nums">
                      {formatRupiah(getSubtotal(row))}
                    </td>
                    <td className="px-4 py-3 text-ink-600 tabular-nums">
                      {formatDateCompact(row.date)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-4 min-h-0 flex-1 space-y-3 overflow-auto sm:hidden">
            {rows.map((row) => (
              <li key={row.id} className="rounded-field border border-line p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {row.materialName}
                    </p>
                    <p className="text-xs text-ink-400">{row.category}</p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div>
                    <dt className="text-ink-400">Qty</dt>
                    <dd className="text-ink-600 tabular-nums">
                      {formatNumber(row.qty)} {row.unit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-400">Harga</dt>
                    <dd className="text-ink-600 tabular-nums">
                      {formatRupiah(row.price)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-400">Total</dt>
                    <dd className="font-medium text-ink-900 tabular-nums">
                      {formatRupiah(getSubtotal(row))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-400">Tanggal</dt>
                    <dd className="text-ink-600 tabular-nums">
                      {formatDateCompact(row.date)}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
        <p className="text-xs text-ink-400 tabular-nums">
          {hasRows ? `Halaman ${page} dari ${totalPages}` : "—"}
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || !hasRows}
            aria-label="Halaman sebelumnya"
            className="grid size-8 place-items-center rounded-field border border-line text-ink-600 transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft strokeWidth={1.9} className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || !hasRows}
            aria-label="Halaman berikutnya"
            className="grid size-8 place-items-center rounded-field border border-line text-ink-600 transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight strokeWidth={1.9} className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
