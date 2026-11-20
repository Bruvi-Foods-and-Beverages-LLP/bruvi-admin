import { apiClient } from '@/lib/api/client';
import type {
  LoyaltyDashboardData,
  LoyaltyRule,
  LoyaltyBurnRules,
  CatalogReward,
  LoyaltyTiersData,
  LoyaltyTransactionsResponse,
  CreateRewardPayload,
  UpdateRewardPayload,
  ManualAdjustPayload,
} from '@/types/loyalty';

export const LoyaltyApi = {
  /**
   * GET /v1/admin/loyalty/dashboard (A100)
   */
  async getDashboard(): Promise<LoyaltyDashboardData> {
    return await apiClient.get<LoyaltyDashboardData>('/admin/loyalty/dashboard');
  },

  /**
   * GET /v1/admin/loyalty/rules (A101)
   */
  async getRules(): Promise<{ earnRules: LoyaltyRule[]; burnRules: LoyaltyBurnRules }> {
    return await apiClient.get<{ earnRules: LoyaltyRule[]; burnRules: LoyaltyBurnRules }>('/admin/loyalty/rules');
  },

  /**
   * POST /v1/admin/loyalty/rules
   */
  async createRule(payload: Partial<LoyaltyRule>): Promise<LoyaltyRule> {
    return await apiClient.post<LoyaltyRule>('/admin/loyalty/rules', payload);
  },

  /**
   * PATCH /v1/admin/loyalty/rules/:id
   */
  async updateRule(id: string, payload: Partial<LoyaltyRule>): Promise<LoyaltyRule> {
    return await apiClient.patch<LoyaltyRule>(`/admin/loyalty/rules/${encodeURIComponent(id)}`, payload);
  },

  /**
   * GET /v1/admin/loyalty/rewards (A102)
   */
  async getRewards(): Promise<CatalogReward[]> {
    return await apiClient.get<CatalogReward[]>('/admin/loyalty/rewards');
  },

  /**
   * POST /v1/admin/loyalty/rewards (A103)
   */
  async createReward(payload: CreateRewardPayload): Promise<CatalogReward> {
    return await apiClient.post<CatalogReward>('/admin/loyalty/rewards', payload);
  },

  /**
   * PATCH /v1/admin/loyalty/rewards/:id
   */
  async updateReward(id: string, payload: UpdateRewardPayload): Promise<CatalogReward> {
    return await apiClient.patch<CatalogReward>(`/admin/loyalty/rewards/${encodeURIComponent(id)}`, payload);
  },

  /**
   * DELETE /v1/admin/loyalty/rewards/:id
   */
  async archiveReward(id: string): Promise<{ success: boolean; id: string }> {
    return await apiClient.delete<{ success: boolean; id: string }>(`/admin/loyalty/rewards/${encodeURIComponent(id)}`);
  },

  /**
   * GET /v1/admin/loyalty/tiers (A104)
   */
  async getTiers(): Promise<LoyaltyTiersData> {
    return await apiClient.get<LoyaltyTiersData>('/admin/loyalty/tiers');
  },

  /**
   * PATCH /v1/admin/loyalty/tiers/settings (A104)
   */
  async updateTierSettings(payload: {
    windowMonths?: number;
    gracePeriodDays?: number;
    instantUpgrade?: boolean;
    qualificationSettings?: any;
    benefitsMatrix?: any[];
    tierThresholds?: any;
  }): Promise<{ success: boolean; settings: any }> {
    return await apiClient.patch<{ success: boolean; settings: any }>('/admin/loyalty/tiers/settings', payload);
  },

  /**
   * GET /v1/admin/loyalty/transactions (A105)
   */
  async getTransactions(params: {
    page?: number;
    limit?: number;
    search?: string;
    eventType?: string;
    type?: string;
    store?: string;
    actor?: string;
    today?: boolean;
    flaggedOnly?: boolean;
  } = {}): Promise<LoyaltyTransactionsResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search?.trim()) searchParams.set('search', params.search.trim());
    if (params.eventType) searchParams.set('eventType', params.eventType);
    if (params.type) searchParams.set('type', params.type);
    if (params.store && params.store !== 'All 12' && params.store !== 'all') searchParams.set('store', params.store);
    if (params.actor && params.actor !== 'Anyone' && params.actor !== 'all') searchParams.set('actor', params.actor);
    if (params.today) searchParams.set('today', 'true');
    if (params.flaggedOnly) searchParams.set('flaggedOnly', 'true');

    const query = searchParams.toString();
    return await apiClient.get<LoyaltyTransactionsResponse>(`/admin/loyalty/transactions${query ? `?${query}` : ''}`);
  },

  /**
   * POST /v1/admin/loyalty/transactions/freeze (A105)
   */
  async freezeStaffAdjustments(payload: {
    actorName: string;
    reason?: string;
    storeName?: string;
  }): Promise<{ success: boolean; message: string; isFrozen: boolean }> {
    return await apiClient.post<{ success: boolean; message: string; isFrozen: boolean }>(
      '/admin/loyalty/transactions/freeze',
      payload,
    );
  },

  /**
   * POST /v1/admin/loyalty/adjust (A105)
   */
  async adjustPoints(payload: ManualAdjustPayload): Promise<{ success: boolean; message: string; newBalance: number }> {
    return await apiClient.post<{ success: boolean; message: string; newBalance: number }>('/admin/loyalty/adjust', payload);
  },
};

