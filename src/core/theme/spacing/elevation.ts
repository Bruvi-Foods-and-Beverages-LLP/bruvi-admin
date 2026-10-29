/**
 * Elevation & Drop Shadows from Foundations — Tokens.
 * Uses navy-900 tint instead of harsh black for soft, organic depth.
 */
export const AppElevation = {
  // Raw shadow layers
  shadow1: "rgba(15, 35, 64, 0.06)",
  shadow2: "rgba(15, 35, 64, 0.08)",
  shadow3a: "rgba(15, 35, 64, 0.12)",
  shadow3b: "rgba(15, 35, 64, 0.16)",

  // Composed elevation levels
  raised: "0 1px 2px rgba(15, 35, 64, 0.06), 0 2px 8px rgba(15, 35, 64, 0.06)",
  floating: "0 4px 12px rgba(15, 35, 64, 0.08), 0 12px 32px rgba(15, 35, 64, 0.08)",
  overlay: "0 8px 24px rgba(15, 35, 64, 0.12), 0 24px 64px rgba(15, 35, 64, 0.16)",
} as const;

