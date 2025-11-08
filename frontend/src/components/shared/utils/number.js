export function toNum(value, fallback = 0) {
    if (value === null || value === undefined) return fallback;
    const n = typeof value === "number"
      ? value
      : Number(String(value).replace(",", ".").trim());
    return Number.isFinite(n) ? n : fallback;
  }
  
  export function toInt(value, fallback = 0) {
    return Math.trunc(toNum(value, fallback));
  }
  
  export function addWithScale(a, b, scale = 3) {
    const f = 10 ** scale;
    return Math.round((toNum(a,0) * f + toNum(b,0) * f)) / f;
  }
  
  const fmt2 = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmt3 = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 3 });
  
  export function formatAmount(value, digits = 2) {
    const n = toNum(value);
    return (digits === 3 ? fmt3 : fmt2).format(n);
  }
  