import { Order, OrdersListResponse, OrdersQueryFilters, PaymentDetail, OrderTimelineDetail } from "@/types/orders";

export const OrdersApi = {
  /**
   * Search, filter, and paginate omnichannel orders
   */
  async getOrders(filters: OrdersQueryFilters = {}): Promise<OrdersListResponse> {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.set("search", filters.search);
    if (filters.tab) searchParams.set("tab", filters.tab);
    if (filters.store) searchParams.set("store", filters.store);
    if (filters.channel) searchParams.set("channel", filters.channel);
    if (filters.status) searchParams.set("status", filters.status);
    if (filters.date) searchParams.set("date", filters.date);
    if (filters.page) searchParams.set("page", String(filters.page));
    if (filters.limit) searchParams.set("limit", String(filters.limit));

    const queryString = searchParams.toString();
    const url = `/api/admin/orders${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }

    return res.json();
  },

  /**
   * Retrieve a single order by ID or orderNumber
   */
  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch order ${id}: ${res.statusText}`);
    }

    return res.json();
  },

  /**
   * Retrieve payment transaction details for an order
   */
  async getPaymentDetail(id: string): Promise<PaymentDetail> {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}/payment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch payment details for order ${id}: ${res.statusText}`);
    }

    return res.json();
  },

  /**
   * Process refund for an order
   */
  async processRefund(
    id: string,
    payload: {
      refundAmount: number;
      reason: string;
      note?: string;
      method: string;
      items?: { id: string; quantity: number }[];
    }
  ): Promise<{ success: boolean; refundId: string; order: Order }> {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to process refund: ${res.statusText}`);
    }

    return res.json();
  },

  /**
   * Retrieve full audit timeline and service level telemetry for an order
   */
  async getOrderTimeline(id: string): Promise<OrderTimelineDetail> {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}/timeline`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch timeline for order ${id}: ${res.statusText}`);
    }

    return res.json();
  },
};

