import { AppFonts } from "./fonts";

export interface TextStyleSpec {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing?: string;
  fontVariationSettings?: string;
  fontFeatureSettings?: string;
  textTransform?: "uppercase" | "none";
  className: string;
}

/**
 * 1:1 Parity with `bruvi_mobile/lib/core/theme/typography/app_text_style.dart`
 * and Figma Foundations — Typography (Node 225:41702).
 */
export const AppTextStyle = {
  // --------------------------------------------------------------------------
  // 1. DISPLAY STYLES (Archivo with wdth: 125, wght: 900)
  // --------------------------------------------------------------------------
  displayL: {
    fontFamily: AppFonts.archivo,
    fontSize: "56px",
    lineHeight: "58px",
    fontWeight: 900,
    letterSpacing: "-1.68px",
    fontVariationSettings: "'wdth' 125, 'wght' 900",
    className: "text-display-l",
  },
  displayM: {
    fontFamily: AppFonts.archivo,
    fontSize: "40px",
    lineHeight: "44px",
    fontWeight: 900,
    letterSpacing: "-1.2px",
    fontVariationSettings: "'wdth' 125, 'wght' 900",
    className: "text-display-m",
  },
  displayS: {
    fontFamily: AppFonts.archivo,
    fontSize: "32px",
    lineHeight: "38px",
    fontWeight: 900,
    letterSpacing: "-0.96px",
    fontVariationSettings: "'wdth' 125, 'wght' 900",
    className: "text-display-s",
  },
  orderNumber: {
    fontFamily: AppFonts.archivo,
    fontSize: "80px",
    lineHeight: "1",
    fontWeight: 900,
    letterSpacing: "-2.4px",
    fontVariationSettings: "'wdth' 125, 'wght' 900",
    className: "text-order-number",
  },
  kioskHero: {
    fontFamily: AppFonts.archivo,
    fontSize: "120px",
    lineHeight: "1",
    fontWeight: 900,
    letterSpacing: "-3.6px",
    fontVariationSettings: "'wdth' 125, 'wght' 900",
    className: "text-kiosk-hero",
  },

  // --------------------------------------------------------------------------
  // 2. PRICE STYLES (Archivo with wdth: 112 / 100, tabular figures)
  // --------------------------------------------------------------------------
  priceL: {
    fontFamily: AppFonts.archivo,
    fontSize: "32px",
    lineHeight: "38px",
    fontWeight: 800,
    letterSpacing: "-0.96px",
    fontVariationSettings: "'wdth' 112, 'wght' 800",
    fontFeatureSettings: "'tnum' 1",
    className: "text-price-l",
  },
  priceM: {
    fontFamily: AppFonts.archivo,
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: 800,
    letterSpacing: "-0.72px",
    fontVariationSettings: "'wdth' 112, 'wght' 800",
    fontFeatureSettings: "'tnum' 1",
    className: "text-price-m",
  },
  priceS: {
    fontFamily: AppFonts.archivo,
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: 800,
    letterSpacing: "-0.48px",
    fontVariationSettings: "'wdth' 112, 'wght' 800",
    fontFeatureSettings: "'tnum' 1",
    className: "text-price-s",
  },
  priceXs: {
    fontFamily: AppFonts.archivo,
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 800,
    letterSpacing: "-0.42px",
    fontVariationSettings: "'wdth' 112, 'wght' 800",
    fontFeatureSettings: "'tnum' 1",
    className: "text-price-xs",
  },
  priceButton: {
    fontFamily: AppFonts.archivo,
    fontSize: "18px",
    lineHeight: "24px",
    fontWeight: 800,
    letterSpacing: "-0.84px",
    fontVariationSettings: "'wdth' 100, 'wght' 800",
    fontFeatureSettings: "'tnum' 1",
    className: "text-price-button",
  },
  otpDigit: {
    fontFamily: AppFonts.archivo,
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: 800,
    letterSpacing: "-0.72px",
    fontVariationSettings: "'wdth' 100, 'wght' 800",
    fontFeatureSettings: "'tnum' 1",
    className: "text-otp-digit",
  },

  // --------------------------------------------------------------------------
  // 3. EDITORIAL & OVERLINE STYLES (Libre Caslon Text)
  // --------------------------------------------------------------------------
  overline: {
    fontFamily: AppFonts.libreCaslonText,
    fontSize: "11px",
    lineHeight: "14px",
    fontWeight: 400,
    letterSpacing: "1.54px",
    textTransform: "uppercase",
    className: "text-overline",
  },
  overlineL: {
    fontFamily: AppFonts.libreCaslonText,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: 400,
    letterSpacing: "1.68px",
    textTransform: "uppercase",
    className: "text-overline-l",
  },
  tagline: {
    fontFamily: AppFonts.libreCaslonText,
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 400,
    letterSpacing: "1.96px",
    className: "text-tagline",
  },

  // --------------------------------------------------------------------------
  // 4. HEADINGS & UI CONTENT (Manrope)
  // --------------------------------------------------------------------------
  headingL: {
    fontFamily: AppFonts.manrope,
    fontSize: "32px",
    lineHeight: "38px",
    fontWeight: 800,
    letterSpacing: "-0.48px",
    className: "text-heading-l",
  },
  headingM: {
    fontFamily: AppFonts.manrope,
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: 800,
    letterSpacing: "-0.36px",
    className: "text-heading-m",
  },
  headingS: {
    fontFamily: AppFonts.manrope,
    fontSize: "20px",
    lineHeight: "28px",
    fontWeight: 700,
    letterSpacing: "-0.3px",
    className: "text-heading-s",
  },
  title: {
    fontFamily: AppFonts.manrope,
    fontSize: "18px",
    lineHeight: "26px",
    fontWeight: 700,
    className: "text-title",
  },
  body: {
    fontFamily: AppFonts.manrope,
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: 400,
    className: "text-body",
  },
  bodyS: {
    fontFamily: AppFonts.manrope,
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 400,
    className: "text-body-s",
  },
  label: {
    fontFamily: AppFonts.manrope,
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 700,
    className: "text-label",
  },
  labelSemi: {
    fontFamily: AppFonts.manrope,
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 600,
    className: "text-label-semi",
  },
  labelButton: {
    fontFamily: AppFonts.manrope,
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: 700,
    className: "text-label-button",
  },
  caption: {
    fontFamily: AppFonts.manrope,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: 500,
    className: "text-caption",
  },
  captionBold: {
    fontFamily: AppFonts.manrope,
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: 700,
    className: "text-caption-bold",
  },
  buttonKiosk: {
    fontFamily: AppFonts.manrope,
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: 800,
    className: "text-button-kiosk",
  },
} as const;

export type AppTextStyleToken = keyof typeof AppTextStyle;
