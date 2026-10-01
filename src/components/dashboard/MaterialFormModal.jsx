import { useEffect, useRef, useState } from "react";
import { AlertCircle, X } from "lucide-react";
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

const FIELD_ERRORS = {
  materialName: "material-name",
  category: "material-category",
  unit: "material-unit",
  qty: "material-qty",
  price: "material-price",
  status: "material-status",
};

const BASE_STYLE =
  "w-full rounded-field border bg-surface px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500";

const LABEL_STYLE = "mb-1.5 block text-xs font-medium text-ink-600";

function getInputStyle(hasError) {
  return `${BASE_STYLE} ${hasError ? "border-red-400" : "border-line"}`;
}

function Field({ label, error, htmlFor, required = false, children }) {
  return (
    <div>
      <label className={LABEL_STYLE} htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function MaterialFormModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const scrollRef = useRef(null);

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

  function focusFirstError(validationErrors) {
    const firstField = Object.keys(FIELD_ERRORS).find(
      (field) => validationErrors[field],
    );

    if (!firstField) return;

    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(FIELD_ERRORS[firstField])?.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const { isValid, errors: validationErrors } = validateMaterial(form);

    if (!isValid) {
      setErrors(validationErrors);
      focusFirstError(validationErrors);
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

  const fieldErrorList = Object.entries(errors).filter(
    ([field]) => FIELD_ERRORS[field],
  );

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

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4"
          >
            {fieldErrorList.length > 0 && (
              <div
                role="alert"
                className="flex gap-2 rounded-field bg-red-50 px-3 py-2.5"
              >
                <AlertCircle
                  strokeWidth={1.9}
                  className="mt-px size-4 shrink-0 text-red-600"
                />
                <div className="text-xs text-red-700">
                  <p className="font-medium">
                    {fieldErrorList.length} field perlu diperbaiki
                  </p>
                  <ul className="mt-1 list-inside list-disc space-y-0.5">
                    {fieldErrorList.map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <Field
              label="Nama Material"
              error={errors.materialName}
              htmlFor="material-name"
              required
            >
              <input
                id="material-name"
                type="text"
                value={form.materialName}
                onChange={handleChange("materialName")}
                placeholder="Contoh: Semen Portland 40kg"
                maxLength={80}
                aria-invalid={Boolean(errors.materialName)}
                aria-describedby={
                  errors.materialName ? "material-name-error" : undefined
                }
                className={getInputStyle(errors.materialName)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Kategori"
                error={errors.category}
                htmlFor="material-category"
                required
              >
                <select
                  id="material-category"
                  value={form.category}
                  onChange={handleChange("category")}
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={
                    errors.category ? "material-category-error" : undefined
                  }
                  className={getInputStyle(errors.category)}
                >
                  <option value="">Pilih kategori</option>
                  {MATERIAL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Unit" error={errors.unit} htmlFor="material-unit">
                <input
                  id="material-unit"
                  type="text"
                  value={form.unit}
                  onChange={handleChange("unit")}
                  placeholder="sak, lonjor, box"
                  maxLength={20}
                  aria-invalid={Boolean(errors.unit)}
                  aria-describedby={
                    errors.unit ? "material-unit-error" : undefined
                  }
                  className={getInputStyle(errors.unit)}
                />
              </Field>

              <Field
                label="Qty"
                error={errors.qty}
                htmlFor="material-qty"
                required
              >
                <input
                  id="material-qty"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={form.qty}
                  onChange={handleChange("qty")}
                  placeholder="0"
                  aria-invalid={Boolean(errors.qty)}
                  aria-describedby={
                    errors.qty ? "material-qty-error" : undefined
                  }
                  className={getInputStyle(errors.qty)}
                />
              </Field>

              <Field
                label="Harga Satuan"
                error={errors.price}
                htmlFor="material-price"
                required
              >
                <input
                  id="material-price"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={form.price}
                  onChange={handleChange("price")}
                  placeholder="0"
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={
                    errors.price ? "material-price-error" : undefined
                  }
                  className={getInputStyle(errors.price)}
                />
              </Field>

              <Field label="Tanggal" htmlFor="material-date">
                <input
                  id="material-date"
                  type="date"
                  value={form.date}
                  onChange={handleChange("date")}
                  className={getInputStyle(false)}
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
                  aria-invalid={Boolean(errors.status)}
                  aria-describedby={
                    errors.status ? "material-status-error" : undefined
                  }
                  className={getInputStyle(errors.status)}
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
              <p
                role="alert"
                className="rounded-field bg-red-50 px-3 py-2 text-xs text-red-700"
              >
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