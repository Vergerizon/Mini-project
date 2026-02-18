export function formatRupiah(value, { maximumFractionDigits = 0 } = {}) {
  if (value == null || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits,
  }).format(Math.round(num));
}

export default formatRupiah;
