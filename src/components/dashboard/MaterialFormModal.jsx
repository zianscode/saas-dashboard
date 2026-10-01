import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { formatRupiah, getSubtotal } from "../../utils/format";
import {
  MATERIAL_CATEGORIES,
  MATERIAL_STATUSES,
  validateMaterial,
} from "../../utils/validation";

const EMPTY_FORM = {
  materialName: "",
  category: "",
  qty: "",
  price: "",
  unit: "",
  date: new Date().toISOString().slice(0, 10),
  status: "Proses",
};

const INPUT_STYLE =
  "w-full rounded-field border border-line bg-surface px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500";

const LABEL_STYLE = "mb-1.5 block text-xs font-medium text-ink-600";

function Field({ label, error, htmlFor, children }) {
  return (
    <div>
      <label className={LABEL_STYLE} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function MaterialFormModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function handleChange(field) {
    return (event) => {
      const { value } = event.target;

      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => {
        if (!current[field]) return current;

        const next = { ...current };
        delete next[field];

        return next;
      });
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const { isValid, errors: validationErrors } = validateMaterial(form);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);

    try {
      await onSubmit(form);
      onClose();
    } catch (submitError) {
      setErrors({ form: submitError.message || "Gagal menyimpan material" });
      setIsSaving(false);
    }
  }

  const previewTotal = getSubtotal({
    qty: form.qty || 0,
    price: form.price || 0,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="material-form-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-card bg-surface shadow-float sm:rounded-card"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2
              id="material-form-title"
              className="text-base font-semibold text-ink-900"
            >
              Tambah Material
            </h2>
            <p className="mt-0.5 text-xs text-ink-400">
              Total dihitung otomatis dari qty x harga
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form material"
            className="grid size-8 shrink-0 place-items-center rounded-field text-ink-600 transition-colors hover:bg-surface-muted"
          >
            <X strokeWidth={1.9} className="size-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <Field
              label="Nama Material"
              error={errors.materialName}
              htmlFor="material-name"
            >
              <input
                id="material-name"
                type="text"
                value={form.materialName}
                onChange={handleChange("materialName")}
                placeholder="Contoh: Semen Portland 40kg"
                className={INPUT_STYLE}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Kategori"
                error={errors.category}
                htmlFor="material-category"
              >
                <select
                  id="material-category"
                  value={form.category}
                  onChange={handleChange("category")}
                  className={INPUT_STYLE}
                >
                  <option value="">Pilih kategori</option>
                  {MATERIAL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Unit" htmlFor="material-unit">
                <input
                  id="material-unit"
                  type="text"
                  value={form.unit}
                  onChange={handleChange("unit")}
                  placeholder="sak, lonjor, box"
                  className={INPUT_STYLE}
                />
              </Field>

              <Field label="Qty" error={errors.qty} htmlFor="material-qty">
                <input
                  id="material-qty"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={form.qty}
                  onChange={handleChange("qty")}
                  placeholder="0"
                  className={INPUT_STYLE}
                />
              </Field>

              <Field
                label="Harga Satuan"
                error={errors.price}
                htmlFor="material-price"
              >
                <input
                  id="material-price"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={form.price}
                  onChange={handleChange("price")}
                  placeholder="0"
                  className={INPUT_STYLE}
                />
              </Field>

              <Field label="Tanggal" htmlFor="material-date">
                <input
                  id="material-date"
                  type="date"
                  value={form.date}
                  onChange={handleChange("date")}
                  className={INPUT_STYLE}
                />
              </Field>

              <Field
                label="Status"
                error={errors.status}
                htmlFor="material-status"
              >
                <select
                  id="material-status"
                  value={form.status}
                  onChange={handleChange("status")}
                  className={INPUT_STYLE}
                >
                  {MATERIAL_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-field bg-surface-muted px-3 py-2.5">
              <span className="text-xs font-medium text-ink-600">Total</span>
              <span className="text-sm font-semibold text-ink-900 tabular-nums">
                {formatRupiah(previewTotal)}
              </span>
            </div>

            {errors.form && (
              <p className="rounded-field bg-red-50 px-3 py-2 text-xs text-red-700">
                {errors.form}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-field border border-line px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-muted"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-field bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
