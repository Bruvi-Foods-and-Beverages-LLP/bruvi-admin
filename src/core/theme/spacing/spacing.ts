/**
 * Layout & Spacing tokens from Foundations — Space & shape.
 * Based on strict 4px grid (`unit = 4`).
 */
export const AppSpacing = {
  unit: 4,
  half: 2,
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s10: 40,
  s12: 48,
  s16: 64,
  s20: 80,
  s24: 96,

  // Stack Gaps
  stackXs: 4,
  stackSm: 8,
  stackMd: 12,
  stackLg: 24,
  stackXl: 48,

  // Card & Container Insets
  insetCard: 16,
  insetHero: 24,
  insetModal: 24,

  // Control Heights
  controlSm: 32,
  controlMd: 40,
  controlInput: 44,
  controlLg: 48,

  // Interactive Icon Sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 48,

  // Helper step calculator
  step: (multiplier: number) => multiplier * 4,
} as const;

