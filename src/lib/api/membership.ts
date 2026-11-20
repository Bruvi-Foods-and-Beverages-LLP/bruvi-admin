import { apiClient } from "@/lib/api/client";

/**
 * BRUVI Club membership admin API (A110–A114). Every type mirrors
 * bruvi_backend/src/modules/membership/membership.types.ts field for field;
 * the contract is bruvi_backend/doc/MEMBERSHIP_API.md. Money is integer paise.
 */


export type AdminPlanStatus = 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'ARCHIVED';
export type AdminSubscriptionStatus =
  | 'PENDING_AUTH'
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'PAUSED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface AdminBenefitDto {
  id: string | null;
  kind: 'DAILY_DRINK' | 'PERCENT_OFF' | 'LAB_TASTING' | 'BIRTHDAY_DRINK' | 'PRIORITY_PICKUP' | 'FREE_SIZE_UPGRADE';
  title: string;
  detail: string;
  perDay: number | null;
  maxValuePaise: number | null;
  percent: number | null;
  capPaise: number | null;
  perMonth: number | null;
  categoryIds: string[] | null;
}

export interface AdminPlanDto {
  id: string;
  code: string;
  name: string;
  badge: string | null;
  subtitle: string;
  description: string | null;
  valueNote: string | null;
  period: 'MONTH' | 'YEAR';
  pricePaise: number;
  monthlyEquivalentPaise: number;
  taxRatePercent: number;
  taxInclusive: boolean;
  taxPaise: number;
  trialDays: number;
  status: AdminPlanStatus;
  /** "Live" / "Draft" / "Scheduled · 1 Nov" / "Sign-ups paused" */
  statusLabel: string;
  signupsPaused: boolean;
  allStores: boolean;
  storeIds: string[];
  storeCount: number;
  billingProvider: 'RAZORPAY';
  cancellationPolicy: string;
  launchAt: string | null;
  liveSince: string | null;
  liveSinceFormatted: string | null;
  displayOrder: number;
  expectedDrinksPerDay: number;
  drinkCostPaise: number;
  otherCostPaise: number;
  benefits: AdminBenefitDto[];
  /** "1 regular drink/day + 10% off food" */
  benefitSummary: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnitEconomicsDto {
  /** Per member per plan period. */
  netRevenuePaise: number;
  drinksCostPaise: number;
  drinksLabel: string;
  otherCostPaise: number;
  expectedCostPaise: number;
  marginPaise: number;
  marginPercent: number;
  /** Drinks per day at which the drink cost equals the net price (null without a drink benefit). */
  breakEvenDrinksPerDay: number | null;
}

export interface AdminPlanCardDto extends AdminPlanDto {
  activeCount: number;
  trialingCount: number;
  pastDueCount: number;
  mrrPaise: number;
  churnPercent: number | null;
  economics: UnitEconomicsDto;
}

export interface AdminSummaryDto {
  mrrPaise: number;
  mrrFormatted: string;
  mrrDeltaPercent: number | null;
  activeMembers: number;
  trialingMembers: number;
  pastDueMembers: number;
  totalSubscribers: number;
  churnPercent: number | null;
  churnDeltaPts: number | null;
  trialToPaidPercent: number | null;
  trialDays: number;
  drinksPerDay: number | null;
  drinksPerDayDelta: number | null;
  breakEvenDrinksPerDay: number | null;
  drinkPlanName: string | null;
}

export interface EconomicsMonthDto {
  month: string; // "2026-09"
  label: string; // "Sep"
  revenuePaise: number;
  costPaise: number;
}

export interface EconomicsPlanRowDto {
  planId: string | null;
  planName: string;
  revenuePaise: number;
  costPaise: number;
  marginPercent: number | null;
}

export interface AdminEconomicsDto {
  months: EconomicsMonthDto[];
  monthLabel: string;
  plans: EconomicsPlanRowDto[];
  total: EconomicsPlanRowDto;
  note: string | null;
}

export interface PlanOverviewDto {
  growth: { month: string; label: string; active: number }[];
  activeNow: number;
  netNewThisMonth: number;
  mrrPaise: number;
  mrrSharePercent: number | null;
  usage: { label: string; percent: number }[];
  usageMean: number | null;
  cancelReasons: { reason: string; label: string; count: number; percent: number }[];
  cancellationsThisMonth: number;
  retention: { label: string; percent: number | null }[];
  pricingHistory: { label: string; pricePaise: number; current: boolean }[];
}

export interface PlanActivityDto {
  id: string;
  eventType: string;
  summary: string;
  actorName: string | null;
  at: string;
  atFormatted: string;
}

export interface AdminSubscriptionRowDto {
  id: string;
  subscriptionNumber: string;
  customerId: string;
  customerName: string;
  phoneMasked: string;
  homeStoreName: string | null;
  planId: string;
  planName: string;
  status: AdminSubscriptionStatus;
  statusLabel: string;
  cancelAtPeriodEnd: boolean;
  startedAt: string | null;
  startedFormatted: string | null;
  renewsAt: string | null;
  renewsFormatted: string | null;
  renewsNote: string | null;
  usage: { kind: 'DRINKS' | 'TRIAL' | 'ORDERS' | 'NONE'; used: number; total: number; label: string; progress: number | null };
  paymentLabel: string;
  paymentIssue: string | null;
  ltvPaise: number;
}

export interface Paged<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  counts: { active: number; trialing: number; pastDue: number };
}

export interface DunningStepDto {
  step: string;
  dayOffset: number;
  title: string;
  detail: string;
  count: number;
  danger: boolean;
}

export interface PastDueDto {
  count: number;
  atRiskPaise: number;
  atRiskFormatted: string;
  recoveredPercent: number | null;
  recoveredMonthLabel: string;
  steps: DunningStepDto[];
}

export interface AdminSubscriptionDetailDto {
  id: string;
  subscriptionNumber: string;
  status: AdminSubscriptionStatus;
  statusLabel: string;
  customer: {
    id: string;
    name: string;
    phoneMasked: string;
    customerCode: string;
    tier: string | null;
    homeStoreId: string | null;
    homeStoreName: string | null;
  };
  plan: { id: string; name: string; period: 'MONTH' | 'YEAR'; pricePaise: number };
  memberSinceFormatted: string | null;
  nextRenewal: { pricePaise: number; date: string | null; dateFormatted: string | null; inDays: number | null; note: string };
  paymentMethod: { title: string; detail: string | null };
  mandate: { maskedId: string | null; status: string | null; maxPaise: number | null; label: string };
  provider: { maskedSubscriptionId: string | null; label: string };
  cycle: {
    kind: 'DRINKS' | 'DISCOUNT' | 'NONE';
    used: number;
    total: number;
    dayOfCycle: number;
    daysInCycle: number;
    valueUsedPaise: number;
    todayRedeemed: boolean;
    todayLabel: string;
    /** One cell per day of the cycle. */
    days: ('REDEEMED' | 'REMAINING' | 'TODAY' | 'MISSED')[];
  };
  actions: {
    canPause: boolean;
    canResume: boolean;
    canChangePlan: boolean;
    canRefund: boolean;
    canCancel: boolean;
    refundPreviewPaise: number;
    refundLabel: string;
    changePlanLabel: string;
    cancelLabel: string;
  };
  invoicesSummary: { paidCount: number; lifetimePaise: number };
}

export interface AdminRedemptionDto {
  id: string;
  kind: 'DAILY_DRINK' | 'PERCENT_OFF';
  title: string;
  itemName: string | null;
  orderId: string;
  orderCode: string | null;
  storeName: string | null;
  valuePaise: number;
  at: string;
  atFormatted: string;
  reversed: boolean;
}

export interface AdminInvoiceDto {
  id: string;
  invoiceNumber: string;
  periodLabel: string;
  method: string;
  amountPaise: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'VOID';
  statusLabel: string;
  paidAt: string | null;
  failureReason: string | null;
}

export interface AdminEventDto {
  id: string;
  eventType: string;
  title: string;
  detail: string | null;
  tone: 'info' | 'success' | 'warning' | 'danger' | 'muted';
  at: string;
  atFormatted: string;
}

export interface AdminNoteDto {
  id: string;
  body: string;
  authorName: string | null;
  at: string;
  atFormatted: string;
}

export interface AdminOptionsDto {
  stores: { id: string; code: string; name: string }[];
  categories: { id: string; name: string }[];
  plans: { id: string; name: string; status: AdminPlanStatus }[];
  canWrite: boolean;
}

// ------------------------------------------------------------------ inputs

export type BenefitKind = AdminBenefitDto["kind"];
export type CancelReason = "PRICE_TOO_HIGH" | "NOT_USING_ENOUGH" | "MOVED_AWAY" | "MENU_CHOICE" | "OTHER";

export interface BenefitInput {
  kind: BenefitKind;
  title: string;
  detail: string;
  perDay?: number | null;
  maxValuePaise?: number | null;
  percent?: number | null;
  capPaise?: number | null;
  perMonth?: number | null;
  categoryIds?: string[] | null;
}

export interface PlanInput {
  name: string;
  badge?: string | null;
  subtitle: string;
  description?: string | null;
  valueNote?: string | null;
  period: "MONTH" | "YEAR";
  pricePaise: number;
  taxRatePercent: number;
  taxInclusive: boolean;
  trialDays: 0 | 7 | 14;
  allStores: boolean;
  storeIds: string[];
  cancellationPolicy: string;
  displayOrder: number;
  expectedDrinksPerDay: number;
  drinkCostPaise: number;
  otherCostPaise: number;
  benefits: BenefitInput[];
}

export interface CreatePlanInput extends PlanInput {
  status: "DRAFT" | "SCHEDULED" | "LIVE";
  launchAt?: string | null;
}

export interface SubscriptionsQuery {
  q?: string;
  planId?: string;
  status?: AdminSubscriptionStatus | "ALL";
  outletId?: string;
  paymentMethod?: "UPI_AUTOPAY" | "CARD" | "EMANDATE" | "GIFT";
  page: number;
  pageSize: number;
}

export interface GiftInput {
  customer: string;
  planId: string;
  months: number;
  message?: string;
}

// ------------------------------------------------------------------ client

const base = "/v1/admin/membership";
const enc = encodeURIComponent;

export const MembershipApi = {
  summary: () => apiClient.get<AdminSummaryDto>(`${base}/summary`),
  options: () => apiClient.get<AdminOptionsDto>(`${base}/options`),
  plans: () => apiClient.get<AdminPlanCardDto[]>(`${base}/plans`),
  economics: (months = 6) => apiClient.get<AdminEconomicsDto>(`${base}/plans/economics`, { params: { months } }),
  plan: (id: string) => apiClient.get<AdminPlanDto>(`${base}/plans/${enc(id)}`),
  createPlan: (body: CreatePlanInput) => apiClient.post<AdminPlanDto>(`${base}/plans`, body),
  updatePlan: (id: string, body: Partial<PlanInput> & { launchAt?: string | null }) =>
    apiClient.patch<AdminPlanDto>(`${base}/plans/${enc(id)}`, body),
  duplicatePlan: (id: string) => apiClient.post<AdminPlanDto>(`${base}/plans/${enc(id)}/duplicate`, {}),
  publishPlan: (id: string, launchAt?: string | null) =>
    apiClient.post<AdminPlanDto>(`${base}/plans/${enc(id)}/publish`, { launchAt: launchAt ?? null }),
  pauseSignups: (id: string) => apiClient.post<AdminPlanDto>(`${base}/plans/${enc(id)}/pause-signups`, {}),
  resumeSignups: (id: string) => apiClient.post<AdminPlanDto>(`${base}/plans/${enc(id)}/resume-signups`, {}),
  archivePlan: (id: string) => apiClient.post<AdminPlanDto>(`${base}/plans/${enc(id)}/archive`, {}),
  planOverview: (id: string) => apiClient.get<PlanOverviewDto>(`${base}/plans/${enc(id)}/overview`),
  planActivity: (id: string) => apiClient.get<PlanActivityDto[]>(`${base}/plans/${enc(id)}/activity`),

  subscriptions: (q: SubscriptionsQuery) =>
    apiClient.get<Paged<AdminSubscriptionRowDto>>(`${base}/subscriptions`, { params: { ...q } }),
  pastDue: () => apiClient.get<PastDueDto>(`${base}/subscriptions/past-due`),
  sendPayLinks: (subscriptionIds?: string[]) =>
    apiClient.post<{ sent: number }>(`${base}/subscriptions/pay-links`, subscriptionIds?.length ? { subscriptionIds } : {}),
  gift: (body: GiftInput) => apiClient.post<AdminSubscriptionDetailDto>(`${base}/subscriptions/gift`, body),
  /** Proxy URL for the CSV download (the browser follows it with the session cookie). */
  exportUrl: (q: Omit<SubscriptionsQuery, "page" | "pageSize">) => {
    const params = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => v && v !== "ALL" && params.append(k, String(v)));
    const qs = params.toString();
    return `/api/proxy${base}/subscriptions/export${qs ? `?${qs}` : ""}`;
  },

  subscription: (id: string) => apiClient.get<AdminSubscriptionDetailDto>(`${base}/subscriptions/${enc(id)}`),
  redemptions: (id: string, page = 1, pageSize = 25) =>
    apiClient.get<{ items: AdminRedemptionDto[]; total: number }>(`${base}/subscriptions/${enc(id)}/redemptions`, {
      params: { page, pageSize },
    }),
  invoices: (id: string) => apiClient.get<AdminInvoiceDto[]>(`${base}/subscriptions/${enc(id)}/invoices`),
  invoiceUrl: (id: string, invoiceId: string) => `/api/proxy${base}/subscriptions/${enc(id)}/invoices/${enc(invoiceId)}/download`,
  events: (id: string) => apiClient.get<AdminEventDto[]>(`${base}/subscriptions/${enc(id)}/events`),
  notes: (id: string) => apiClient.get<AdminNoteDto[]>(`${base}/subscriptions/${enc(id)}/notes`),
  addNote: (id: string, body: string) => apiClient.post<AdminNoteDto[]>(`${base}/subscriptions/${enc(id)}/notes`, { body }),
  pause: (id: string, weeks: number) =>
    apiClient.post<AdminSubscriptionDetailDto>(`${base}/subscriptions/${enc(id)}/pause`, { weeks }),
  resume: (id: string) => apiClient.post<AdminSubscriptionDetailDto>(`${base}/subscriptions/${enc(id)}/resume`, {}),
  changePlan: (id: string, planId: string) =>
    apiClient.post<AdminSubscriptionDetailDto>(`${base}/subscriptions/${enc(id)}/change-plan`, { planId, when: "CYCLE_END" }),
  refund: (id: string, reason: string) =>
    apiClient.post<AdminSubscriptionDetailDto>(`${base}/subscriptions/${enc(id)}/refund`, { reason }),
  cancel: (id: string, body: { reason: CancelReason | "ADMIN"; immediate: boolean; note?: string }) =>
    apiClient.post<AdminSubscriptionDetailDto>(`${base}/subscriptions/${enc(id)}/cancel`, body),
};

// ------------------------------------------------------------------ formatting

/** ₹1,999 from paise (whole rupees unless there are paise). */
export function inr(paise: number | null | undefined): string {
  const p = Math.round(paise ?? 0);
  const sign = p < 0 ? "−" : "";
  const abs = Math.abs(p);
  const rest = abs % 100;
  return `${sign}₹${Math.floor(abs / 100).toLocaleString("en-IN")}${rest ? `.${String(rest).padStart(2, "0")}` : ""}`;
}

/** ₹86.7 L / ₹2.15 L / ₹4,320 */
export function inrCompact(paise: number | null | undefined): string {
  const r = Math.round((paise ?? 0) / 100);
  const abs = Math.abs(r);
  const sign = r < 0 ? "−" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${Number((abs / 1_00_00_000).toFixed(2))} Cr`;
  if (abs >= 1_00_000) return `${sign}₹${Number((abs / 1_00_000).toFixed(abs >= 10_00_000 ? 1 : 2))} L`;
  return `${sign}₹${abs.toLocaleString("en-IN")}`;
}

export const periodWord = (p: "MONTH" | "YEAR") => (p === "YEAR" ? "year" : "month");
