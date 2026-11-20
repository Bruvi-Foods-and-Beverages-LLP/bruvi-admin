/**
 * Exact money display for amounts the backend computed in paise. The admin panel never
 * calculates prices or GST: it formats what the server's GST engine returned.
 */
export function formatPaise(paise: number | null | undefined): string {
  const p = Math.round(paise ?? 0);
  const sign = p < 0 ? "−" : "";
  const abs = Math.abs(p);
  return `${sign}₹${(abs / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** "5%", "2.5%". */
export function formatRate(rate: number): string {
  return Number.isInteger(rate) ? `${rate}%` : `${rate.toFixed(1)}%`;
}
