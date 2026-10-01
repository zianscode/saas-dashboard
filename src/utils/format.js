export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatRupiahCompact(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export function formatDateCompact(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function getSubtotal(material) {
  return Number(material.qty) * Number(material.price);
}
