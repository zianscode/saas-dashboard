export function formatRupiah(value) {
  return (
    new Intl.NumberFormat("id_ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value) || "Rp 0"
  );
}

export function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateCompact(value) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

export function getSubtotal(material) {
  return Number(material.qty) * Number(material.price)
}