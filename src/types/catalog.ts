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

export interface ModifierOption {
  id: string;
  name: string;
  sku?: string | null;
  pricePaise: number;
  isDefault: boolean;
  isAvailable: boolean;
  displayOrder: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  groupType: ModifierGroupType;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  displayOrder: number;
  customHint?: string | null;
  modifiers: ModifierOption[];
}

export type ModifierGroupDetail = ModifierGroup;

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
