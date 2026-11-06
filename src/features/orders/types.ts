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
  totalAmount: number;
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  refundedAmount: number;
  items: BackendOrderItem[];
  version: number;
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
  payments: Array<{
    id: string;
    attemptNo: number;
    provider: string;
    method: string;
    amount: number;
    status: string;
    providerPaymentId?: string;
    failureReason?: string;
    createdAt: string;
    capturedAt?: string;
  }>;
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

export interface RefundQuoteResponse {
  orderId: string;
  orderNumber: string;
  totalPaise: number;
  refundedPaise: number;
  remainingRefundablePaise: number;
  approvalLimitPaise: number;
  canOverride: boolean;
  items: Array<{
    orderItemId: string;
    productName: string;
    quantity: number;
    refundableQuantity: number;
    unitPricePaise: number;
    totalPricePaise: number;
  }>;
}
