import type { GstView, OrderMoney } from "@/types/orders";
export type BackendOrderStatus =
  | 'PENDING_PAYMENT'
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export type BackendPaymentStatus =
  | 'UNPAID'
  | 'PAID'
  | 'FAILED'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'VOID';

export interface NextAction {
  action: string;
  targetStatus: BackendOrderStatus;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface BackendOrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  /** "Oat milk +₹50", "Hazelnut syrup ×2" */
  modifiers?: string[];
  /** Customer note for this drink */
  instructions?: string | null;
  imageUrl?: string | null;
}

export interface BackendOrderListItem {
  id: string;
  orderNumber: string;
  officialOrderNumber: string;
  invoiceNumber?: string;
  time: string;
  createdAt: string;
  storeName: string;
  storeId: string;
  channel: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  itemCount: number;
  status: string;
  rawStatus: BackendOrderStatus;
  paymentStatus: BackendPaymentStatus;
  serviceType: string;
  /** Dine-in: the table to serve ("Table 7") */
  tableLabel?: string | null;
  /** Dine-in: the customer's note for the kitchen */
  kitchenNote?: string | null;
  totalAmount: number;
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  tip?: number;
  refundedAmount: number;
  /** Exact paise from the order row. */
  money?: OrderMoney;
  /** UPI | CARD | NETBANKING | WALLET of the paying (or latest) attempt. */
  paymentMethod?: string | null;
  items: BackendOrderItem[];
  version: number;
}

/** ₹0 orders: what covered the bill, frozen on the payment (paise). */
export interface ZeroPaymentBenefits {
  itemTotalPaise: number;
  discountPaise: number;
  coupon: { code: string; discountPaise: number } | null;
  membership: {
    planName: string | null;
    subscriptionId: string | null;
    discountPaise: number;
    freeDrinks: { name: string; valuePaise: number }[];
    percentDiscountPaise: number;
  } | null;
}

export interface BackendPaymentAttempt {
  id: string;
  attemptNo: number;
  provider: string;
  method: string;
  methodLabel?: string | null;
  benefits?: ZeroPaymentBenefits | null;
  amount: number;
  amountPaise?: number;
  status: string;
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
  failureCode?: string | null;
  failureReason?: string | null;
  gatewayMethod?: string | null;
  vpa?: string | null;
  upiRrn?: string | null;
  cardLast4?: string | null;
  cardNetwork?: string | null;
  bank?: string | null;
  wallet?: string | null;
  feePaise?: number | null;
  gatewayTaxPaise?: number | null;
  createdAt: string;
  capturedAt?: string | null;
  expiresAt?: string | null;
}

export interface BackendRefund {
  id: string;
  refundNumber: string;
  amountPaise: number;
  taxPaise: number;
  destination: 'ORIGINAL' | 'WALLET';
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED';
  reasonCode: string;
  note?: string | null;
  providerRefundId?: string | null;
  paymentAttemptId?: string | null;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
  items: Array<{ orderItemId: string; quantity: number; amountPaise: number }>;
  creditNoteNumber?: string | null;
  gstReversal?: { taxablePaise: number | null; cgstPaise: number | null; sgstPaise: number | null; igstPaise: number | null; taxPaise: number };
}

export interface BackendPaymentSummary {
  provider: string | null;
  method: string | null;
  methodLabel: string | null;
  benefits?: ZeroPaymentBenefits | null;
  status: string;
  capturedPaise: number;
  feePaise: number | null;
  gatewayTaxPaise: number | null;
  refundedPaise: number;
  refundedToSourcePaise: number;
  refundedToWalletPaise: number;
  netSettlementPaise: number;
  capturedAt: string | null;
}

export interface BackendOrdersListResponse {
  items: BackendOrderListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: {
    all?: number;
    total?: number;
    live: number;
    delayed: number;
    completed: number;
    refunded: number;
    cancelled: number;
  };
  updatedAt: string;
  version: number;
  notModified?: boolean;
}

export interface BackendOrderDetail extends BackendOrderListItem {
  nextActions: NextAction[];
  timeline: Array<{
    id: string;
    seq: number;
    title: string;
    timestamp: string;
    actorType: string;
    note?: string;
    fromStatus?: string;
    toStatus?: string;
    payload?: any;
  }>;
  payments: BackendPaymentAttempt[];
  refunds?: BackendRefund[];
  paymentSummary?: BackendPaymentSummary;
  gst?: GstView;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    initials?: string;
    tier?: string;
    points?: string;
    totalOrders?: number;
    lifetimeSpend?: string;
    memberSince?: string;
    note?: string;
  };
  tableLabel?: string;
  deliveryAddress?: any;
  promisedReadyAt?: string;
  placedAt?: string;
  acceptedAt?: string;
  preparingAt?: string;
  readyAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReasonCode?: string;
  cancelNote?: string;
}

export interface CancelQuoteResponse {
  orderId: string;
  orderNumber: string;
  refundablePaise: number;
  wasteCostPaise: number;
  canCancel: boolean;
}

export interface RefundQuoteItem {
  orderItemId: string;
  productName: string;
  variantName?: string | null;
  quantity: number;
  refundedQuantity: number;
  refundableQuantity: number;
  unitPricePaise: number;
  grossPaise: number;
  discountPaise: number;
  taxPaise: number;
  payablePaise: number;
  /** Refund for one more unit (server rounding). */
  unitRefundPaise: number;
  /** Refund for every unit still refundable. */
  remainingRefundPaise: number;
  remainingTaxPaise: number;
}

export interface RefundQuoteResponse {
  orderId: string;
  orderNumber: string;
  paymentStatus: string;
  refundable: boolean;
  totalPaise: number;
  refundedPaise: number;
  remainingRefundablePaise: number;
  deliveryFeePaise: number;
  tipPaise: number;
  /** Delivery fee + tip already refunded; they go back at most once in total. */
  extrasRefundedPaise: number;
  approvalLimitPaise: number;
  canOverride: boolean;
  payment: { provider: string; method: string; methodLabel: string | null } | null;
  destinations: Array<'ORIGINAL' | 'WALLET'>;
  items: RefundQuoteItem[];
}

/** POST /admin/orders/:id/refund-preview: what a refund would give back, computed by the server. */
export interface RefundPreviewComponent {
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  taxPaise: number;
  payablePaise: number;
}

export interface RefundPreviewResponse {
  items: Array<RefundPreviewComponent & { orderItemId: string; qty: number }>;
  charges: Array<RefundPreviewComponent & { key: string }>;
  gst: Omit<RefundPreviewComponent, 'payablePaise'>;
  totalPaise: number;
  orderTotalPaise: number;
  refundedBeforePaise: number;
  remainingAfterPaise: number;
  overApprovalLimit: boolean;
  legacyOrder: boolean;
}

export interface RefundRequestPayload {
  items?: Array<{ orderItemId: string; qty: number }>;
  includeDeliveryFee?: boolean;
  includeTip?: boolean;
  amountPaise?: number;
  destination: 'ORIGINAL' | 'WALLET';
  reasonCode: string;
  note?: string;
}

