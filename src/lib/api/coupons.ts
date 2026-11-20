import { apiClient } from "@/lib/api/client";
import type { Paged } from "@/lib/api/wallet";

export type CouponOfferType = "PERCENT" | "FLAT" | "BOGO" | "FREE_ITEM";
export type CouponStatus = "ACTIVE" | "SCHEDULED" | "PAUSED" | "EXPIRED" | "EXHAUSTED" | "ARCHIVED";
export type CouponChannel = "APP" | "KIOSK" | "COUNTER" | "QR";
export type CouponServiceType = "PICKUP" | "DINE_IN" | "DELIVERY";
export type CouponStatusFilter = "all" | "active" | "scheduled" | "paused" | "expired" | "archived";

/** Editable coupon fields. Money in rupees, percent as 1–100, times as "HH:MM" store local. */
export interface CouponInput {
  code: string;
  title: string;
  description: string;
  offerType: CouponOfferType;
  percentOff: number | null;
  amountOff: number | null;
  maxDiscount: number | null;
  minOrder: number;
  scope: { type: "ALL" | "CATEGORY" | "PRODUCTS"; categoryIds: string[]; productIds: string[] };
  /** 0 = Sunday … 6 = Saturday; empty = every day. */
  validDays: number[];
  window: { start: string; end: string } | null;
  startsAt: string | null;
  endsAt: string | null;
  channels: CouponChannel[];
  serviceTypes: CouponServiceType[];
  redemptionMode: "CODE" | "AUTO";
  perCustomerLimit: number | null;
  perCustomerPeriod: "LIFETIME" | "DAY";
  maxRedemptions: number | null;
  budget: number | null;
  budgetAlertPct: number;
  outletIds: string[] | null;
  stackWithLoyalty: boolean;
  stackWithClub: boolean;
  isActive: boolean;
}

export interface AdminCoupon extends CouponInput {
  id: string;
  displayOrder: number;
  redemptionCount: number;
  status: CouponStatus;
  statusText: string;
  offerText: string;
  scheduleText: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponListItem {
  id: string;
  code: string;
  title: string;
  offerType: CouponOfferType;
  offerText: string;
  scheduleText: string;
  redemptionMode: "CODE" | "AUTO";
  channels: CouponChannel[];
  status: CouponStatus;
  statusText: string;
  redemptions: number;
  maxRedemptions: number | null;
  discountGiven: number;
  orderRevenue: number;
  budget: number | null;
  budgetUsedPercent: number | null;
  endsAt: string | null;
  lastRedeemedAt: string | null;
}

export interface CouponSummary {
  totalCoupons: number;
  activeCount: number;
  scheduledCount: number;
  pausedCount: number;
  autoApplyCount: number;
  last30Days: {
    redemptions: number;
    previousRedemptions: number;
    uniqueCustomers: number;
    discountGiven: number;
    orderRevenue: number;
    averageDiscount: number;
    discountShareOfRevenue: number;
  };
  topCoupon: { id: string; code: string; redemptions: number } | null;
}

export interface CouponAnalytics {
  since: string;
  sinceText: string;
  redemptions: number;
  uniqueCustomers: number;
  orderRevenue: number;
  discountGiven: number;
  averageDiscount: number;
  budget: number | null;
  budgetUsedPercent: number | null;
  budgetAlertReached: boolean;
  maxRedemptions: number | null;
  last7Days: { date: string; label: string; redemptions: number; off: boolean }[];
  activeDaysLast7: number;
  guard: {
    rules: string[];
    blockedThisWeek: number;
    customersBlocked: number;
    repeatAttempters: number;
    byReason: { code: string; label: string; count: number }[];
    recent: { at: string; customerId: string; customerName: string; attempts: number; reason: string }[];
  };
}

export interface CouponRedemption {
  customerId: string;
  customerName: string;
  orderId: string | null;
  orderNumber: string | null;
  orderTotal: number;
  discount: number;
  redeemedAt: string;
}

export interface CouponOptions {
  categories: { id: string; name: string; productCount: number }[];
  products: { id: string; name: string; categoryId: string }[];
  outlets: { id: string; name: string }[];
  coupons: { id: string; code: string }[];
}

const base = "/admin/coupons";

export const CouponsApi = {
  summary: () => apiClient.get<CouponSummary>(`${base}/summary`),
  options: () => apiClient.get<CouponOptions>(`${base}/options`),
  list: (p: { q?: string; status: CouponStatusFilter; page: number; limit: number }) =>
    apiClient.get<Paged<CouponListItem>>(base, {
      params: { q: p.q || undefined, status: p.status, page: p.page, limit: p.limit },
    }),
  get: (id: string) => apiClient.get<AdminCoupon>(`${base}/${encodeURIComponent(id)}`),
  analytics: (id: string) => apiClient.get<CouponAnalytics>(`${base}/${encodeURIComponent(id)}/analytics`),
  redemptions: (id: string, p: { page: number; limit: number }) =>
    apiClient.get<Paged<CouponRedemption>>(`${base}/${encodeURIComponent(id)}/redemptions`, { params: p }),
  create: (body: CouponInput) => apiClient.post<AdminCoupon>(base, body),
  update: (id: string, body: Partial<CouponInput>) =>
    apiClient.patch<AdminCoupon>(`${base}/${encodeURIComponent(id)}`, body),
  pause: (id: string) => apiClient.post<AdminCoupon>(`${base}/${encodeURIComponent(id)}/pause`, {}),
  resume: (id: string) => apiClient.post<AdminCoupon>(`${base}/${encodeURIComponent(id)}/resume`, {}),
  archive: (id: string) => apiClient.delete<{ success: boolean }>(`${base}/${encodeURIComponent(id)}`),
};

export const EMPTY_COUPON: CouponInput = {
  code: "",
  title: "",
  description: "",
  offerType: "PERCENT",
  percentOff: 10,
  amountOff: null,
  maxDiscount: null,
  minOrder: 0,
  scope: { type: "ALL", categoryIds: [], productIds: [] },
  validDays: [],
  window: null,
  startsAt: null,
  endsAt: null,
  channels: ["APP", "KIOSK", "COUNTER", "QR"],
  serviceTypes: ["PICKUP", "DINE_IN", "DELIVERY"],
  redemptionMode: "CODE",
  perCustomerLimit: 1,
  perCustomerPeriod: "DAY",
  maxRedemptions: null,
  budget: null,
  budgetAlertPct: 80,
  outletIds: null,
  stackWithLoyalty: true,
  stackWithClub: true,
  isActive: true,
};
