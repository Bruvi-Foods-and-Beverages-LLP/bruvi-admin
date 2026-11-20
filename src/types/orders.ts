export type OrderStatus =
  | "New"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "Delayed"
  | "Delayed 14m"
  | "Completed"
  | "Cancelled"
  | "Part refund";

export type OrderTab =
  | "ALL"
  | "LIVE"
  | "DELAYED"
  | "COMPLETED"
  | "REFUNDED"
  | "CANCELLED";

export type OrderChannel = "Counter" | "Kiosk K1" | "App" | "QR dine-in";

export type PaymentMethod = "UPI" | "Card" | "Netbanking" | "Wallet" | "—";

export interface OrderItemModifier {
  name: string;
  priceDelta?: number;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  /** "Oat milk +₹50", "Hazelnut syrup ×2" */
  modifiers?: string[];
  /** Customer note for this drink */
  instructions?: string | null;
  image?: string;
}

export interface CustomerProfile {
  initials: string;
  name: string;
  phone: string;
  memberSince: string;
  tier: "Gold" | "Silver" | "Bronze" | "Member";
  points: string;
  totalOrders: number;
  lifetimeSpend: string;
  note: string;
}

export interface PaymentGatewayEvent {
  time: string;
  event: string;
  detail: string;
  result: string;
  status?: "success" | "pending" | "failed";
}

export interface PaymentRefundRow {
  id: string;
  refundNumber: string;
  amount: number;
  /** GST credit note issued for this refund (null when no GST was reversed). */
  creditNoteNumber?: string | null;
  /** GST reversed by this refund, paise. */
  gstReversal?: { taxablePaise: number | null; cgstPaise: number | null; sgstPaise: number | null; igstPaise: number | null; taxPaise: number };
  destination: "ORIGINAL" | "WALLET";
  status: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";
  reasonCode: string;
  note?: string | null;
  providerRefundId?: string | null;
  lastError?: string | null;
  createdAt: string;
}

/** Real payment data for one order: the paying attempt, money and refunds. */
export interface PaymentDetail {
  orderId: string;
  orderNumber: string;
  /** GST charged on the order, as persisted by the backend GST engine. */
  gst?: GstView | null;
  invoiceNumber?: string | null;
  /** Captured amount in rupees (order total when nothing was captured). */
  amount: number;
  status: "Captured" | "Authorized" | "Pending" | "Refunded" | "Partially Refunded" | "Failed";
  /** "UPI", "Card", "Netbanking", "BRUVI Wallet". */
  method: string;
  /** "UPI · asha@okaxis", "Visa •••• 4242". */
  methodLabel: string;
  provider: string | null;
  storeName: string;
  timestamp: string;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  /** Gateway fee incl. GST, rupees; null until Razorpay reports it. */
  gatewayFee: number | null;
  gatewayTax: number | null;
  refundedToSource: number;
  refundedToWallet: number;
  /** Captured − fee − refunds sent back to the source, rupees. */
  netToSettle: number;
  upiRrn: string | null;
  payerVpa: string | null;
  cardLast4: string | null;
  cardNetwork: string | null;
  bank: string | null;
  gatewayEvents: PaymentGatewayEvent[];
  rawPayload: string;
  refunds: PaymentRefundRow[];
  /** ₹0 order: no gateway; the BRUVI payment id (`free_…`). */
  isZeroPayment: boolean;
  paymentId: string | null;
  /** ₹0 order: what covered the bill (coupon, BRUVI Club benefit), in rupees. */
  benefits: {
    itemTotal: number;
    discount: number;
    coupon: { code: string; discount: number } | null;
    membership: { planName: string | null; discount: number; freeDrinks: string[] } | null;
  } | null;
  razorpayDashboardUrl?: string;
}

export interface OrderTimelineItem {
  id: string;
  time: string;
  title: string;
  tag: "Customer" | "Staff" | "System" | "Live";
  description: string;
  avatarType: "initials" | "icon" | "pulse";
  avatarText?: string;
  avatarIcon?: "payment" | "check" | "kds" | "bell" | "note" | "clock";
  category: "customer" | "staff" | "system";
  isCurrent?: boolean;
}

export interface OrderUpcomingStep {
  id: string;
  time: string;
  title: string;
}

export interface OrderServiceLevel {
  statusText: string;
  elapsedTime: string;
  elapsedSubtext: string;
  targetTime: string;
  percentageSuccess: number;
  percentageOver: number;
  queueWait: string;
  makeTime: string;
  readyBy: string;
}

export interface OrderTimelineDetail {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  channel: string;
  storeName: string;
  customerName: string;
  totalAmount: number;
  events: OrderTimelineItem[];
  upcomingSteps: OrderUpcomingStep[];
  serviceLevel: OrderServiceLevel;
  whyItsLate: {
    title: string;
    explanation: string;
    customerActionsCount: number;
    staffActionsCount: number;
    systemEventsCount: number;
    barStoreName: string;
  };
}

export interface OrderTimelineEvent {
  time: string;
  event: string;
  isCurrent?: boolean;
  dotColor?: string;
}

export interface OrderSLA {
  elapsedText: string;
  busyModeText: string;
  percentage: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "C-218", "C-216", "K112", "A-112", "C-094", "A-047", "K058", "Q-31", "C-205"
  time: string; // e.g. "9:38", "9:35"
  createdAt: string; // ISO date string
  storeName: string; // e.g. "Indiranagar", "Bandra", "Cyber Hub", "Koramangala"
  storeId: string;
  channel: OrderChannel;
  /** PICKUP | DINE_IN | DELIVERY */
  serviceType?: string;
  /** Dine-in table, e.g. "Table 7" */
  tableLabel?: string;
  customerName: string; // e.g. "Saisubbireddy", "Walk-in", "Guest", "Ishaan Kapoor", "Table 4"
  customerPhone?: string;
  customerEmail?: string;
  itemCount: number;
  items: OrderItem[];
  subtotal: number;
  promoDiscount?: number;
  taxAmount: number;
  deliveryFee?: number;
  tip?: number;
  /** Exact paise from the server; display these, never the rounded rupee fields. */
  money?: OrderMoney;
  /** Server GST breakdown (detail only). */
  gst?: GstView;
  totalAmount: number; // e.g. 725, 420, 966
  paymentMethod: PaymentMethod;
  paymentStatus: "PAID" | "PENDING" | "REFUNDED" | "PARTIALLY_REFUNDED";
  status: OrderStatus;
  makeTime?: string; // e.g. "4:48", "9:12", "4:21", "14:00", "3:55" or "—"
  isDelayed?: boolean;
  isCancelled?: boolean;
  isRefunded?: boolean;
  invoiceNumber?: string;
  officialOrderNumber?: string;
  kdsStation?: string; // e.g. "Bar 1 KDS", "Kitchen KDS"
  baristaName?: string;
  priorityTier?: string;
  customerNote?: string;
  notes?: string;
  customerProfile?: CustomerProfile;
  timeline?: OrderTimelineEvent[];
  sla?: OrderSLA;
}

export interface OrdersCountSummary {
  all: number;
  live: number;
  delayed: number;
  completed: number;
  refunded: number;
  cancelled: number;
}

export interface OrdersQueryFilters {
  search?: string;
  tab?: OrderTab;
  store?: string;
  channel?: string;
  status?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export interface OrdersListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts: OrdersCountSummary;
  updatedAt: string;
}

/** One GST rate on a bill, from the backend GST engine. */
export interface GstRateView {
  ratePercent: number;
  cgstRatePercent: number;
  sgstRatePercent: number;
  igstRatePercent: number;
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  taxPaise: number;
}

/** The GST breakdown persisted on an order (never recomputed by the panel). */
export interface GstView {
  version: number | null;
  legacy: boolean;
  pricesIncludeGst: boolean;
  interState: boolean;
  supplierGstin: string | null;
  supplierLegalName: string | null;
  placeOfSupplyStateCode: string | null;
  sacCode: string;
  invoiceNumber: string | null;
  invoiceReady: boolean;
  rates: GstRateView[];
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  taxPaise: number;
  deliveryFeeTaxPaise: number;
  itemsTaxablePaise: number;
  itemsTaxPaise: number;
  deliveryFeeTaxablePaise: number;
  payablePaise: number;
}

/** Exact order amounts in paise, straight from the order row. */
export interface OrderMoney {
  itemTotalPaise: number;
  discountPaise: number;
  deliveryFeePaise: number;
  tipPaise: number;
  taxPaise: number;
  totalPaise: number;
  refundedPaise: number;
}
