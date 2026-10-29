# BRUVI HQ ADMIN & ERP PORTAL — MASTER SPECIFICATION

> **Document Location**: `bruvi_admin/GEMINI.md`  
> **Source of Truth**: Figma Node `225:85136` (HQ Admin & ERP) & Node `225:41702` (Foundations)  
> **Parity Target**: 100% token conformance with `bruvi_mobile` design tokens and mobile typography (`lib/core/theme/typography/`)  
> **Framework**: Next.js 16 (App Router) + Turbopack + Tailwind CSS v4 + React 19 + TypeScript 5.8  
> **Package**: `@bruvi/icons` (92 custom vector glyphs on a 24pt grid)  

---

## 1. System Overview & Executive Architecture

Bruvi HQ Admin is the mission-critical operations and ERP control center for the Bruvi Coffee ecosystem. It orchestrates real-time telemetry, store POS/KDS heartbeats, recipe Bill-of-Materials (BOM) inventory deductions in milligrams/milliliters, staff RBAC permissions, and multi-outlet supply dispatch.

### Core Architectural Rules
1. **Zero Ad-Hoc Styling**: Never use arbitrary hex codes (`#1c3a66`) or inline style overrides. Consume standardized theme tokens (`bg-primary`, `text-text-secondary`, `border-border`).
2. **Local Font Enforcement**: **STRICTLY FORBIDDEN** to import fonts from Google Fonts CDN, external URLs, or secondary webfonts. All typography must resolve to local `.ttf` assets in `/public/fonts/`.
3. **Typography Parity with Mobile**: Variable font axes (`wdth: 125, wght: 900` for titles, `wdth: 112, wght: 800` for prices) must match `bruvi_mobile` Flutter definitions identically.
4. **Zero-Data Initial Empty States**: Production interfaces must render pristine zero/empty states by default (`stores.length === 0`, count `0`, total `₹0`) accompanied by an explicit CTA button (`+ Add store`). Hardcoded mock data rows must never be bundled into default states.
5. **No Secondary Icon Packs**: Use `@bruvi/icons` (or `@/components/icons`) for Bruvi brand glyphs. Use `lucide-react` exclusively for generic system controls (Search, ChevronDown, Bell, Calendar, Plus, X).

---

## 2. Typography & Font System

### 2.1 Font Asset Directory (`/public/fonts/`)
The admin panel is configured via `next/font/local` in `src/core/theme/typography/fonts.ts` using only the local font assets:

```
public/fonts/
├── Archivo/
│   ├── Archivo-VariableFont_wdth,wght.ttf       <-- Display & Price Variable Font
│   └── Archivo-Italic-VariableFont_wdth,wght.ttf
├── Libre_Caslon_Text/
│   ├── LibreCaslonText-Regular.ttf             <-- Editorial Overlines & Taglines
│   ├── LibreCaslonText-Bold.ttf
│   └── LibreCaslonText-Italic.ttf
└── Manrope/
    └── Manrope-VariableFont_wght.ttf           <-- UI Body, Headings & Labels
```

### 2.2 Font Variables & Layout Integration
The fonts are loaded in `src/app/layout.tsx` and bound to CSS custom properties:
- `--font-archivo` ➔ `archivo.variable`
- `--font-libre-caslon` ➔ `libreCaslon.variable`
- `--font-manrope` ➔ `manrope.variable`

In `src/app/globals.css`, these map directly into the Tailwind v4 theme:
```css
@theme {
  --font-serif: var(--font-libre-caslon), "Libre Caslon Text", Georgia, serif;
  --font-sans: var(--font-manrope), "Manrope", system-ui, -apple-system, sans-serif;
  --font-display: var(--font-archivo), "Archivo", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}
```

### 2.3 Variable Font Variations (Direct Mobile Parity)
The mobile application (`bruvi_mobile/lib/core/theme/typography/app_text_style.dart`) defines explicit font variations:
```dart
const _archivoExpandedBlack = <FontVariation>[
  FontVariation('wdth', 125),
  FontVariation('wght', 900),
];

const _archivoPrice = <FontVariation>[
  FontVariation('wdth', 112),
  FontVariation('wght', 800),
];
```

In the admin panel, these are baked into semantic CSS classes in `src/app/globals.css` and TypeScript specs in `src/core/theme/typography/text-styles.ts`:

| CSS Utility Class | Font Family | Size / Line-Height | Weight / Variations | Letter Spacing | Figma Style Equivalent | Role & Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`.text-display-l`** | Archivo | `56px` / `58px` | `wght 900, wdth 125` | `-1.68px` | `display-l/Archivo Black 125%` | Major splash headers |
| **`.text-display-m`** | Archivo | `40px` / `44px` | `wght 900, wdth 125` | `-1.2px` | `display-m/Archivo Black 125%` | Modal hero headers |
| **`.text-display-s`** | Archivo | `32px` / `38px` | `wght 900, wdth 125` | `-0.96px` | `display-s/Archivo Black 125%` | **Page Titles (e.g. "Stores")** |
| **`.text-price-l`** | Archivo | `32px` / `38px` | `wght 800, wdth 112` | `-0.96px` | `price-l/Archivo ExtraBold 112%` | Large KPI stats, Totals |
| **`.text-price-m`** | Archivo | `24px` / `32px` | `wght 800, wdth 112` | `-0.72px` | `price-m/Archivo ExtraBold 112%` | Card Subtotal numbers |
| **`.text-price-s`** | Archivo | `16px` / `24px` | `wght 800, wdth 112` | `-0.48px` | `price-s/Archivo ExtraBold 112%` | List item prices |
| **`.text-price-xs`** | Archivo | `14px` / `20px` | `wght 800, wdth 112` | `-0.42px` | `price-xs/Archivo ExtraBold 112%` | Table row financial figures |
| **`.text-overline-l`**| Libre Caslon | `12px` / `16px` | `wght 400`, Caps | `+1.68px` | `overline-l/Libre Caslon Regular` | Section headers (`OPERATIONS · NETWORK`) |
| **`.text-overline`** | Libre Caslon | `11px` / `14px` | `wght 400`, Caps | `+1.54px` | `overline/Libre Caslon Regular` | Compact metadata badges |
| **`.text-heading-l`** | Manrope | `32px` / `38px` | `wght 800` | `-0.48px` | `heading-l/Manrope ExtraBold` | Large section headings |
| **`.text-heading-m`** | Manrope | `24px` / `32px` | `wght 800` | `-0.36px` | `heading-m/Manrope ExtraBold` | Drawer & panel titles |
| **`.text-heading-s`** | Manrope | `20px` / `28px` | `wght 700` | `-0.30px` | `heading-s/Manrope Bold` | Empty state titles, card headers |
| **`.text-title`** | Manrope | `18px` / `26px` | `wght 700` | `normal` | `title/Manrope Bold` | Card titles |
| **`.text-body`** | Manrope | `16px` / `24px` | `wght 400` | `normal` | `body/Manrope Regular` | Primary prose, modal body |
| **`.text-body-s`** | Manrope | `14px` / `20px` | `wght 400` | `normal` | `body-s/Manrope Regular` | Table data cells, hints |
| **`.text-label`** | Manrope | `14px` / `20px` | `wght 700` | `normal` | `label/Manrope Bold` | Form field labels, button text |
| **`.text-label-semi`**| Manrope | `14px` / `20px` | `wght 600` | `normal` | `label-semi/Manrope SemiBold` | Filter tab labels |
| **`.text-caption`** | Manrope | `12px` / `16px` | `wght 500` | `normal` | `caption/Manrope Medium` | Stat card labels, helper text |
| **`.text-caption-bold`**| Manrope | `12px` / `16px` | `wght 700` | `normal` | `caption/Manrope Bold` | Table header column titles |

---

## 3. Global Theme System & Color Tokens

### 3.1 Raw Color Palette
```tsx
navy-900: #0F2340   // Deep Brand Navy (Titles, Dark Sidebar, High-contrast text)
navy-800: #1C3A66   // Primary Action Navy (Buttons, Active Tabs)
navy-600: #2F5690   // Focus outlines
navy-400: #6F8DB5   // Subtle navy accent
sky-500:  #A9D8F3   // Brand Sky (Highlights, Active Badges)
sky-300:  #CDE9F9   // Focus Halo Ring
sky-100:  #E8F5FD   // Brand Ice surface tint
cream-100:#F7F2E8   // Warm card highlights
coffee-700:#6B4430  // Category Coffee glyph
matcha-700:#566F2C  // Category Matcha glyph
```

### 3.2 Neutral Grays Scale
```tsx
white:    #FFFFFF   // Surface white, cards, modals
gray-50:  #F5F7FA   // Subtle background canvas, search input fill, table header
gray-100: #EBEFF4   // Inactive segmented tabs, skeleton base
gray-200: #DCE2EA   // Standard container borders, table dividers
gray-300: #BCC6D3   // Input border, secondary button stroke
gray-400: #7F8CA0   // Placeholders, disabled icons
gray-500: #64738A   // Secondary metadata text
gray-600: #55647A   // Caption text, column headers, muted labels
gray-700: #3F4B5E   // Overline section tags
gray-900: #18202C   // High-contrast dark text
```

### 3.3 Semantic Color Tokens
```tsx
// Surfaces
bg-surface          // #FFFFFF
bg-bg-subtle        // #F5F7FA (Standard canvas)
bg-surface-brand    // #E8F5FD (Sky tint)
bg-error-surface    // #FCE8E6 (Needs attention tint)

// Text
text-text           // #0F2340 (Primary body & headings)
text-text-secondary // #3F4B5E (Overlines & secondary content)
text-text-muted     // #55647A (Captions & column titles)
text-error          // #C0352B (Needs attention, errors)
text-success        // #1F7A4D (Open status, positive delta)

// Status Badges
Open status:        bg-[#DCFCE7] text-[#15803D] (Green pill)
Busy mode:          bg-[#FEF3E2] text-[#B45309] (Amber pill)
Closed / Attention: bg-[#FEE2E2] text-[#B91C1C] (Red pill)
```

---

## 4. Spacing, Elevation & Geometric Standards

1. **4px Spacing Unit**:
   - `4px` (`gap-1`), `8px` (`gap-2`), `12px` (`gap-3`), `16px` (`gap-4`), `24px` (`gap-6`), `32px` (`gap-8`).
2. **Standard Element Heights**:
   - Control buttons, search inputs, dropdowns: **Exact `36px` (`h-9`)**.
   - Table column header row: **Exact `36px` (`h-9`)**.
   - Table data rows: **Exact `56px` (`h-14`)**.
   - Stats Cards: **Exact `106px` height**.
   - Top Bar: **Exact `64px` (`h-16`)**.
   - Sidebar Navigation Buttons: **Exact `32px` (`h-8`)**.
3. **Corner Radii**:
   - `rounded-[12px]`: Buttons, inputs, search bar, dropdown popovers.
   - `rounded-[16px]`: Stats cards, data table containers, main surface cards.
   - `rounded-[20px]`: Modal dialogs.
   - `rounded-full`: Status dots, avatar pills.

---

## 5. Iconography System (`@bruvi/icons`)

All product glyphs originate from `packages/bruvi-icons/` and are re-exported via `@/components/icons`.
- Standardized on a 24-point grid with 1.75 stroke.
- Available Icons: `StoreIcon`, `WarehouseIcon`, `PhinIcon`, `BeanIcon`, `CoffeeIcon`, `LeafIcon`, `CartIcon`, `ReceiptIcon`, `WalletIcon`, `ScanQrIcon`, `TimerIcon`, `ShieldCheckIcon`, `GoogleWorkspaceIcon`, `EyeIcon`, `EyeOffIcon`, `CheckIcon`, `LockIcon`, `WordmarkIcon`, `WordmarkTaglineIcon`.

Auxiliary System Icons (from `lucide-react`):
- `Search`, `Calendar`, `Bell`, `ChevronDown`, `ChevronRight`, `Plus`, `X`, `Star`, `Download`, `Menu`, `LogOut`.

---

## 6. Reusable Component Guidelines & Architecture

### 6.1 Creating a New Component
Whenever introducing a new reusable component:
1. Locate the component inside `src/components/{domain}/` or `src/components/ui/`.
2. Follow strict TypeScript typing:
   - Always define an explicit `interface ComponentProps`.
   - Forward refs when wrapping interactive HTML elements (`React.forwardRef`).
   - Strip Next.js or React slot delegation props (`asChild`) so DOM warnings never trigger.
3. Consume the typography system:
   - Use the `.text-*` utility classes (`text-display-s`, `text-price-l`, `text-overline-l`, `text-body-s`, `text-label`, `text-caption`).
4. Ensure dark/light token adherence:
   - Never embed hardcoded colors (`#1c3a66`); use `bg-primary`, `border-border`, etc.

### 6.2 Standard Empty State Pattern
When rendering views with zero items (stores, orders, catalog products):
```tsx
<div className="py-16 px-6 flex flex-col items-center justify-center text-center">
  {/* Circular Icon Badge */}
  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f7fa] border border-[#dce2ea] text-[#55647A] mb-4">
    <IconComponent className="h-8 w-8 text-[#55647A]" />
  </div>

  {/* Heading */}
  <h3 className="text-heading-s text-[#0F2340]">
    {isEmpty ? "No items configured yet" : "No results match your filter"}
  </h3>

  {/* Description */}
  <p className="text-body-s text-[#55647A] max-w-md mt-1.5 mb-6 leading-relaxed">
    {descriptionText}
  </p>

  {/* Primary CTA */}
  <button className="h-9 px-5 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white flex items-center gap-2 transition-colors shadow-2xs cursor-pointer">
    <Plus className="h-4 w-4" />
    <span>Add Item</span>
  </button>
</div>
```

---

## 7. State Management & Data Layer

1. **Zustand Micro-Stores (`src/stores/`)**:
   - `useAppStore`: Global UI state (sidebar collapse, active store scope, command menu `⌘K`, offline banner status).
   - `useAuthStore`: Enterprise session state (JWT access token, refresh token, user profile, RBAC role).
   - `useStoresStore`: Store registry with `stores: []` initial empty state, local storage persistence, and action methods (`addStore`, `removeStore`, `loadDemoStores`).
2. **Next.js 16 Proxy Architecture (`src/proxy.ts`)**:
   - Replaces deprecated Next.js middleware conventions.
   - Inspects JWT cookies, redirects unauthenticated requests to `/login`, and validates RBAC authorization.
3. **Session Timeout & Offline Protection**:
   - **AS05**: Modal re-authentication preserving in-progress form state without page refresh.
   - **AS06**: Persistent offline banner warning when device disconnects from the HQ network.

---

## 8. Verification & Quality Gates

Before concluding any UI or feature turn, execute the following mandatory verification steps:
1. `cd bruvi_admin && pnpm type-check` ➔ Ensure 0 TypeScript errors.
2. `cd bruvi_admin && pnpm build` ➔ Ensure all static and dynamic App Router routes compile with zero warnings or errors.
3. **Visual Verification**: Navigate to the route using the Playwright browser tool, capture a CSS-scale screenshot, and inspect typography and dimensions against the target Figma node.

