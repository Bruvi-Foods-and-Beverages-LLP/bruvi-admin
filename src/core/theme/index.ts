import { AppPalette, SemanticColors } from "./color";
import { AppFonts, AppTextStyle } from "./typography";
import { AppSpacing, AppRadius, AppElevation } from "./spacing";

export const BruviTheme = {
  palette: AppPalette,
  colors: SemanticColors,
  fonts: AppFonts,
  typography: AppTextStyle,
  spacing: AppSpacing,
  radius: AppRadius,
  elevation: AppElevation,
} as const;

export * from "./color";
export * from "./typography";
export * from "./spacing";

export default BruviTheme;

