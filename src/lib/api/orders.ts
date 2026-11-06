import { apiClient } from '@/lib/api/client';
import {
  Order,
  OrdersListResponse,
  OrdersQueryFilters,
  PaymentDetail,
  OrderTimelineDetail,
} from '@/types/orders';
import {
  BackendOrdersListResponse,
  BackendOrderDetail,
  CancelQuoteResponse,
  RefundQuoteResponse,
} from '@/features/orders/types';
import { AdminOrderMapper } from '@/features/orders/mappers';

export const OrdersApi = {
  /**
   * Search, filter, and paginate omnichannel orders
   */
  async getOrders(filters: OrdersQueryFilters = {}, ifNoneMatch?: string): Promise<OrdersListResponse> {
    const params: Record<string, string | number | undefined> = {};

    if (filters.search) params.q = filters.search;
    if (filters.tab && filters.tab !== 'ALL') params.tab = filters.tab.toLowerCase();
    if (filters.channel && filters.channel !== 'All') params.channel = filters.channel;
    if (filters.status && filters.status !== 'All') params.status = filters.status;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const headers: Record<string, string> = {};
    if (ifNoneMatch) {
      headers['If-None-Match'] = ifNoneMatch;
    }

    const res = await apiClient.get<BackendOrdersListResponse>('/admin/orders', {
      params,
      headers,
    });

    const orders = (res.items || []).map((it) => AdminOrderMapper.toUIOrder(it));

    const countsData = (res.counts || {}) as any;
    const allCount = countsData.all ?? countsData.total ?? res.total ?? 0;

    return {
      orders,
      total: res.total || 0,
      page: res.page || 1,
      limit: res.limit || 10,
      totalPages: res.totalPages || 1,
      counts: {
        all: allCount,
        live: countsData.live ?? 0,
        delayed: countsData.delayed ?? 0,
        completed: countsData.completed ?? 0,
        refunded: countsData.refunded ?? 0,
        cancelled: countsData.cancelled ?? 0,
      },
      updatedAt: res.updatedAt ? new Date(res.updatedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : 'Just now',
    };
  },

  /**
   * Retrieve a single order by ID or orderNumber
   */
  async getOrderById(id: string): Promise<Order> {
    const detail = await apiClient.get<BackendOrderDetail>(`/admin/orders/${id}`);
    const mapped = AdminOrderMapper.toUIOrderDetail(detail);
    return mapped.order;
  },

  /**
   * Retrieve full backend order detail with next actions, timeline, and payments
   */
  async getOrderDetailRaw(id: string): Promise<BackendOrderDetail> {
    return apiClient.get<BackendOrderDetail>(`/admin/orders/${id}`);
  },

  /**
   * Retrieve payment details for an order
   */
  async getPaymentDetail(id: string): Promise<PaymentDetail> {
    const detail = await apiClient.get<BackendOrderDetail>(`/admin/orders/${id}`);
    const mapped = AdminOrderMapper.toUIOrderDetail(detail);
    return mapped.payment;
  },

  /**
   * Retrieve full audit timeline for an order
   */
  async getTimeline(id: string): Promise<OrderTimelineDetail> {
    const detail = await apiClient.get<BackendOrderDetail>(`/admin/orders/${id}`);
    const mapped = AdminOrderMapper.toUIOrderDetail(detail);
    return mapped.timeline;
  },

  async getOrderTimeline(id: string): Promise<OrderTimelineDetail> {
    return this.getTimeline(id);
  },

  /**
   * Transition order status via server-enforced state machine
   */
  async transitionStatus(
    id: string,
    toStatus: string,
    expectedVersion?: number,
    note?: string,
  ): Promise<any> {
    return apiClient.post(
      `/admin/orders/${id}/transition`,
      {
        to: toStatus,
        expectedVersion,
        note,
      },
      {
        headers: {
          'x-idempotency-key': crypto.randomUUID(),
        },
      },
    );
  },

  /**
   * Fetch cancellation quote
   */
  async getCancelQuote(id: string): Promise<CancelQuoteResponse> {
    return apiClient.get<CancelQuoteResponse>(`/admin/orders/${id}/cancel-quote`);
  },

  /**
   * Cancel an order
   */
  async cancelOrder(
    id: string,
    reasonCode?: string,
    note?: string,
    expectedVersion?: number,
  ): Promise<any> {
    return apiClient.post(
      `/admin/orders/${id}/cancel`,
      {
        reasonCode: reasonCode || 'STAFF_CANCELLED',
        note,
        expectedVersion,
      },
      {
        headers: {
          'x-idempotency-key': crypto.randomUUID(),
        },
      },
    );
  },

  /**
   * Fetch refund quote
   */
  async getRefundQuote(id: string): Promise<RefundQuoteResponse> {
    return apiClient.get<RefundQuoteResponse>(`/admin/orders/${id}/refund-quote`);
  },

  /**
   * Submit itemized refund
   */
  async createRefund(id: string, payload: any): Promise<any> {
    return apiClient.post(`/admin/orders/${id}/refunds`, payload, {
      headers: {
        'x-idempotency-key': crypto.randomUUID(),
      },
    });
  },

  async processRefund(idOrPayload: any, maybePayload?: any): Promise<any> {
    const id = typeof idOrPayload === 'string' ? idOrPayload : (idOrPayload.orderId || idOrPayload.orderNumber || idOrPayload.id);
    const payload = maybePayload || idOrPayload;
    return this.createRefund(id, payload);
  },

  /**
   * Resend receipt to customer
   */
  async resendReceipt(id: string): Promise<any> {
    return apiClient.post(`/admin/orders/${id}/receipt`, {});
  },

  /**
   * Trigger CSV download for current filters
   */
  getExportUrl(filters: OrdersQueryFilters = {}): string {
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.tab && filters.tab !== 'ALL') params.set('tab', filters.tab.toLowerCase());
    if (filters.channel && filters.channel !== 'All') params.set('channel', filters.channel);
    if (filters.status && filters.status !== 'All') params.set('status', filters.status);
    return `/api/proxy/admin/orders/export.csv?${params.toString()}`;
  },
};
