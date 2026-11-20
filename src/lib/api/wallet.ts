import { apiClient } from '@/lib/api/client';

export interface WalletSummary {
  totalBalance: number;
  accountsCount: number;
  fundedAccounts: number;
  averageBalance: number;
  nearLimitCount: number;
  ppiLimit: number;
  last30Days: {
    loaded: number;
    loadedCount: number;
    spent: number;
    spentCount: number;
    refunded: number;
    refundedCount: number;
    adjusted: number;
    adjustedCount: number;
  };
}

export interface WalletAccountRow {
  userId: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  balance: number;
  loadedLifetime: number;
  lastActivityAt: string | null;
  limitUsedPercent: number;
}

export type WalletTxType = 'Top-up' | 'Spend' | 'Refund' | 'Goodwill' | 'Adjustment';

export interface WalletTransactionRow {
  id: string;
  userId: string;
  customerName: string;
  customerCode: string;
  type: WalletTxType;
  description: string;
  amount: number;
  isCredit: boolean;
  balanceAfter: number;
  createdAt: string;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type WalletTxFilter = 'all' | 'topup' | 'spend' | 'refund' | 'adjustment';

export const WalletAdminApi = {
  getSummary: () => apiClient.get<WalletSummary>('/admin/wallet/summary'),
  getAccounts: (p: { q?: string; page: number; limit: number }) =>
    apiClient.get<Paged<WalletAccountRow>>('/admin/wallet/accounts', {
      params: { q: p.q || undefined, page: p.page, limit: p.limit },
    }),
  getTransactions: (p: { q?: string; type: WalletTxFilter; page: number; limit: number }) =>
    apiClient.get<Paged<WalletTransactionRow>>('/admin/wallet/transactions', {
      params: { q: p.q || undefined, type: p.type, page: p.page, limit: p.limit },
    }),
};
