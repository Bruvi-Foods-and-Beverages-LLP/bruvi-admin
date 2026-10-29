# BRUVI HQ ADMIN — DESIGN SYSTEM & GLOBAL THEMING SPECIFICATION

> **Document Location**: `bruvi_admin/theme.md`  
> **Source of Truth**: Figma Node `225:85136` (HQ Admin & ERP) & Node `225:41702` (Foundations)  
> **Parity Target**: 100% token conformance with `bruvi_mobile` design tokens  
> **Framework**: Next.js 16 (App Router) + Tailwind CSS v4 (`@theme`) + React 19  
> **Package**: `@bruvi/icons` (92 custom vector glyphs on a 24pt grid)

---

## 1. Executive Architecture & Pre-UI Design Checklist

Before creating or styling any new UI component, modal, table, or screen in Bruvi HQ Admin, **consult this document first**.

### Core Architecture Rules
1. **Never use raw ad-hoc hex values** (e.g. `#1c3a66` or `#ffffff`). Always consume semantic tokens (`text-primary`, `bg-surface-subtle`, `border-border`).
2. **Never install secondary icon packs** (e.g. FontAwesome, Material Icons, Feather). Use `@bruvi/icons` (or `@/components/icons`) for all Bruvi product glyphs and Lucide React only for auxiliary system tools.
3. **Follow the 4px Spacing Unit**: All margins, paddings, gaps, and control heights must be multiples of 4px (`s1` = 4px, `s2` = 8px, `s3` = 12px, `s4` = 16px, `s6` = 24px, `s8` = 32px).
4. **Use Soft Organic Elevation**: Do not use harsh black drop shadows. Use Bruvi navy-tinted elevation levels (`shadow-raised`, `shadow-floating`, `shadow-overlay`).
5. **Always Enforce Tabular Figures for Financials**: All INR ₹ currency amounts, live stock milligrams/milliliters, and prep timers must use tabular figures (`font-feature-settings: "tnum" 1` or class `.tnum`).

---

## 2. Color System & Design Tokens

### 2.1 Raw Palette Steps (`src/core/theme/color/palette.ts`)

| Token Name | Hex Code | Visual Swatch Role | Mobile Parity Token |
| :--- | :--- | :--- | :--- |
| **`navy-900`** | `#0F2340` | Deep Brand Navy (Titles, Dark Surfaces, High Contrast Text) | `AppPalette.navy900` |
| **`navy-800`** | `#1C3A66` | Primary Action Navy (Buttons, Active States) | `AppPalette.navy800` |
| **`navy-600`** | `#2F5690` | Active Focus Outline Stroke | `AppPalette.navy600` |
| **`navy-400`** | `#6F8DB5` | Subtle Navy Tint / Brand Accents | `AppPalette.navy400` |
| **`sky-500`** | `#A9D8F3` | Brand Sky (Primary Accent, Highlights, Active Badges) | `AppPalette.sky500` |
| **`sky-300`** | `#CDE9F9` | Focus Halo Ring, Inverse Secondary Text | `AppPalette.sky300` |
| **`sky-100`** | `#E8F5FD` | Surface Brand Ice (Subtle Accent Tint) | `AppPalette.sky100` |
| **`cream-100`**| `#F7F2E8` | Brand Warm Surface (Card highlights, Editorial Banners)| `AppPalette.cream100` |
| **`cream-300`**| `#EADFCB` | Warm Border / Separator | `AppPalette.cream300` |
| **`coffee-700`**| `#6B4430`| Signature Category Coffee Glyph & Tag | `AppPalette.coffee700` |
| **`coffee-500`**| `#9A6B4F`| Secondary Coffee Hue | `AppPalette.coffee500` |
| **`coffee-100`**| `#F3E8DF`| Soft Coffee Surface Pill | `AppPalette.coffee100` |
| **`matcha-700`**| `#566F2C`| Signature Category Matcha Glyph & Tag | `AppPalette.matcha700` |
| **`matcha-500`**| `#8DAA57`| Secondary Matcha Hue | `AppPalette.matcha500` |
| **`matcha-100`**| `#EBF1DE`| Soft Matcha Surface Pill | `AppPalette.matcha100` |

### 2.2 Neutral Grays Scale

| Token Name | Hex Code | Primary UI Purpose |
| :--- | :--- | :--- |
| **`white`** | `#FFFFFF` | Card surfaces, modal backgrounds, input fields |
| **`gray-50`** | `#F5F7FA` | App background subtle canvas, hover table states |
| **`gray-100`** | `#EBEFF4` | Inactive segmented controls, skeleton base |
| **`gray-200`** | `#DCE2EA` | Standard subtle borders, table horizontal dividers |
| **`gray-300`** | `#BCC6D3` | Input borders, stronger container bounds |
| **`gray-400`** | `#7F8CA0` | Placeholder text, disabled icon stroke |
| **`gray-500`** | `#64738A` | Secondary metadata text |
| **`gray-600`** | `#55647A` | Muted captions, overline section headers |
| **`gray-700`** | `#3F4B5E` | Secondary body text, table cell subheadings |
| **`gray-900`** | `#18202C` | Deep neutral text, toast background |

### 2.3 Semantic Roles & Tailwind v4 Utilities

Use these utility classes directly in your JSX:

```tsx
// Surfaces
<div className="bg-background text-text" />          // #FFFFFF text #0F2340
<div className="bg-background-subtle" />              // #F5F7FA canvas
<div className="bg-surface-brand" />                 // #E8F5FD brand sky tint
<div className="bg-surface-warm" />                  // #F7F2E8 cream tint
<div className="bg-surface-inverse text-white" />    // #0F2340 dark container

// Typography
<h1 className="text-text font-bold" />               // Primary #0F2340
<p className="text-text-secondary" />                // Secondary #3F4B5E
<span className="text-text-muted" />                 // Caption #55647A

// Actions & Borders
<button className="bg-primary hover:bg-primary-pressed text-white" />
<input className="border border-border-input focus:ring-2 focus:ring-focus" />

// Status & Feedback
<span className="bg-success-surface text-success" /> // #E3F4EA with #1F7A4D
<span className="bg-warning-surface text-warning" /> // #FDF0D8 with #9A5B00
<span className="bg-error-surface text-error" />     // #FCE8E6 with #C0352B
<span className="bg-info-surface text-info" />       // #E4F0FA with #22629E

// Categories
<span className="bg-category-coffee-surface text-category-coffee" />
<span className="bg-category-matcha-surface text-category-matcha" />
```

---

## 3. Typography Scale & Hierarchies

### 3.1 Font Families (`src/core/theme/typography/fonts.ts`)

> [!IMPORTANT]
> **Strict Local Font Rule**: Only font files located in `/public/fonts/` (`Archivo`, `Libre_Caslon_Text`, `Manrope`) are permitted. External Google Font links or CDN imports are strictly prohibited.

| Role | Font Family & Source | Local Asset Path | Mobile Parity Token | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display**| Archivo Variable (`wdth: 100-125, wght: 100-900`) | `/public/fonts/Archivo/Archivo-VariableFont_wdth,wght.ttf` | `AppFonts.archivo` | Page titles (`Stores`), financial prices, timers |
| **Serif** | Libre Caslon Text | `/public/fonts/Libre_Caslon_Text/LibreCaslonText-*.ttf` | `AppFonts.libreCaslonText`| Overlines (`OPERATIONS · NETWORK`), editorial tags |
| **Sans** | Manrope Variable (`wght: 200-800`) | `/public/fonts/Manrope/Manrope-VariableFont_wght.ttf` | `AppFonts.manrope` | Core UI, buttons, inputs, table cells, metadata |

### 3.2 Typography Tokens & Font Variations

| CSS Class | Font | Size / Line-Height | Weight & Variations | Letter Spacing | Figma Style Equivalent |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`.text-display-l`** | Archivo | `56px` / `58px` | `wght 900, wdth 125` | `-1.68px` | `display-l/Archivo Black 125%` |
| **`.text-display-m`** | Archivo | `40px` / `44px` | `wght 900, wdth 125` | `-1.2px` | `display-m/Archivo Black 125%` |
| **`.text-display-s`** | Archivo | `32px` / `38px` | `wght 900, wdth 125` | `-0.96px` | `display-s/Archivo Black 125%` (Page Titles) |
| **`.text-price-l`** | Archivo | `32px` / `38px` | `wght 800, wdth 112, tnum` | `-0.96px` | `price-l/Archivo ExtraBold 112%` |
| **`.text-price-m`** | Archivo | `24px` / `32px` | `wght 800, wdth 112, tnum` | `-0.72px` | `price-m/Archivo ExtraBold 112%` |
| **`.text-price-s`** | Archivo | `16px` / `24px` | `wght 800, wdth 112, tnum` | `-0.48px` | `price-s/Archivo ExtraBold 112%` |
| **`.text-price-xs`** | Archivo | `14px` / `20px` | `wght 800, wdth 112, tnum` | `-0.42px` | `price-xs/Archivo ExtraBold 112%` |
| **`.text-overline-l`**| Libre Caslon | `12px` / `16px` | `wght 400`, uppercase | `+1.68px` | `overline-l/Libre Caslon Regular` |
| **`.text-overline`** | Libre Caslon | `11px` / `14px` | `wght 400`, uppercase | `+1.54px` | `overline/Libre Caslon Regular` |
| **`.text-heading-l`** | Manrope | `32px` / `38px` | `wght 800` | `-0.48px` | `heading-l/Manrope ExtraBold` |
| **`.text-heading-m`** | Manrope | `24px` / `32px` | `wght 800` | `-0.36px` | `heading-m/Manrope ExtraBold` |
| **`.text-heading-s`** | Manrope | `20px` / `28px` | `wght 700` | `-0.30px` | `heading-s/Manrope Bold` |
| **`.text-title`** | Manrope | `18px` / `26px` | `wght 700` | `normal` | `title/Manrope Bold` |
| **`.text-body`** | Manrope | `16px` / `24px` | `wght 400` | `normal` | `body/Manrope Regular` |
| **`.text-body-s`** | Manrope | `14px` / `20px` | `wght 400` | `normal` | `body-s/Manrope Regular` |
| **`.text-label`** | Manrope | `14px` / `20px` | `wght 700` | `normal` | `label/Manrope Bold` |
| **`.text-label-semi`**| Manrope | `14px` / `20px` | `wght 600` | `normal` | `label-semi/Manrope SemiBold` |
| **`.text-caption`** | Manrope | `12px` / `16px` | `wght 500` | `normal` | `caption/Manrope Medium` |
| **`.text-caption-bold`**| Manrope| `12px` / `16px` | `wght 700` | `normal` | `caption/Manrope Bold` |

---

## 4. Spacing, Elevation & Corner Radii

### 4.1 4px Spacing Unit Scale (`src/core/theme/spacing/spacing.ts`)

| Token | Pixels | Application |
| :--- | :--- | :--- |
| `half` | `2px` | Micro badge padding, focus ring offsets |
| `s1` | `4px` | Base unit, tag padding, icon-text gap |
| `s2` | `8px` | Button horizontal padding, stack small gap |
| `s3` | `12px` | Input internal padding, card item gap |
| `s4` | `16px` | Standard card internal padding (`p-4`), modal margin |
| `s5` | `20px` | Medium padding |
| `s6` | `24px` | Section padding, container gutters |
| `s8` | `32px` | Large section spacing |
| `s12` | `48px` | Minimum touch/click hit target for icon buttons |

### 4.2 Corner Radii Scale (`src/core/theme/spacing/radius.ts`)

```css
--radius-xs: 4px;   /* Small status tags, micro badges */
--radius-sm: 8px;   /* Table row selections, small chips */
--radius-md: 12px;  /* Standard buttons, input fields, thumbnails */
--radius-lg: 16px;  /* Product cards, containers, KPI tiles */
--radius-xl: 24px;  /* Modals, drawer sheets, command palette */
--radius-xxl: 32px; /* Kiosk panels, large floating shells */
--radius-pill: 9999px; /* Status pills, avatar circles, filter tags */
```

### 4.3 Soft Navy Drop Shadows (`src/core/theme/spacing/elevation.ts`)

* **Raised** (`shadow-raised`):
  `0 1px 2px rgba(15, 35, 64, 0.06), 0 2px 8px rgba(15, 35, 64, 0.06)`  
  *Usage*: Product cards, order table rows, KPI summaries.
* **Floating** (`shadow-floating`):
  `0 4px 12px rgba(15, 35, 64, 0.08), 0 12px 32px rgba(15, 35, 64, 0.08)`  
  *Usage*: Store switcher dropdowns, notification menus, toasts.
* **Overlay** (`shadow-overlay`):
  `0 8px 24px rgba(15, 35, 64, 0.12), 0 24px 64px rgba(15, 35, 64, 0.16)`  
  *Usage*: Modal dialogs (AS05 session timeout), ⌘K command menu, slide-over sheets.

---

## 5. Iconography System (`@bruvi/icons`)

All icons sit on a strict **24-point vector grid** with **1.75 stroke width**, **round caps**, and **round joins**. Assets are local SVGs located in `packages/bruvi-icons/assets/svg/` (zero external network dependencies).

### 5.1 Standard Sizes

| Size Name | Dimension | Purpose |
| :--- | :--- | :--- |
| `inline` | `16px` | Inside table badges, trailing dropdown arrows, inline tags |
| `button` | `20px` | Inside standard buttons, input leading icons |
| `regular` | `24px` | Default standalone icons, navigation items |
| `kiosk` | `32px` | KDS headers, large status illustrations |
| `empty` | `48px` | Empty state illustrations, error boundary headers |

### 5.2 Usage in Code

```tsx
// 1. Generic Dynamic Icon Component
import { BruviIcon } from "@/components/icons";

<BruviIcon name="phin" size="regular" categoryColor />
<BruviIcon name="cart" size="button" filled={true} semanticLabel="Shopping Cart" />

// 2. Direct Named React Components
import { PhinIcon, BeanIcon, LeafIcon, StoreIcon, WarehouseIcon, WordmarkIcon } from "@/components/icons";

<PhinIcon size={24} />
<BeanIcon size={20} />
<LeafIcon size={20} />
<WordmarkIcon size={32} />

// 3. Accessible Icon Button (Enforces 48px hit target)
import { BruviIconButton } from "@/components/icons";

<BruviIconButton
  icon="profile"
  semanticLabel="User Profile"
  onClick={() => openProfile()}
/>
```

### 5.3 Category Coloring
* Glyphs `phin`, `bean`, and `coffee` automatically inherit the coffee brand color (`#6B4430`) when `categoryColor` is enabled.
* Glyph `leaf` inherits the matcha brand color (`#566F2C`).
* All other glyphs inherit `currentColor` from the surrounding text.

---

## 6. Global Widgets & Reusable Components Reference

| Component | Path | Key Props | Figma Token Mapping |
| :--- | :--- | :--- | :--- |
| **`Button`** | `src/components/ui/button.tsx` | `variant` (default, destructive, outline, secondary, ghost, link), `size` (default, sm, lg, icon) | `bg-primary`, `rounded-md`, `h-9 px-4` |
| **`Badge`** | `src/components/ui/badge.tsx` | `variant` (default, success, warning, destructive, outline, brand) | `rounded-full`, `px-2.5 py-0.5`, `text-xs font-semibold` |
| **`Card`** | `src/components/ui/card.tsx` | Subcomponents: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | `rounded-xl`, `border-border`, `bg-white`, `shadow-raised` |
| **`Input`** | `src/components/ui/input.tsx` | Accessible standard form input | `h-9`, `border-border-input`, `focus:ring-primary`, `rounded-md` |
| **`Skeleton`** | `src/components/ui/skeleton.tsx` | Shimmer pulse placeholder for AS01 | `animate-pulse`, `bg-gray-200/80`, `rounded-md` |
| **`EmptyState`** | `src/components/feedback/empty-state.tsx` | `icon`, `title`, `description`, `actionLabel`, `onAction` | Figma AS02 empty table/list state |
| **`ErrorFallback`** | `src/components/feedback/error-fallback.tsx`| `error`, `reset`, `title`, `description` | Figma AS03 error recovery boundary |
| **`OfflineBanner`** | `src/components/feedback/offline-banner.tsx`| Global sticky warning | Figma AS06 offline/stale telemetry banner |
| **`SessionTimeoutModal`** | `src/components/feedback/session-timeout-modal.tsx` | Form preservation modal | Figma AS05 in-place credential re-auth |
| **`CommandMenu`** | `src/components/layout/command-menu.tsx` | Global `⌘K` palette | Quick navigation across all 18 domains |
| **`StoreSwitcher`** | `src/components/layout/store-switcher.tsx`| Outlet scope switcher | "All stores · 12" vs individual cafe |

---

## 7. Global Form System & Component Specification

All form controls in Bruvi HQ Admin are standardized via `@/components/ui/text-form-field`, `@/components/ui/input`, and `@/components/ui/checkbox`. No custom ad-hoc `<input>` styling should ever be written in screen files.

### 7.1 Form Field Geometry & Figma Token Spec (`Figma 225:85481 / 225:85500`)

| Property | Token / CSS Spec | Value | Notes |
| :--- | :--- | :--- | :--- |
| **Control Height** | `spacing/control-input` | `52px` | Standard touch & click target across all admin forms |
| **Border Radius** | `radius/input` | `12px` | Soft rounded corners matching mobile design |
| **Padding** | `padding` | `px-[18px]` | Generous horizontal inset for optical text balance |
| **Idle Border** | `color/border-input` | `1.5px solid #7F8CA0` | Crisp gray-400 stroke |
| **Focus Border & Halo** | `color/focus` + `color/shadow-focus` | `border: 2px solid #2F5690`<br>`box-shadow: 0 0 0 4px #CDE9F9` | Signature Bruvi sky-300 ambient focus ring |
| **Error Border & Halo** | `color/error` + `color/error-surface` | `border: 2px solid #C0352B`<br>`box-shadow: 0 0 0 4px #FCE8E6` | High-visibility accessible error state |
| **Input Typography** | `body/Manrope Regular` | `16px` (`text-[16px]`), `leading-6`, `#0F2340` | Optical clarity at reading distance |
| **Label Typography** | `label/Manrope Bold` | `14px` (`text-[14px]`), `leading-5`, `#0F2340` | Spaced 8px above control |
| **Helper / Error** | `caption/Manrope Medium` | `12px` (`text-[12px]`), `leading-4`, `#7F8CA0` / `#C0352B` | Inline micro-feedback below control |

### 7.2 Usage Example: `TextFormField`

```tsx
import { TextFormField } from "@/components/ui/text-form-field";

// 1. Standard Text Field
<TextFormField
  label="Work email"
  placeholder="name@bruvi.coffee"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>

// 2. Password Field with Auto Eye Visibility Toggle & Header Action
<TextFormField
  label="Password"
  isPassword
  placeholder="••••••••••••••"
  labelRight={
    <a href="/forgot-password" className="text-primary underline hover:text-navy-600">
      Forgot password?
    </a>
  }
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={passwordError}
/>
```

### 7.3 Usage Example: Custom `Checkbox` (`Figma 225:85516`)

```tsx
import { Checkbox } from "@/components/ui/checkbox";

<Checkbox
  checked={rememberDevice}
  onCheckedChange={setRememberDevice}
  title="Remember this device"
  description="Keeps your email filled in. Don’t tick on shared store PCs."
/>
```

---

## 8. Developer How-To: Designing a New Screen

When tasked with implementing any of the 124 screens:
1. **Check `theme.md` for tokens**: Confirm the typography level (`titleM`, `bodyS`, etc.) and semantic color roles needed.
2. **Import icons from `@/components/icons`**: Pick the exact glyph from the 92 Bruvi icons list.
3. **Handle Resilience States**:
   * Wrap table bodies in `<Suspense fallback={<LoadingSkeleton />}>` (AS01).
   * Provide an `<EmptyState />` for zero-result states (AS02).
   * Handle errors using `<ErrorFallback />` (AS03).
4. **Format Currency & Dates**:
   ```tsx
   import { formatINR, formatDateTime } from "@/lib/utils/formatters";

   formatINR(2450.50); // "₹2,450.50"
   formatINR(1500000, { compact: true }); // "₹15.00 L"
   formatDateTime(order.createdAt, "short"); // "Oct 28, 11:30 AM"
   ```

