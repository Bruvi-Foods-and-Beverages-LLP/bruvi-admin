import type { PrepStation, ProductStatus, ProductDetail, ProductCreatePayload, ProductUpdatePayload } from "@/types/catalog";

export const SHORT_DESCRIPTION_MAX = 60;
export const DRAFT_STORAGE_KEY = "bruvi.catalog.newProductDraft.v1";

export interface TaxClassOption {
  value: string;
  label: string;
  taxRatePercent: number;
  hsnCode: string;
}

/** GST slabs + HSN codes selectable for a product. Maps to `taxRatePercent` / `hsnCode` on the API. */
export const TAX_CLASSES: TaxClassOption[] = [
  { value: "gst5-2101", label: "GST 5% · HSN 2101", taxRatePercent: 5, hsnCode: "2101" },
  { value: "gst5-0902", label: "GST 5% · HSN 0902", taxRatePercent: 5, hsnCode: "0902" },
  { value: "gst12-1905", label: "GST 12% · HSN 1905", taxRatePercent: 12, hsnCode: "1905" },
  { value: "gst18-2106", label: "GST 18% · HSN 2106", taxRatePercent: 18, hsnCode: "2106" },
];

export interface ProductFormState {
  name: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string | null;
  categoryId: string;
  basePriceRupees: string; // kept as string so typing decimals works smoothly
  taxClass: string;
  prepStation: PrepStation;
  modifierGroupIds: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  containsDairy: boolean;
  containsNuts: boolean;
  containsGluten: boolean;
  isCaffeinated: boolean;
  channelCounter: boolean;
  channelKiosk: boolean;
  channelApp: boolean;
  channelQr: boolean;
  storeIds: string[];
}

export const DEFAULT_PRODUCT_FORM: ProductFormState = {
  name: "",
  shortDescription: "",
  longDescription: "",
  imageUrl: null,
  categoryId: "",
  basePriceRupees: "",
  taxClass: TAX_CLASSES[0].value,
  prepStation: "BAR",
  modifierGroupIds: [],
  isVegetarian: true,
  isVegan: false,
  containsDairy: false,
  containsNuts: false,
  containsGluten: false,
  isCaffeinated: true,
  channelCounter: true,
  channelKiosk: true,
  channelApp: true,
  channelQr: true,
  storeIds: [],
};

export function parsePriceToPaise(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
}

export function isFormDirty(form: ProductFormState): boolean {
  return JSON.stringify({ ...form, storeIds: [] }) !== JSON.stringify({ ...DEFAULT_PRODUCT_FORM, storeIds: [] });
}

/** Human-friendly unique SKU, e.g. BRV-LAB-YUZU-7K2F. The backend requires a unique SKU. */
export function generateSku(categoryName: string, productName: string): string {
  const clean = (s: string, n: number) =>
    s.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, n) || "X";
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BRV-${clean(categoryName, 4)}-${clean(productName, 4)}-${rand}`;
}

export interface ReadinessItem {
  key: "basics" | "dietary" | "photo" | "recipe";
  label: string;
  done: boolean;
}

/** Mirrors the backend `readiness_checklist` computed on create. */
export function getReadiness(form: ProductFormState): ReadinessItem[] {
  return [
    {
      key: "basics",
      label: "Name, descriptions, price, tax",
      done: Boolean(
        form.name.trim() && form.shortDescription.trim() && form.longDescription.trim() &&
          parsePriceToPaise(form.basePriceRupees) > 0 && form.categoryId
      ),
    },
    { key: "dietary", label: "Dietary & allergens declared", done: true },
    { key: "photo", label: "Add a product photo", done: Boolean(form.imageUrl) },
    { key: "recipe", label: "Link a recipe for stock deduction", done: false },
  ];
}

/**
 * Transforms a full backend ProductDetail DTO into form state for the editor
 */
export function productDetailToForm(detail: ProductDetail): ProductFormState {
  const taxOption =
    TAX_CLASSES.find((t) => t.taxRatePercent === detail.taxRatePercent && t.hsnCode === detail.hsnCode) ||
    TAX_CLASSES.find((t) => t.taxRatePercent === detail.taxRatePercent) ||
    TAX_CLASSES[0];

  return {
    name: detail.name,
    shortDescription: detail.shortDescription || "",
    longDescription: detail.longDescription || "",
    imageUrl: detail.imageUrl || null,
    categoryId: detail.categoryId,
    basePriceRupees: detail.basePriceRupees ? String(detail.basePriceRupees) : String(Math.round(detail.basePricePaise / 100)),
    taxClass: taxOption.value,
    prepStation: detail.prepStation || "BAR",
    modifierGroupIds: detail.modifierGroupIds || detail.modifierGroups?.map((mg) => mg.id) || [],
    isVegetarian: Boolean(detail.isVegetarian),
    isVegan: Boolean(detail.isVegan),
    containsDairy: Boolean(detail.containsDairy),
    containsNuts: Boolean(detail.containsNuts),
    containsGluten: Boolean(detail.containsGluten),
    isCaffeinated: Boolean(detail.isCaffeinated),
    channelCounter: Boolean(detail.channelCounter),
    channelKiosk: Boolean(detail.channelKiosk),
    channelApp: Boolean(detail.channelApp),
    channelQr: Boolean(detail.channelQr),
    storeIds: detail.storeIds || detail.overrides?.filter((ov) => ov.isAvailable).map((ov) => ov.outletId) || [],
  };
}

/**
 * Builds the atomic create payload
 */
export function buildCreatePayload(
  form: ProductFormState,
  opts: { status: ProductStatus; sku: string; includeStores?: boolean }
): ProductCreatePayload {
  const tax = TAX_CLASSES.find((t) => t.value === form.taxClass) ?? TAX_CLASSES[0];
  return {
    name: form.name.trim(),
    sku: opts.sku,
    categoryId: form.categoryId,
    shortDescription: form.shortDescription.trim() || null,
    longDescription: form.longDescription.trim() || null,
    prepStation: form.prepStation,
    basePricePaise: parsePriceToPaise(form.basePriceRupees),
    taxRatePercent: tax.taxRatePercent,
    hsnCode: tax.hsnCode,
    isTaxInclusive: true,
    channelCounter: form.channelCounter,
    channelKiosk: form.channelKiosk,
    channelApp: form.channelApp,
    channelQr: form.channelQr,
    isVegetarian: form.isVegetarian,
    isVegan: form.isVegan,
    containsDairy: form.containsDairy,
    containsNuts: form.containsNuts,
    containsGluten: form.containsGluten,
    isCaffeinated: form.isCaffeinated,
    status: opts.status,
    imageUrl: form.imageUrl,
    modifierGroupIds: form.modifierGroupIds,
    storeIds: form.storeIds,
  };
}

/**
 * Builds a clean, minimal PATCH payload including only the fields that actually changed
 */
export function buildUpdatePayload(
  initial: ProductFormState,
  form: ProductFormState,
  opts?: { status?: ProductStatus }
): ProductUpdatePayload {
  const payload: ProductUpdatePayload = {};

  if (opts?.status !== undefined) {
    payload.status = opts.status;
  }

  if (form.name.trim() !== initial.name.trim()) {
    payload.name = form.name.trim();
  }

  if (form.categoryId !== initial.categoryId) {
    payload.categoryId = form.categoryId;
  }

  if (form.shortDescription.trim() !== initial.shortDescription.trim()) {
    payload.shortDescription = form.shortDescription.trim() || null;
  }

  if (form.longDescription.trim() !== initial.longDescription.trim()) {
    payload.longDescription = form.longDescription.trim() || null;
  }

  if (form.imageUrl !== initial.imageUrl) {
    payload.imageUrl = form.imageUrl || null;
  }

  if (form.basePriceRupees !== initial.basePriceRupees) {
    payload.basePricePaise = parsePriceToPaise(form.basePriceRupees);
  }

  if (form.taxClass !== initial.taxClass) {
    const tax = TAX_CLASSES.find((t) => t.value === form.taxClass) ?? TAX_CLASSES[0];
    payload.taxRatePercent = tax.taxRatePercent;
    payload.hsnCode = tax.hsnCode;
  }

  if (form.prepStation !== initial.prepStation) {
    payload.prepStation = form.prepStation;
  }

  if (JSON.stringify(form.modifierGroupIds) !== JSON.stringify(initial.modifierGroupIds)) {
    payload.modifierGroupIds = form.modifierGroupIds;
  }

  if (JSON.stringify(form.storeIds) !== JSON.stringify(initial.storeIds)) {
    payload.storeIds = form.storeIds;
  }

  if (form.channelCounter !== initial.channelCounter) payload.channelCounter = form.channelCounter;
  if (form.channelKiosk !== initial.channelKiosk) payload.channelKiosk = form.channelKiosk;
  if (form.channelApp !== initial.channelApp) payload.channelApp = form.channelApp;
  if (form.channelQr !== initial.channelQr) payload.channelQr = form.channelQr;

  if (form.isVegetarian !== initial.isVegetarian) payload.isVegetarian = form.isVegetarian;
  if (form.isVegan !== initial.isVegan) payload.isVegan = form.isVegan;
  if (form.containsDairy !== initial.containsDairy) payload.containsDairy = form.containsDairy;
  if (form.containsNuts !== initial.containsNuts) payload.containsNuts = form.containsNuts;
  if (form.containsGluten !== initial.containsGluten) payload.containsGluten = form.containsGluten;
  if (form.isCaffeinated !== initial.isCaffeinated) payload.isCaffeinated = form.isCaffeinated;

  return payload;
}

export type FieldKey = "name" | "categoryId" | "basePriceRupees";

/** Required fields (shared by Save draft and Publish). */
export function getFieldErrors(form: ProductFormState): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {};
  if (!form.name.trim()) errors.name = "Product name is required";
  if (!form.categoryId) errors.categoryId = "Choose a category";
  if (parsePriceToPaise(form.basePriceRupees) <= 0) errors.basePriceRupees = "Enter a base price above ₹0";
  return errors;
}

export const FIELD_LABELS: Record<FieldKey, string> = {
  name: "Product name",
  categoryId: "Category",
  basePriceRupees: "Base price",
};

/** Full-initial form: first category + the first city's stores (pilots launch in one city first). */
export function buildInitialForm(categoryId: string, firstCityStoreIds: string[]): ProductFormState {
  return { ...DEFAULT_PRODUCT_FORM, categoryId, storeIds: firstCityStoreIds };
}
