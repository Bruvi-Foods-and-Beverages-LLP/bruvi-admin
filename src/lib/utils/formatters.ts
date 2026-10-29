/**
 * Formats a numeric value into standard Indian Currency (INR ₹)
 * Supports full formatting or compact Lakhs/Crores notation.
 */
export function formatINR(
  amount: number,
  options?: { compact?: boolean; hideDecimals?: boolean }
): string {
  if (isNaN(amount)) return "₹0";

  const { compact = false, hideDecimals = false } = options || {};

  if (compact) {
    const abs = Math.abs(amount);
    if (abs >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (abs >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: hideDecimals ? 0 : 2,
    maximumFractionDigits: hideDecimals ? 0 : 2,
  }).format(amount);
}

/**
 * Format timestamp in IST (Asia/Kolkata)
 */
export function formatDateTime(
  dateInput: string | number | Date,
  formatStyle: "short" | "medium" | "timeOnly" = "medium"
): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  const timeZone = "Asia/Kolkata";

  if (formatStyle === "timeOnly") {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  }

  if (formatStyle === "short") {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone,
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

