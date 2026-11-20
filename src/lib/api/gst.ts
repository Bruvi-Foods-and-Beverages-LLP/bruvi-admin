import { apiClient } from '@/lib/api/client';

export type GstChargeTreatment = 'COMPOSITE' | 'SEPARATE' | 'OUTSIDE_SCOPE';

/** Effective GST rules for a store (or the global defaults), resolved by the backend. */
export interface GstRuleSet {
  outletId: string | null;
  restaurantRatePercent: 5 | 18;
  pricesIncludeGst: boolean;
  sacCode: string;
  deliveryFee: { treatment: GstChargeTreatment; ratePercent: number; inclusive: boolean; sacCode: string };
  supplier: { legalName: string | null; gstin: string | null; stateCode: string | null; mode: 'OUTLET' | 'ECO_9_5' };
  placeOfSupplyStateCode: string | null;
  requireGstin: boolean;
  warnings: string[];
}

export interface GstSettingsUpdate {
  restaurantRatePercent?: 5 | 18;
  pricesIncludeGst?: boolean;
  deliveryFeeTreatment?: GstChargeTreatment;
  deliveryFeeRatePercent?: 0 | 5 | 18;
  chargesIncludeGst?: boolean;
  supplierMode?: 'OUTLET' | 'ECO_9_5';
  operatorGstin?: string | null;
  legalName?: string | null;
  requireGstin?: boolean;
  /** Required: tax settings change what customers pay, so every change is explained. */
  reason: string;
}

export const GstApi = {
  getGlobal: () => apiClient.get<{ effective: GstRuleSet }>('/admin/gst/settings'),
  getForStore: (outletId: string) =>
    apiClient.get<{ effective: GstRuleSet }>(`/admin/gst/settings/stores/${encodeURIComponent(outletId)}`),
  updateGlobal: (dto: GstSettingsUpdate) => apiClient.put<{ effective: GstRuleSet }>('/admin/gst/settings', dto),
};
