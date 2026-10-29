export type OrderChannel = "COUNTER_POS" | "KIOSK" | "MOBILE_APP" | "QR_TABLE";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PLACED"
  | "ACCEPTED"
  | "BREWING"
  | "READY_FOR_PICKUP"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedModifiers: Array<{
    groupName: string;
    optionName: string;
    priceDelta: number;
  }>;
}

export interface AdminOrder {
  id: string;
  orderNumber: string; // e.g. "C-218", "A-112"
  channel: OrderChannel;
  status: OrderStatus;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
  updatedAt: string;
  slaMinutesRemaining?: number;
  isBottleneck?: boolean;
}

