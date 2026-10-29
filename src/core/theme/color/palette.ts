/**
 * Raw palette steps from Foundations — Colour.
 * Exact 1:1 match with Bruvi Mobile design tokens (`palette_scale.dart`).
 *
 * Primary starred brand steps:
 * - navy800 (#1C3A66) / navy900 (#0F2340)
 * - sky500 (#A9D8F3) / sky100 (#E8F5FD)
 * - cream100 (#F7F2E8)
 * - coffee700 (#6B4430) / coffee500 (#9A6B4F)
 * - matcha700 (#566F2C) / matcha500 (#8DAA57)
 */
export const AppPalette = {
  // Brand Navy Scale
  navy400: "#6F8DB5",
  navy600: "#2F5690",
  navy800: "#1C3A66",
  navy900: "#0F2340",

  // Brand Sky (Accent) Scale
  sky100: "#E8F5FD",
  sky300: "#CDE9F9",
  sky500: "#A9D8F3",

  // Brand Cream (Warm Surface) Scale
  cream100: "#F7F2E8",
  cream300: "#EADFCB",

  // Category Coffee Scale
  coffee100: "#F3E8DF",
  coffee500: "#9A6B4F",
  coffee700: "#6B4430",

  // Category Matcha Scale
  matcha100: "#EBF1DE",
  matcha500: "#8DAA57",
  matcha700: "#566F2C",

  // Neutral Grays Scale
  white: "#FFFFFF",
  gray50: "#F5F7FA",
  gray100: "#EBEFF4",
  gray200: "#DCE2EA",
  gray300: "#BCC6D3",
  gray400: "#7F8CA0",
  gray500: "#64738A",
  gray600: "#55647A",
  gray700: "#3F4B5E",
  gray900: "#18202C",

  // Semantic Status Tokens
  favoriteRed: "#C0352B",
  successGreen: "#1F7A4D",
  successSurface: "#E3F4EA",
  successOnDark: "#7FD3A2",
  successOnDarkSurface: "rgba(127, 211, 162, 0.18)",
  warningAmber: "#9A5B00",
  warningSurface: "#FDF0D8",
  errorRed: "#C0352B",
  errorSurface: "#FCE8E6",
  infoBlue: "#22629E",
  infoSurface: "#E4F0FA",

  // Dark Surface Tones
  matchaSurfaceDark: "#1B2816",
  coffeeSurfaceDark: "#2A1E17",
  creamSurfaceDark: "#26211B",
  skySurfaceDark: "#152A47",

  // Alpha Overlays & Scrims
  scrim: "rgba(15, 35, 64, 0.56)", // Navy-900 at 56% for modal backdrops
  track: "rgba(15, 35, 64, 0.12)", // Navy-900 at 12% for progress bars & dividers
  surfaceInverseRaised: "rgba(255, 255, 255, 0.08)",

  // Brand Shortcuts
  navy: "#1C3A66",
  sky: "#A9D8F3",
  ice: "#E8F5FD",
  cream: "#F7F2E8",
  coffee: "#6B4430",
  matcha: "#566F2C",
} as const;

export type AppPaletteColor = keyof typeof AppPalette;

