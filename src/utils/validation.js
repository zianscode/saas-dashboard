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

export function validateMaterial(payload) {
  const errors = {};

  const name = String(payload.materialName ?? "").trim();
  if (!name) {
    errors.materialName = "Nama material wajib diisi";
  } else if (name.length < 3) {
    errors.materialName = "Nama material minimal 3 karakter";
  }

  if (!String(payload.category ?? "").trim()) {
    errors.category = "Kategori wajib diisi";
  }

  if (payload.qty === "" || payload.qty === null || payload.qty === undefined) {
    errors.qty = "Qty wajib diisi";
  } else if (Number.isNaN(Number(payload.qty))) {
    errors.qty = "Qty harus berupa angka";
  } else if (Number(payload.qty) <= 0) {
    errors.qty = "Qty harus lebih besar dari 0";
  }

  if (
    payload.price === "" ||
    payload.price === null ||
    payload.price === undefined
  ) {
    errors.price = "Harga wajib diisi";
  } else if (Number.isNaN(Number(payload.price))) {
    errors.price = "Harga harus berupa angka";
  } else if (Number(payload.price) <= 0) {
    errors.price = "Harga harus lebih besar dari 0";
  }

  if (!MATERIAL_STATUSES.includes(payload.status)) {
    errors.status = "Status tidak valid";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
