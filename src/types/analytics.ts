export type AnalyticsSectionTab =
  | "business"
  | "stores"
  | "products"
  | "customers"
  | "cohorts"
  | "contribution"
  | "profitability";

export interface DailySalesPoint {
  day: number;
  label: string;
  sepLakh: number;
  augLakh: number;
  isWeekend: boolean;
}

export interface ChannelMixMonth {
  month: string;
  appPct: number;
  counterPct: number;
  kioskPct: number;
  qrDeliveryPct: number;
}

export interface StoreAnalyticsRow {
  rank: number;
  id: string;
  name: string;
  city: string;
  code: string;
  tierLabel: string;
  manager: string;
  netSalesLakh: number;
  orders: number;
  ordersDeltaPct: number;
  aovInr: number;
  aovDeltaPct: number;
  makeTime: string;
  makeTimeTarget: string;
  makeTimeAlert: boolean;
  rating: number;
  deltaAugPct: number;
  hourlySales: number[]; // 16 slots 7a..10p
  topProducts: Array<{
    name: string;
    sold: number;
    sharePct: number;
    tone: "coffee" | "matcha";
  }>;
}

export interface DrinkMixTile {
  id: string;
  name: string;
  subtitle?: string;
  sharePct: number;
  category: "Vietnamese" | "Matcha" | "LAB" | "Other";
}

export interface AddonAttachRow {
  name: string;
  revenueLabel: string;
  attachPct: number;
  note: string;
  noteTone: "warning" | "error" | "muted";
}

export interface ModifierChoiceRow {
  group: string;
  segments: Array<{
    label: string;
    pct: number;
    colorClass: string;
  }>;
  trailingLabel: string;
}

export interface TopTrendProduct {
  name: string;
  sold: number;
  deltaPct: number;
  weeklyPoints: number[];
}

export interface WeeklyCustomerOrders {
  week: string;
  returningK: number;
  newK: number;
  totalK: number;
}

export interface OrderFrequencyBin {
  label: string;
  pct: number;
  isRegular: boolean;
}

export interface LtvChannelRow {
  channel: string;
  ltvInr: number;
  cacInr: number | null;
  ratioLabel: string;
  barPct: number;
  tone: "primary" | "coffee";
}

export interface RfmSegmentCell {
  id: string;
  title: string;
  pct: number;
  customers: number;
  tone: "success" | "warning" | "info" | "muted" | "error";
  detailHeadline: string;
  detailSpendLabel: string;
  detailDescription: string;
}

export interface CohortRetentionRow {
  cohort: string;
  customers: number;
  months: Array<number | null>; // M0..M6
}

export interface RetentionCurvePoint {
  month: string;
  mar: number;
  jun: number | null;
  aug: number | null;
}

export type MenuEngineeringClass = "Star" | "Plowhorse" | "Puzzle" | "Dog";

export interface ProductContributionRow {
  id: string;
  shortName: string;
  name: string;
  priceInr: number;
  foodCostInr: number;
  cmPct: number;
  units: number;
  mixSharePct: number;
  totalCmLakh: number;
  classification: MenuEngineeringClass;
  tone: "coffee" | "matcha" | "food";
}

export interface StoreProfitabilityRow {
  id: string;
  storeName: string;
  revenueLakh: number;
  cogsPct: number;
  labourPct: number;
  rentPct: number;
  otherPct: number;
  ebitdaLakh: number;
  ebitdaPct: number;
}
