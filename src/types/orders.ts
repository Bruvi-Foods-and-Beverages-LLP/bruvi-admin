export type OrderStatus =
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

export type PaymentMethod = "UPI" | "Card" | "Cash";

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
  modifiers?: string[];
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

export interface PaymentRiskCheck {
  id: string;
  label: string;
  passed: boolean;
}

export interface PaymentSettlement {
  batchId: string;
  cycle: string;
  batchCloses: string;
  expectedCredit: string;
  account: string;
  reconciled: boolean;
  reconciledText: string;
}

export interface PaymentDetail {
  orderId: string;
  orderNumber: string;
  amount: number;
  status: "Captured" | "Authorized" | "Refunded" | "Partially Refunded" | "Failed";
  method: string;
  storeName: string;
  timestamp: string;
  razorpayPaymentId: string;
  gatewayFeeText: string;
  netToSettle: number;
  upiRrn: string;
  payerVpa: string;
  posTerminalId: string;
  settlementBatch: string;
  expectedCreditDate: string;
  gatewayEvents: PaymentGatewayEvent[];
  rawPayload: string;
  riskChecks: PaymentRiskCheck[];
  settlement: PaymentSettlement;
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
  customerName: string; // e.g. "Saisubbireddy", "Walk-in", "Guest", "Ishaan Kapoor", "Table 4"
  customerPhone?: string;
  customerEmail?: string;
  itemCount: number;
  items: OrderItem[];
  subtotal: number;
  promoCode?: string;
  promoDiscount?: number;
  taxAmount: number;
  taxBreakdown?: string;
  discountAmount?: number;
  totalAmount: number; // e.g. 725, 420, 966
  paymentMethod: PaymentMethod;
  paymentGatewayText?: string;
  paymentReference?: string;
  settlementText?: string;
  paymentStatus: "PAID" | "PENDING" | "REFUNDED" | "PARTIALLY_REFUNDED";
  status: OrderStatus;
  makeTime?: string; // e.g. "4:48", "9:12", "4:21", "14:00", "3:55" or "—"
  isDelayed?: boolean;
  isCancelled?: boolean;
  isRefunded?: boolean;
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
