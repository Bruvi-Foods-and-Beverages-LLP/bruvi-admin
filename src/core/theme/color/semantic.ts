import { AppPalette } from "./palette";

/**
 * Semantic colour roles.
 * UI components must consume these semantic tokens rather than raw hex codes.
 * Exact 1:1 match with Bruvi Mobile design tokens (`semantic_colors.dart`).
 */
export const SemanticColors = {
  // Surfaces & Backgrounds
  background: AppPalette.white,
  surface: AppPalette.white,
  backgroundSubtle: AppPalette.gray50,
  surfaceBrand: AppPalette.sky100,
  surfaceWarm: AppPalette.cream100,
  surfaceInverse: AppPalette.navy900,
  surfaceInverseRaised: AppPalette.surfaceInverseRaised,

  // Typography & Text
  text: AppPalette.navy900,
  textSecondary: AppPalette.gray700,
  textMuted: AppPalette.gray600,
  textInverse: AppPalette.white,
  textInverseSecondary: AppPalette.sky300,
  textBrand: AppPalette.navy800,

  // Borders & Dividers
  border: AppPalette.gray200,
  borderInput: AppPalette.gray300,
  borderStrong: AppPalette.gray400,

  // Actions & States
  primary: AppPalette.navy800,
  primaryPressed: AppPalette.navy900,
  accent: AppPalette.sky500,
  brandSky: AppPalette.sky500,
  onAccent: AppPalette.navy900,
  focus: AppPalette.navy600,
  focusHalo: AppPalette.sky300,

  // Category Colors (Beverages & Ingredients)
  categoryCoffee: AppPalette.coffee700,
  categoryCoffeeSurface: AppPalette.coffee100,
  categoryCoffeeSurfaceDark: AppPalette.coffeeSurfaceDark,
  categoryMatcha: AppPalette.matcha700,
  categoryMatchaSurface: AppPalette.matcha100,
  categoryMatchaSurfaceDark: AppPalette.matchaSurfaceDark,

  // Status & Feedback Roles
  success: AppPalette.successGreen,
  successSurface: AppPalette.successSurface,
  successOnDark: AppPalette.successOnDark,
  successOnDarkSurface: AppPalette.successOnDarkSurface,
  warning: AppPalette.warningAmber,
  warningSurface: AppPalette.warningSurface,
  error: AppPalette.errorRed,
  errorSurface: AppPalette.errorSurface,
  info: AppPalette.infoBlue,
  infoSurface: AppPalette.infoSurface,
  favorite: AppPalette.favoriteRed,
  onDestructive: AppPalette.white,
  onError: AppPalette.white,

  // Scrim & Overlays
  scrim: AppPalette.scrim,
  track: AppPalette.track,
  surfaceToast: AppPalette.gray900,
  onToast: AppPalette.white,
} as const;

export type SemanticColorRole = keyof typeof SemanticColors;

