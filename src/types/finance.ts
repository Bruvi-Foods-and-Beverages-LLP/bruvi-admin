export type FinanceSectionTab =
  | "overview"
  | "payments"
  | "refunds"
  | "reconciliation"
  | "settlements"
  | "tax";

export interface PaymentMixItem {
  label: string;
  percent: number;
  amountInr: number;
  colorClass: string;
}

export interface FinanceAttentionItem {
  id: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  actionHref: string;
  dotTone: "error" | "warning" | "primary";
}

export type PaymentAttemptStatus = "Captured" | "Failed" | "Refunded";

export interface PaymentAttemptRow {
  time: string;
  paymentId: string;
  orderNumber: string;
  store: string;
  methodTitle: string;
  methodDetail: string;
  methodType: "UPI" | "Card" | "Wallet";
  amountInr: number;
  feeInr: number | null;
  status: PaymentAttemptStatus;
  gateway: "Razorpay" | "Pine Labs" | "BRUVI Wallet";
}

export type RefundStatus = "Initiated" | "Processed" | "Failed";

export interface RefundRow {
  id: string;
  orderNumber: string;
  store: string;
  reason: string;
  amountInr: number;
  destination: "UPI" | "Card" | "Wallet";
  status: RefundStatus;
  approver: string;
  slaTop: string;
  slaBottom: string;
  slaTone: "normal" | "success" | "error";
}

export interface RefundApprovalItem {
  id: string;
  store: string;
  subtitle: string;
  requesterMeta: string;
  amountInr: number;
}

export interface ReconciliationProviderRow {
  id: string;
  provider: string;
  subtitle: string;
  netSalesInr: number;
  feesAdjInr: number;
  expectedInr: number;
  settledInr: number;
  varianceInr: number;
  statusLabel: string;
  isUnmatched: boolean;
}

export interface VarianceTraceItem {
  id: string;
  store: string;
  amountInr: number;
  orderRef: string;
  ledgerStatusLabel: string;
}

export interface StoreShiftDetail {
  shiftName: string;
  closedBy: string;
  device: string;
  expectedInr: number;
  countedInr: number;
  varianceInr: number;
  note: string;
}

export interface StoreSettlementRow {
  id: string;
  storeName: string;
  storeCode: string;
  city: "Bengaluru" | "Mumbai" | "NCR";
  shiftsLabel?: string;
  grossInr: number;
  discountsInr: number;
  refundsInr: number;
  netInr: number;
  cashExpectedInr: number;
  cashCountedInr: number;
  cardUpiInr: number;
  varianceInr: number;
  statusLabel: "Balanced" | "UPI refund" | "Cash short";
  shifts?: StoreShiftDetail[];
}

export interface StateGstSummaryRow {
  state: string;
  storesCountLabel: string;
  gstin: string;
  taxableValueInr: number;
  cgstInr: number;
  sgstInr: number;
  totalGstInr: number;
}

export interface SacSummaryRow {
  sac: string;
  description: string;
  type: "B2C" | "B2B";
  qty: number;
  taxableValueInr: number;
  gst5Inr: number;
}
