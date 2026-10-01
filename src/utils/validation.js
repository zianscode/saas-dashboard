export const MATERIAL_STATUSES = [
  "Selesai",
  "Proses",
  "Tertunda",
  "Dibatalkan",
];

export const MATERIAL_CATEGORIES = [
  "Bahan Baku",
  "Baja",
  "Kayu",
  "Finishing",
  "Plumbing",
  "Listrik",
  "Dinding",
  "Kaca",
  "Lantai",
];

const MAX_NAME_LENGTH = 80;
const MAX_UNIT_LENGTH = 20;
const MAX_QTY = 1_000_000;
const MAX_PRICE = 100_000_000_000;

function readPositiveNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return { state: "empty" };
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return { state: "notNumber" };
  }

  if (parsed <= 0) {
    return { state: "notPositive" };
  }

  if (!Number.isInteger(parsed)) {
    return { state: "notInteger" };
  }

  return { state: "valid", value: parsed };
}

export function validateMaterial(payload) {
  const errors = {};

  const name = String(payload.materialName ?? "").trim();

  if (!name) {
    errors.materialName = "Nama material wajib diisi";
  } else if (name.length < 3) {
    errors.materialName = "Nama material minimal 3 karakter";
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.materialName = `Nama material maksimal ${MAX_NAME_LENGTH} karakter`;
  }

  const category = String(payload.category ?? "").trim();

  if (!category) {
    errors.category = "Kategori wajib diisi";
  } else if (!MATERIAL_CATEGORIES.includes(category)) {
    errors.category = "Kategori tidak valid";
  }

  const unit = String(payload.unit ?? "").trim();

  if (unit.length > MAX_UNIT_LENGTH) {
    errors.unit = `Unit maksimal ${MAX_UNIT_LENGTH} karakter`;
  }

  const qty = readPositiveNumber(payload.qty);

  if (qty.state === "empty") {
    errors.qty = "Qty wajib diisi";
  } else if (qty.state === "notNumber") {
    errors.qty = "Qty harus berupa angka";
  } else if (qty.state === "notPositive") {
    errors.qty = "Qty harus lebih besar dari 0";
  } else if (qty.state === "notInteger") {
    errors.qty = "Qty harus bilangan bulat";
  } else if (qty.value > MAX_QTY) {
    errors.qty = `Qty maksimal ${MAX_QTY.toLocaleString("id-ID")}`;
  }

  const price = readPositiveNumber(payload.price);

  if (price.state === "empty") {
    errors.price = "Harga wajib diisi";
  } else if (price.state === "notNumber") {
    errors.price = "Harga harus berupa angka";
  } else if (price.state === "notPositive") {
    errors.price = "Harga harus lebih besar dari 0";
  } else if (price.state === "notInteger") {
    errors.price = "Harga harus bilangan bulat";
  } else if (price.value > MAX_PRICE) {
    errors.price = "Harga melebihi batas maksimum";
  }

  if (!MATERIAL_STATUSES.includes(payload.status)) {
    errors.status = "Status tidak valid";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
