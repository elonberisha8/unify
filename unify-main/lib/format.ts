/**
 * Deterministic number formatter — identical output on server and client.
 * Avoids React hydration mismatches caused by `toLocaleString()` reading
 * the OS locale at runtime.
 *
 * Format: grouping with "," and decimal "." (e.g. 12,480 / 7,200.50)
 * Use `formatCurrency` for money values.
 */
export function formatNumber(n: number, decimals = 0): string {
  if (!Number.isFinite(n)) return "0";
  const fixed = Math.abs(n).toFixed(decimals);
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sign = n < 0 ? "-" : "";
  return dec ? `${sign}${grouped}.${dec}` : `${sign}${grouped}`;
}

export function formatCurrency(n: number, currency = "€", decimals = 0): string {
  return `${currency}${formatNumber(n, decimals)}`;
}
