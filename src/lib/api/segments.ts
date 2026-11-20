import { apiClient } from '@/lib/api/client';
import type { Paged } from '@/lib/api/wallet';

export interface SegmentRules {
  tiers?: ('SILVER' | 'GOLD' | 'PLATINUM')[];
  minLifetimeSpend?: number;
  maxLifetimeSpend?: number;
  minVisits?: number;
  maxVisits?: number;
  orderedWithinDays?: number;
  notOrderedForDays?: number;
  joinedWithinDays?: number;
  clubMember?: boolean;
  hasWalletBalance?: boolean;
}

export interface SegmentSummary {
  id: string;
  name: string;
  description: string;
  builtIn: boolean;
  rules: SegmentRules;
  ruleSummary: string[];
  memberCount: number;
  percentOfCustomers: number;
  averageLifetime: number;
  walletTotal: number;
  createdAt: string | null;
}

export interface SegmentsResponse {
  totalCustomers: number;
  customSegmentsAvailable: boolean;
  segments: SegmentSummary[];
}

export interface SegmentMember {
  id: string;
  code: string;
  name: string;
  phone: string;
  tier: string;
  visits: number;
  lifetime: number;
  wallet: number;
  lastOrderAt: string | null;
  club: boolean;
}

export const SegmentsApi = {
  list: () => apiClient.get<SegmentsResponse>('/admin/segments'),
  preview: (rules: SegmentRules) =>
    apiClient.post<{ memberCount: number; totalCustomers: number; sample: { id: string; name: string; code: string }[] }>(
      '/admin/segments/preview',
      { rules },
    ),
  members: (id: string, p: { page: number; limit: number }) =>
    apiClient.get<Paged<SegmentMember> & { segmentName: string }>(`/admin/segments/${encodeURIComponent(id)}/members`, {
      params: { page: p.page, limit: p.limit },
    }),
  create: (body: { name: string; description?: string; rules: SegmentRules }) =>
    apiClient.post<SegmentSummary>('/admin/segments', body),
  remove: (id: string) => apiClient.delete<{ success: boolean }>(`/admin/segments/${encodeURIComponent(id)}`),
};
