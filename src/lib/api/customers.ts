import { apiClient } from '@/lib/api/client';
import {
  CustomersListResponse,
  CustomersQueryFilters,
  CustomerOverviewDetail,
  CustomerOrdersDetail,
  CustomerWalletDetail,
  CustomerLoyaltyDetail,
} from '@/types/customers';

/**
 * Enterprise Omnichannel Customers API Client
 * Connects directly to backend endpoints under /v1/admin/customers
 */
export const CustomersApi = {
  /**
   * Fetch paginated customer records, KPI summary cards, and segment distributions
   */
  async getCustomers(filters: CustomersQueryFilters): Promise<CustomersListResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.q?.trim()) params.set('q', filters.q.trim());
    if (filters.segment && filters.segment !== 'all') params.set('segment', filters.segment);
    if (filters.tier && filters.tier !== 'Any' && filters.tier !== 'any') {
      params.set('tier', filters.tier.toLowerCase());
    }

    const query = params.toString();
    const url = `/admin/customers${query ? `?${query}` : ''}`;
    return await apiClient.get<CustomersListResponse>(url);
  },

  /**
   * Fetch single customer full profile, overview telemetry, favourite drink, recent activity
   */
  async getCustomerDetail(id: string): Promise<CustomerOverviewDetail> {
    return await apiClient.get<CustomerOverviewDetail>(`/admin/customers/${encodeURIComponent(id)}`);
  },

  /**
   * Fetch customer orders history, monthly spend aggregation, and channel distribution
   */
  async getCustomerOrders(id: string): Promise<CustomerOrdersDetail> {
    return await apiClient.get<CustomerOrdersDetail>(`/admin/customers/${encodeURIComponent(id)}/orders`);
  },

  /**
   * Fetch customer wallet balance, PPI KYC limit, and ledger transactions
   */
  async getCustomerWallet(id: string): Promise<CustomerWalletDetail> {
    return await apiClient.get<CustomerWalletDetail>(`/admin/customers/${encodeURIComponent(id)}/wallet`);
  },

  /**
   * Fetch customer loyalty points ledger, tier progress, and unlocked rewards
   */
  async getCustomerLoyalty(id: string): Promise<CustomerLoyaltyDetail> {
    return await apiClient.get<CustomerLoyaltyDetail>(`/admin/customers/${encodeURIComponent(id)}/loyalty`);
  },

  /**
   * Fetch customer internal staff notes
   */
  async getCustomerNotes(id: string): Promise<any[]> {
    return await apiClient.get<any[]>(`/admin/customers/${encodeURIComponent(id)}/notes`);
  },

  /**
   * Add manual loyalty points adjustment
   */
  async addPoints(
    id: string,
    payload: { points: number; reason: string; note?: string },
  ): Promise<{ success: boolean; message: string; pointsBalance?: number }> {
    return await apiClient.post(`/admin/customers/${encodeURIComponent(id)}/points`, payload, {
      headers: { 'x-idempotency-key': crypto.randomUUID() },
    });
  },

  /**
   * Credit or debit customer wallet balance
   */
  async adjustWallet(
    id: string,
    payload: { amount: number; type: 'credit' | 'debit'; reason: string },
  ): Promise<{ success: boolean; message: string; balance?: number }> {
    return await apiClient.post(`/admin/customers/${encodeURIComponent(id)}/wallet/adjust`, payload, {
      headers: { 'x-idempotency-key': crypto.randomUUID() },
    });
  },

  /**
   * Issue promotional voucher or drink coupon
   */
  async issueCoupon(
    id: string,
    payload: { couponType: string; note?: string },
  ): Promise<{ success: boolean; message: string }> {
    return await apiClient.post(`/admin/customers/${encodeURIComponent(id)}/coupon`, payload);
  },

  /**
   * Dispatch push/WhatsApp/SMS notification to customer
   */
  async sendMessage(
    id: string,
    payload: { channel: 'push' | 'whatsapp' | 'sms'; message: string },
  ): Promise<{ success: boolean; message: string }> {
    return await apiClient.post(`/admin/customers/${encodeURIComponent(id)}/message`, payload);
  },

  /**
   * Add internal staff note to customer profile
   */
  async addCustomerNote(
    id: string,
    payload: { content: string },
  ): Promise<{ success: boolean; message: string; note?: any }> {
    return await apiClient.post(`/admin/customers/${encodeURIComponent(id)}/notes`, payload);
  },

  /**
   * Get CSV export download URL
   */
  getExportCsvUrl(filters: Partial<CustomersQueryFilters> = {}): string {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.segment && filters.segment !== 'all') params.set('segment', filters.segment);
    if (filters.tier && filters.tier !== 'any' && filters.tier !== 'Any') {
      params.set('tier', filters.tier.toLowerCase());
    }
    const query = params.toString();
    return `/api/proxy/admin/customers/export.csv${query ? `?${query}` : ''}`;
  },
};
