import localFont from "next/font/local";

/**
 * BRUVI ENTERPRISE FONT CONFIGURATION
 * 
 * STRICT ARCHITECTURAL RULE:
 * Only local fonts stored in `/public/fonts/` are permitted.
 * External CDN or ad-hoc Google Fonts are strictly forbidden.
 * 
 * Font Assets:
 * 1. Archivo Variable Font (wdth: 100–125, wght: 100–900)
 * 2. Libre Caslon Text (Regular 400, Bold 700, Italic 400)
 * 3. Manrope Variable Font (wght: 200–800)
 */

export const archivo = localFont({
  src: [
    {
      path: "../../../../public/fonts/Archivo/Archivo-VariableFont_wdth,wght.ttf",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Archivo/Archivo-Italic-VariableFont_wdth,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
});

export const libreCaslon = localFont({
  src: [
    {
      path: "../../../../public/fonts/Libre_Caslon_Text/LibreCaslonText-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Libre_Caslon_Text/LibreCaslonText-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Libre_Caslon_Text/LibreCaslonText-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-libre-caslon",
  display: "swap",
});

export const manrope = localFont({
  src: [
    {
      path: "../../../../public/fonts/Manrope/Manrope-VariableFont_wght.ttf",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});

export const AppFonts = {
  manrope: "var(--font-manrope), 'Manrope', system-ui, -apple-system, sans-serif",
  archivo: "var(--font-archivo), 'Archivo', sans-serif",
  libreCaslonText: "var(--font-libre-caslon), 'Libre Caslon Text', Georgia, serif",

  // Aliases matching UI semantic roles
  sans: "var(--font-manrope), 'Manrope', system-ui, -apple-system, sans-serif",
  display: "var(--font-archivo), 'Archivo', sans-serif",
  serif: "var(--font-libre-caslon), 'Libre Caslon Text', Georgia, serif",
} as const;
