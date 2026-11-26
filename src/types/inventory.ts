export type InventorySectionTab =
  | "overview"
  | "store-stock"
  | "counts"
  | "waste"
  | "transfers"
  | "low-stock";

export type CoverRiskLevel = "out" | "low" | "watch" | "ok";

export interface CoverMatrixRow {
  storeId: string;
  storeName: string;
  storeCode: string;
  oatMilkDays: number;
  vanillaDays: number | null; // null = Out
  matchaDays: number;
  robustaDays: number;
  condensedDays: number;
  cupsDays: number;
}

export interface UpcomingDeliveryItem {
  id: string;
  type: "transfer" | "po";
  title: string;
  subtitle: string;
  rightTop: string;
  rightBottom: string;
  rightBottomTone: "info" | "warning";
  href: string;
}

export interface WasteReasonSummary {
  reason: string;
  amountInr: number;
  percent: number;
  colorClass: string;
}

export interface StoreStockItem {
  id: string;
  sku: string;
  name: string;
  brandSpec: string;
  unit: string;
  onHand: number;
  par: number;
  reorderPoint: number;
  usePerDay: number;
  coverDays: number;
  status: "Out" | "Low" | "OK";
  countedAt: string;
  isKeyItem: boolean;
  unitCostInr: number;
  wholeUnitsOnly: boolean;
}

export interface StoreBranchOption {
  id: string;
  name: string;
  code: string;
  shortCode: string;
  stockValueLabel: string;
}

export interface IngredientStoreLevel {
  storeCode: string;
  storeName: string;
  onHand: number;
  par: number;
  isBelowPar: boolean;
}

export interface IngredientUsageDay {
  dayLabel: string;
  units: number;
  isPromo: boolean;
}

export interface IngredientBatch {
  batchCode: string;
  meta: string;
  qtyLabel: string;
}

export interface IngredientUsageLink {
  id: string;
  kind: "Modifier" | "Recipe";
  title: string;
  subtitle: string;
  href: string;
  tone: "coffee" | "matcha";
}

export interface IngredientDetailData {
  id: string;
  sku: string;
  name: string;
  packLabel: string;
  unit: string;
  unitCostInr: number;
  storesOnHandLabel: string;
  warehouseCode: string;
  warehouseOnHand: number;
  usePerDay7d: number;
  storeCoverLabel: string;
  storesBelowParLabel: string;
  demandAlertLabel: string;
  storeLevels: IngredientStoreLevel[];
  usage14d: IngredientUsageDay[];
  supplierLabel: string;
  leadTimeMoqLabel: string;
  storeRuleLabel: string;
  warehouseRuleLabel: string;
  batches: IngredientBatch[];
  usedIn: IngredientUsageLink[];
}

export type AdjustmentReason =
  | "Damaged / leaking"
  | "Count correction"
  | "Expired"
  | "Theft / loss";

export interface RecentAdjustmentItem {
  id: string;
  title: string;
  meta: string;
  valueDeltaInr: number;
}

export interface StockCountLine {
  id: string;
  ingredientId: string;
  name: string;
  unit: string;
  expected: number;
  counted: number;
  unitCostInr: number;
  step: number;
}

export type WasteReason =
  | "Spill / remake"
  | "Cancelled order"
  | "Expired"
  | "Damaged"
  | "End of day";

export interface WasteLogEntry {
  id: string;
  time: string;
  store: string;
  itemTitle: string;
  loggedByDetail: string;
  reason: WasteReason;
  valueInr: number;
}

export interface WasteCatalogOption {
  id: string;
  label: string;
  unitCostInr: number;
  kind: "menu" | "ingredient";
}

export type TransferStatus =
  | "Dispatched"
  | "Picking"
  | "Scheduled"
  | "Draft"
  | "Received";

export interface TransferLineItem {
  id: string;
  ingredientName: string;
  batchLabel: string;
  qtySentLabel: string;
  sourceChange: string;
  storeAfter: string;
  valueInr: number;
}

export interface StockTransferRecord {
  id: string;
  fromCode: string;
  fromSubtitle: string;
  toName: string;
  toCode: string;
  receiverName: string;
  vehicleLabel: string;
  distanceLabel: string;
  dispatchSlot: string;
  sealTemp: string;
  etaLabel: string;
  status: TransferStatus;
  summarySubtitle: string;
  createdMeta: string;
  pickedMeta: string;
  dispatchedMeta: string;
  receivedMeta: string;
  totalValueInr: number;
  lines: TransferLineItem[];
  driverInitials?: string;
  driverName?: string;
  driverPing?: string;
}

export interface LowStockAlertItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  storeName: string;
  onHandLabel: string;
  coverLabel: string;
  severity: "out" | "low";
  recommendation: string;
  actionType: "view-transfer" | "create-transfer" | "create-po";
  actionHref: string;
}

export interface MenuImpactItem {
  id: string;
  title: string;
  subtitle: string;
  badgeLabel: "Auto" | "Watch";
  badgeTone: "error" | "warning";
  iconKind: "hidden" | "matcha" | "oat";
}

export interface AutoReorderRule {
  id: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}
