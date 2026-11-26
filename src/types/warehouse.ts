export type WarehouseSectionTab =
  | "overview"
  | "stock"
  | "receiving"
  | "purchase-orders"
  | "suppliers"
  | "transfers"
  | "batches";

export type DockScheduleStatus =
  | "Received"
  | "Dispatched"
  | "Picking"
  | "Packed"
  | "Scheduled"
  | "Expected";

export interface DockScheduleRow {
  id: string;
  direction: "inbound" | "outbound";
  time: string;
  ref: string;
  partyTitle: string;
  contentsSubtitle: string;
  dockVehicle: string;
  status: DockScheduleStatus;
  href: string;
  showNowMarkerBefore?: boolean;
}

export interface ZoneCapacityItem {
  id: string;
  name: string;
  used: number;
  total: number;
  tempLabel: string;
  percent: number;
  tone: "primary" | "warning" | "accent";
}

export interface WarehouseAlertItem {
  id: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  actionHref: string;
  tone: "warning" | "primary";
}

export type WarehouseStockStatus = "In stock" | "Low" | "Expiring" | "Reorder";

export interface WarehouseStockRow {
  sku: string;
  name: string;
  subtitle: string;
  zone: "A" | "C" | "F";
  category: string;
  supplier: string;
  bin: string;
  onHandLabel: string;
  reserved: number;
  availableLabel: string;
  unitCostInr: number;
  valueInr: number;
  expiryLabel: string;
  status: WarehouseStockStatus;
}

export type PurchaseOrderStatus =
  | "Draft"
  | "Awaiting approval"
  | "Sent"
  | "In transit · customs"
  | "Partially received"
  | "Closed";

export interface PurchaseOrderRow {
  poNumber: string;
  supplier: string;
  itemsSummary: string;
  created: string;
  eta: string;
  valueInr: number;
  receivedQty?: number;
  orderedQty?: number;
  status: PurchaseOrderStatus;
}

export interface CreatePoLineItem {
  id: string;
  sku: string;
  name: string;
  onHand: number;
  reorderAt: number;
  suggestedQty: number;
  packHint: string;
  qty: number;
  unitCostInr: number;
}

export interface SupplierProfileData {
  id: string;
  initials: string;
  name: string;
  roleLabel: string;
  ratingLabel: string;
  status: "Active" | "Inactive";
  onTimePercent: number;
  onTimeMeta: string;
  fillRatePercent: number;
  fillRateMeta: string;
  rejectsPercent: number;
  rejectsMeta: string;
  avgLeadTimeLabel: string;
  avgLeadTimeMeta: string;
  contact: string;
  indiaAgent: string;
  email: string;
  gstin: string;
  paymentTerms: string;
  origin: string;
  itemsSupplied: Array<{
    id: string;
    name: string;
    moqLabel: string;
    unitPriceInr: number;
  }>;
  recentDeliveries: Array<{
    grn: string;
    date: string;
    poQty: string;
    rejects: string;
    rejectsTone: "normal" | "warning";
    timing: string;
    timingTone: "success" | "warning";
  }>;
  openPos: Array<{
    poNumber: string;
    summary: string;
    status: string;
  }>;
  documents: Array<{
    title: string;
    statusLabel: string;
    tone: "success" | "warning" | "muted";
  }>;
}

export type KanbanTransferStage = "To pick" | "Picking" | "Packed" | "Dispatched";

export interface WarehouseOutboundTransfer {
  id: string;
  stage: KanbanTransferStage;
  time: string;
  toStore: string;
  toAddress: string;
  summaryLine: string;
  progressPct?: number;
  vehicleLabel: string;
  driverLabel: string;
  etaLabel: string;
  pickedTime?: string;
  packedTime?: string;
  dispatchedTime?: string;
  lines: Array<{
    name: string;
    batchBin: string;
    qty: number;
  }>;
  signatures: Array<{
    name: string;
    role: string;
    signed: boolean;
  }>;
}

export interface BatchDetailData {
  batchCode: string;
  itemName: string;
  manufactured: string;
  expires: string;
  receivedLabel: string;
  location: string;
  traceableTotal: number;
  allocations: Array<{
    id: string;
    title: string;
    subtitle: string;
    statusLabel: string;
    statusTone: "info" | "warning" | "success";
    qty: number;
    dotTone: "coffee" | "accent" | "primary";
  }>;
  currentTempC: number;
  maxTempC: number;
  tempPoints: number[];
  qcStatus: string;
  batchSizeLabel: string;
  inspectedBy: string;
  coaLabel: string;
  coaFile: string;
  coaMeta: string;
  recallTraceablePct: number;
  recallStoresAffected: number;
  recallCupsServed: number;
}
