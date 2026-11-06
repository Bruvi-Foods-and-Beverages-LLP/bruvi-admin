/**
 * Enterprise Catalog API & UI Types
 * Aligned with Figma nodes 225:90240, 225:91211, and Supabase Schema
 */

export type PrepStation = "BAR" | "KITCHEN";
export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK" | "HIDDEN_IN_STORE";
export type StatusFilterOption = "ALL" | "ACTIVE" | "HIDDEN_IN_STORE" | "DRAFT" | "ARCHIVED" | "OUT_OF_STOCK";

export type ChannelFilterOption = "ALL" | "COUNTER" | "KIOSK" | "APP" | "QR";
export type ProductChannel = "COUNTER" | "KIOSK" | "APP" | "QR";
export type ModifierGroupType = "CHOICE" | "LEVEL" | "COUNT" | "TEXT";
export type AutoHiddenReason = "STOCKOUT" | "EQUIPMENT_FAILURE" | "MANUAL_STAFF" | "SCHEDULED_OFF";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  colorTheme?: string;
  bgColorTheme?: string;
  colorHex?: string;
  bgColorHex?: string;
  displayOrder: number;
  itemCount?: number;
  isActive?: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  priceDiffPaise: number;
  isDefault: boolean;
  isAvailable: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

/** How the customer app draws a group (Figma 225:61688). */
export type ModifierDisplayStyle =
  | "CARDS"
  | "TOGGLE"
  | "SEGMENTED"
  | "RADIO"
  | "CHECKBOX"
  | "STEPPER"
  | "TEXT";

export interface ModifierOption {
  id: string;
  name: string;
  sku?: string | null;
  pricePaise: number;
  isDefault: boolean;
  isAvailable: boolean;
  displayOrder: number;
  code?: string | null;
  /** Second line, e.g. "250 ml" */
  detail?: string | null;
  /** Units a customer can add (pumps 0–4); 1 for everything but steppers */
  maxQuantity?: number;
  calorieDelta?: number;
  /** Level groups: recipe quantity multiplier (×0 / 0.6 / 1 / 1.4) */
  recipeMultiplier?: number | null;
  /** Group revealed while this option is chosen (milk → milk amount) */
  nestedGroupId?: string | null;
  /** Share (0-100) of this group's picks that chose this option (detail endpoint only) */
  pickedPercent?: number;
}

/** A group as embedded in a product (product endpoints send the base fields only). */
export interface ModifierGroup {
  id: string;
  name: string;
  groupType: ModifierGroupType;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  displayOrder: number;
  customHint?: string | null;
  code?: string | null;
  displayStyle?: ModifierDisplayStyle;
  unitLabel?: string | null;
  /** Units that cost nothing (the first shot) */
  includedQuantity?: number;
  maxLength?: number | null;
  placeholder?: string | null;
  hint?: string | null;
  isActive?: boolean;
  /** Products using this group */
  productCount?: number;
  /** Options that reveal this group; non-empty = nested group */
  parentOptionIds?: string[];
  modifiers: ModifierOption[];
}

export interface LinkedProduct {
  id: string;
  name: string;
  imageUrl: string | null;
  defaultModifierId: string | null;
  hiddenModifierIds: string[];
}

/** Admin modifier endpoints (/admin/catalog/modifiers/groups[/:id]) send every field. */
export interface ModifierGroupDetail extends ModifierGroup {
  code: string | null;
  displayStyle: ModifierDisplayStyle;
  unitLabel: string | null;
  includedQuantity: number;
  maxLength: number | null;
  placeholder: string | null;
  hint: string | null;
  isActive: boolean;
  productCount: number;
  parentOptionIds: string[];
  metadata: Record<string, unknown>;
  /** Detail endpoint only */
  linkedProducts?: LinkedProduct[];
  updatedAt: string | null;
}

export interface ModifierGroupPayload {
  name?: string;
  code?: string | null;
  groupType?: ModifierGroupType;
  displayStyle?: ModifierDisplayStyle;
  minSelect?: number;
  maxSelect?: number;
  isRequired?: boolean;
  unitLabel?: string | null;
  includedQuantity?: number;
  maxLength?: number | null;
  placeholder?: string | null;
  hint?: string | null;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ModifierOptionPayload {
  name?: string;
  code?: string | null;
  detail?: string | null;
  pricePaise?: number;
  isDefault?: boolean;
  isAvailable?: boolean;
  displayOrder?: number;
  maxQuantity?: number;
  recipeMultiplier?: number | null;
  nestedGroupId?: string | null;
}

/** One group attached to a product, with that product's own settings */
export interface ProductModifierBinding {
  modifierGroupId: string;
  name: string;
  groupType: ModifierGroupType;
  displayStyle: ModifierDisplayStyle;
  displayOrder: number;
  defaultModifierId: string | null;
  hiddenModifierIds: string[];
  isRequiredOverride: boolean | null;
  maxSelectOverride: number | null;
  includedQuantityOverride: number | null;
  options: { id: string; name: string; isDefault: boolean }[];
}

export interface ModifierStockEntry {
  modifierId: string;
  isAvailable: boolean;
  reason: string | null;
  updatedAt?: string;
}

export interface StoreOverride {
  outletId: string;
  outletCode?: string;
  outletName?: string;
  city?: string;
  overridePricePaise?: number | null;
  isAvailable: boolean;
  autoHiddenReason?: string | null;
  channelCounter?: boolean;
  channelKiosk?: boolean;
  channelApp?: boolean;
  channelQr?: boolean;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
}

export interface CatalogProduct {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug?: string;
  categoryColor?: string;
  categoryBgColor?: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  fulfillmentType?: string;
  prepStation: PrepStation;
  basePricePaise: number;
  basePriceRupees: number;
  basePriceFormatted?: string;
  taxRatePercent: number;
  hsnCode?: string;
  isTaxInclusive: boolean;
  channelCounter: boolean;
  channelKiosk: boolean;
  channelApp: boolean;
  channelQr: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  containsDairy: boolean;
  containsNuts: boolean;
  containsGluten: boolean;
  isCaffeinated: boolean;
  caffeineMg?: number;
  status: ProductStatus;
  statusLabel?: string;
  statusTone?: "success" | "warning" | "neutral" | "error";
  isBestseller: boolean;
  isLabPilot: boolean;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  displayOrder: number;
  scheduledPricePaise?: number | null;
  scheduledPriceRupees?: number | null;
  scheduledPriceDate?: string | null;
  lastEditedByName?: string;
  createdAt: string;
  updatedAt: string;
  modifierGroupsCount?: number;
  estimatedCostPaise?: number;
  grossMarginPercent?: number;
  hiddenStoresCount?: number;
  subtitle?: string;
  modifierGroups?: ModifierGroup[];
  variants?: ProductVariant[];
  overrides?: StoreOverride[];
  margin?: {
    estimatedCostPaise: number;
    grossMarginPercent: number;
  };
}

export interface ProductDetail extends CatalogProduct {
  category?: {
    id: string;
    name: string;
    slug: string;
    colorTheme?: string;
    bgColorTheme?: string;
  };
  variants: ProductVariant[];
  modifierGroups: ModifierGroup[];
  modifierGroupIds: string[];
  storeIds: string[];
  overrides: StoreOverride[];
  readinessChecklist?: {
    basics: boolean;
    dietary: boolean;
    photo: boolean;
    recipe: boolean;
  };
  metadata?: Record<string, unknown>;
  margin?: {
    estimatedCostPaise: number;
    grossMarginPercent: number;
  };
}

export interface ProductCreatePayload {
  name: string;
  sku: string;
  categoryId: string;
  slug?: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  fulfillmentType?: string;
  prepStation?: PrepStation;
  basePricePaise: number;
  taxRatePercent?: number;
  hsnCode?: string;
  isTaxInclusive?: boolean;
  channelCounter?: boolean;
  channelKiosk?: boolean;
  channelApp?: boolean;
  channelQr?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  containsDairy?: boolean;
  containsNuts?: boolean;
  containsGluten?: boolean;
  isCaffeinated?: boolean;
  caffeineMg?: number;
  status?: ProductStatus;
  isBestseller?: boolean;
  isLabPilot?: boolean;
  imageUrl?: string | null;
  displayOrder?: number;
  scheduledPricePaise?: number | null;
  scheduledPriceDate?: string | null;
  modifierGroupIds?: string[];
  storeIds?: string[];
  metadata?: Record<string, unknown>;
}

export type ProductUpdatePayload = Partial<ProductCreatePayload>;

export type BulkActionPayload =
  | { action: "HIDE"; productIds: string[]; storeId?: string }
  | { action: "UNHIDE"; productIds: string[]; storeId?: string }
  | { action: "CHANGE_CATEGORY"; productIds: string[]; categoryId?: string; value?: string }
  | { action: "SET_STATUS"; productIds: string[]; status?: ProductStatus; value?: string }
  | { action: "CHANGE_STATUS"; productIds: string[]; status?: ProductStatus; value?: string }
  | { action: "ADJUST_PRICE"; productIds: string[]; priceDeltaPaise?: number; pricePercentage?: number }
  | { action: "DELETE"; productIds: string[] };

export interface UploadResult {
  url: string;
  thumbnailUrl: string;
  path: string;
  bucket: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface CategoryMetric {
  id?: string;
  name: string;
  slug: string;
  colorTheme?: string;
  bgColorTheme?: string;
  count: number;
  displayOrder: number;
}

export interface ProductListResponse {
  items: CatalogProduct[];
  products?: CatalogProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: CategoryMetric[];
  summary: {
    totalProducts: number;
    hiddenInStoreCount: number;
    draftCount: number;
  };
  counts: {
    all: number;
    active: number;
    hiddenInStore: number;
    draft: number;
    archived: number;
  };
}

export interface CatalogQueryFilters {
  search?: string;
  category?: string;
  status?: StatusFilterOption;
  channel?: ChannelFilterOption;
  prepStation?: "ALL" | "BAR" | "KITCHEN";
  outletId?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "sku" | "price" | "category" | "created_at" | "display_order";
  sortOrder?: "asc" | "desc";
}

/** Real sales performance for one product (GET /admin/catalog/products/:id/performance). */
export interface ProductPerformance {
  productId: string;
  scope: { outletIds: string[] | null; channel: string | null; label: "Network" | "Selected stores" };
  businessDate: string;
  soldToday: number;
  ordersToday: number;
  revenueTodayRupees: number;
  changePercent: number | null;
  comparisonLabel: string;
  categorySharePercent: number | null;
  series: Array<{ date: string; label: string; units: number; revenueRupees: number; isToday: boolean }>;
  margin: {
    percent: number | null;
    unitCostRupees: number | null;
    basis: "REALISED_30D" | "RECIPE_ESTIMATE" | "UNKNOWN";
    unitsSampled: number;
  };
  topStore: { outletId: string; name: string; unitsToday: number } | null;
  topModifier: { group: string; option: string; sharePercent: number } | null;
  refunds: { unitsSold: number; unitsRefunded: number; refundRatePercent: number | null };
  updatedAt: string;
}

export interface ProductPerformanceFilters {
  outletIds?: string[];
  channel?: "APP" | "QR" | "KIOSK" | "POS" | "COUNTER";
  days?: number;
}
