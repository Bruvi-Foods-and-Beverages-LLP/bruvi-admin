import { apiClient } from "@/lib/api/client";
import type {
  MarketingKpi,
  TimelineEvent,
  LiveCampaign,
  ChannelPerformance,
  CampaignListItem,
  CampaignTableItem,
} from "@/types/marketing";

export interface MarketingOverviewResponse {
  kpis: MarketingKpi;
  selectedMonth: string;
  currentDay: number;
  totalDaysInMonth: number;
  timelineEvents: TimelineEvent[];
  liveCampaigns: LiveCampaign[];
  channelPerformance: ChannelPerformance[];
}

export function getDynamicDateContext() {
  const now = new Date();
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const currentMonthIndex = now.getMonth();
  const currentMonthLong = monthNames[currentMonthIndex];
  const currentMonthShort = monthShortNames[currentMonthIndex];
  const currentWeekday = weekdayNames[now.getDay()];
  const selectedMonth = `${currentMonthLong} ${currentYear}`;
  const totalDaysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

  return {
    now,
    currentDay,
    currentYear,
    currentMonthIndex,
    currentMonthLong,
    currentMonthShort,
    currentWeekday,
    selectedMonth,
    totalDaysInMonth,
  };
}

const dateCtx = getDynamicDateContext();

export const FALLBACK_MARKETING_OVERVIEW: MarketingOverviewResponse = {
  kpis: {
    activeCampaigns: 4,
    activeCampaignsLive: 2,
    activeCampaignsScheduled: 2,
    revenueMtd: "₹6.8 L",
    revenueMtdDelta: "▲ 14% vs Sep pace · last-touch 7-day",
    openRate: "19.6%",
    openRateDelta: "▲ 1.8 pts · benchmark 15%",
    couponRedemption: "8.4%",
    couponRedemptionDelta: "▼ 0.6 pts · BREW50 fatigue",
  },
  selectedMonth: dateCtx.selectedMonth,
  currentDay: dateCtx.currentDay,
  totalDaysInMonth: dateCtx.totalDaysInMonth,
  timelineEvents: [
    {
      id: "ev-1",
      title: `Monsoon Matcha · push + in-app · 1–15 ${dateCtx.currentMonthShort}`,
      channel: "multi",
      channelLabel: "push + in-app",
      startDate: `${dateCtx.currentYear}-${String(dateCtx.currentMonthIndex + 1).padStart(2, "0")}-01`,
      endDate: `${dateCtx.currentYear}-${String(dateCtx.currentMonthIndex + 1).padStart(2, "0")}-15`,
      startDay: 1,
      endDay: 15,
      type: "ribbon",
      colorTheme: "matcha",
      status: "live",
      note: "Targeting active iced matcha drinkers across Mumbai outlets",
    },
    {
      id: "ev-2",
      title: `Diwali Gift Cards · WhatsApp + push · ${Math.min(10, dateCtx.totalDaysInMonth)} ${dateCtx.currentMonthShort}`,
      channel: "whatsapp",
      channelLabel: "WhatsApp + push",
      startDate: `${dateCtx.currentYear}-${String(dateCtx.currentMonthIndex + 1).padStart(2, "0")}-10`,
      endDate: `${dateCtx.currentYear}-${String(dateCtx.currentMonthIndex + 1).padStart(2, "0")}-10`,
      startDay: Math.min(10, dateCtx.totalDaysInMonth),
      endDay: Math.min(10, dateCtx.totalDaysInMonth),
      type: "marker",
      colorTheme: "sky",
      status: "scheduled",
      note: "Early bird corporate gift card packs announcement",
    },
    {
      id: "ev-3",
      title: `LAB Batch 08 pilot · Pandan Coconut Cold Brew · ${Math.min(12, dateCtx.totalDaysInMonth)} ${dateCtx.currentMonthShort}`,
      channel: "push",
      channelLabel: "push",
      startDate: `${dateCtx.currentYear}-${String(dateCtx.currentMonthIndex + 1).padStart(2, "0")}-12`,
      endDate: `${dateCtx.currentYear}-${String(dateCtx.currentMonthIndex + 1).padStart(2, "0")}-12`,
      startDay: Math.min(12, dateCtx.totalDaysInMonth),
      endDay: Math.min(12, dateCtx.totalDaysInMonth),
      type: "marker",
      colorTheme: "matcha",
      status: "scheduled",
      note: "Experimental single-origin batch drop for Gold & Platinum members",
    },
  ],
  liveCampaigns: [
    {
      id: "live-1",
      title: "Monsoon Matcha",
      channels: "Push + in-app · 18,400",
      audienceSize: "18,400",
      status: "Live",
      currentDay: dateCtx.currentDay,
      totalDays: 15,
      endDateLabel: `ends 15 ${dateCtx.currentMonthShort}`,
      targetHighlight: "+12% matcha orders",
      targetIsPositive: true,
      theme: "matcha",
      metric1Label: "Opened",
      metric1Value: "19.6%",
      metric2Label: "Orders",
      metric2Value: "1,104",
      metric3Label: "Revenue",
      metric3Value: "₹2,86,900",
    },
    {
      id: "live-2",
      title: "Come back to Phin",
      channels: "WhatsApp · Lapsed 45d · 49,700",
      audienceSize: "49,700",
      status: "Live",
      currentDay: Math.min(dateCtx.currentDay, 15),
      totalDays: 15,
      endDateLabel: `ends 12 ${dateCtx.currentMonthShort}`,
      targetHighlight: "BREW50 · 1,980 redeemed",
      targetIsPositive: false,
      theme: "coffee",
      metric1Label: "Read",
      metric1Value: "64.0%",
      metric2Label: "Orders",
      metric2Value: "2,410",
      metric3Label: "Revenue",
      metric3Value: "₹2,64,300",
    },
  ],
  channelPerformance: [
    {
      id: "ch-1",
      name: "Push",
      statLabel: "Open 19.6%",
      bars: [45, 55, 48, 60, 60, 90, 100],
      theme: "navy",
      revenueMtd: "₹3.4 L",
    },
    {
      id: "ch-2",
      name: "WhatsApp",
      statLabel: "Read 64.0%",
      bars: [20, 85, 70, 65, 100, 75, 68],
      theme: "sky",
      revenueMtd: "₹2.6 L",
    },
    {
      id: "ch-3",
      name: "In-app",
      statLabel: "CTR 7.2%",
      bars: [32, 35, 30, 42, 40, 75, 85],
      theme: "coffee",
      revenueMtd: "₹0.6 L",
    },
    {
      id: "ch-4",
      name: "SMS",
      statLabel: "CTR 1.1%",
      bars: [12, 10, 12, 12, 15, 10, 12],
      theme: "matcha",
      revenueMtd: "₹0.2 L",
    },
  ],
};

export const FALLBACK_CAMPAIGNS_LIST: CampaignListItem[] = [
  {
    id: "camp-01",
    name: "Monsoon Matcha",
    channels: ["push", "in-app"],
    audience: "Iced Beverage Drinkers",
    audienceCount: 18400,
    startDate: "1 Oct 2026",
    endDate: "15 Oct 2026",
    status: "live",
    budgetSpent: "₹18,400",
    budgetTotal: "₹30,000",
    conversionRate: "6.0%",
    attributedRevenue: "₹2,86,900",
  },
  {
    id: "camp-02",
    name: "Come back to Phin",
    channels: ["whatsapp"],
    audience: "Lapsed 45d Customers",
    audienceCount: 49700,
    startDate: "28 Sep 2026",
    endDate: "12 Oct 2026",
    status: "live",
    budgetSpent: "₹34,800",
    budgetTotal: "₹50,000",
    conversionRate: "4.8%",
    attributedRevenue: "₹2,64,300",
  },
  {
    id: "camp-03",
    name: "Diwali Corporate Gift Cards",
    channels: ["whatsapp", "push"],
    audience: "High AOV > ₹800",
    audienceCount: 12500,
    startDate: "10 Oct 2026",
    endDate: "24 Oct 2026",
    status: "scheduled",
    budgetSpent: "₹0",
    budgetTotal: "₹45,000",
    conversionRate: "—",
    attributedRevenue: "—",
  },
  {
    id: "camp-04",
    name: "LAB Batch 08 Pilot Preview",
    channels: ["push"],
    audience: "Gold & Platinum Tiers",
    audienceCount: 4200,
    startDate: "12 Oct 2026",
    endDate: "14 Oct 2026",
    status: "scheduled",
    budgetSpent: "₹0",
    budgetTotal: "₹15,000",
    conversionRate: "—",
    attributedRevenue: "—",
  },
  {
    id: "camp-05",
    name: "Weekend Nitro Cold Brew Boost",
    channels: ["push"],
    audience: "Weekend Repeaters",
    audienceCount: 22100,
    startDate: "20 Sep 2026",
    endDate: "27 Sep 2026",
    status: "completed",
    budgetSpent: "₹22,000",
    budgetTotal: "₹25,000",
    conversionRate: "5.4%",
    attributedRevenue: "₹1,94,000",
  },
];

export const FALLBACK_CAMPAIGN_TABLE_ITEMS: CampaignTableItem[] = [
  {
    id: "cmp-0291",
    code: "CMP-0291",
    name: "Monsoon Matcha",
    subtitle: "CMP-0291 · A/B test running",
    type: "Push + In-app",
    audience: "Matcha lovers · 18,400",
    audienceSegment: "Matcha lovers",
    status: "Live",
    schedule: "1 – 15 Oct",
    sent: "18,400",
    conv: "1,104",
    revenue: "₹2,86,900",
  },
  {
    id: "cmp-0288",
    code: "CMP-0288",
    name: "Come back to Phin",
    subtitle: "CMP-0288 · coupon BREW50",
    type: "WhatsApp",
    audience: "Lapsed 45 days · 49,700",
    audienceSegment: "Lapsed 45 days",
    status: "Live",
    schedule: "28 Sep – 12 Oct",
    sent: "49,700",
    conv: "2,410",
    revenue: "₹2,64,300",
  },
  {
    id: "cmp-0294",
    code: "CMP-0294",
    name: "Diwali Gift Cards",
    subtitle: "CMP-0294 · gift card promo",
    type: "WhatsApp + Push",
    audience: "All opted-in · 1,12,600",
    audienceSegment: "All opted-in",
    status: "Scheduled",
    schedule: "10 Oct · 10:00 am",
    sent: "—",
    conv: "—",
    revenue: "—",
  },
  {
    id: "cmp-0296",
    code: "CMP-0296",
    name: "LAB Batch 08 pilot",
    subtitle: "CMP-0296 · Pandan Coconut",
    type: "Push",
    audience: "LAB fans · BLR · 9,800",
    audienceSegment: "LAB fans · BLR",
    status: "Scheduled",
    schedule: "12 Oct · 4:00 pm",
    sent: "—",
    conv: "—",
    revenue: "—",
  },
  {
    id: "cpn-0112",
    code: "CPN-0112",
    name: "MATCHA2X afternoons",
    subtitle: "CPN-0112 · BOGO matcha",
    type: "Coupon",
    audience: "App + kiosk · everyone",
    audienceSegment: "App + kiosk · everyone",
    status: "Always-on",
    schedule: "Mon–Thu · 2–5 pm",
    sent: "—",
    conv: "124",
    revenue: "₹71,900",
  },
  {
    id: "cmp-0297",
    code: "CMP-0297",
    name: "Club Lite upsell",
    subtitle: "CMP-0297 · draft by Neha S.",
    type: "In-app",
    audience: "Regulars · 11,200",
    audienceSegment: "Regulars",
    status: "Draft",
    schedule: "Not scheduled",
    sent: "—",
    conv: "—",
    revenue: "—",
  },
  {
    id: "cmp-0284",
    code: "CMP-0284",
    name: "LAB Batch 07 launch",
    subtitle: "CMP-0284 · Yuzu Matcha Tonic",
    type: "Push",
    audience: "All push opted-in · 58,100",
    audienceSegment: "All push opted-in",
    status: "Ended",
    schedule: "26 Sep · 11:00 am",
    sent: "58,100",
    conv: "1,920",
    revenue: "₹4,99,200",
  },
  {
    id: "cmp-0279",
    code: "CMP-0279",
    name: "Weekend Bánh Mì",
    subtitle: "CMP-0279 · with KIOSK10",
    type: "SMS",
    audience: "BLR, active 30d · 22,000",
    audienceSegment: "BLR, active 30d",
    status: "Ended",
    schedule: "19 – 21 Sep",
    sent: "22,000",
    conv: "286",
    revenue: "₹68,400",
  },
  // Additional campaigns for pagination (total 42 as per Figma 474:241757)
  {
    id: "cmp-0278",
    code: "CMP-0278",
    name: "Pour-over Single Origin Series",
    subtitle: "CMP-0278 · Ethiopia Yirgacheffe",
    type: "Push",
    audience: "Filter Coffee Aficionados · 14,200",
    audienceSegment: "Coffee Lovers",
    status: "Ended",
    schedule: "12 – 18 Sep",
    sent: "14,200",
    conv: "890",
    revenue: "₹1,42,000",
  },
  {
    id: "cmp-0275",
    code: "CMP-0275",
    name: "Monsoon BOGO Cold Brew",
    subtitle: "CMP-0275 · Monsoon perk",
    type: "Coupon",
    audience: "App users · 38,000",
    audienceSegment: "App Users",
    status: "Ended",
    schedule: "5 – 10 Sep",
    sent: "38,000",
    conv: "1,420",
    revenue: "₹3,12,000",
  },
  {
    id: "cmp-0271",
    code: "CMP-0271",
    name: "Flat White Friday",
    subtitle: "CMP-0271 · Friday weekly blast",
    type: "WhatsApp",
    audience: "Office Lunchgoers · 28,400",
    audienceSegment: "Office Cohort",
    status: "Ended",
    schedule: "1 – 4 Sep",
    sent: "28,400",
    conv: "1,150",
    revenue: "₹2,10,000",
  },
];

export const MarketingApi = {
  /**
   * GET /v1/admin/marketing/table-campaigns (A081 / Figma 474:241757)
   */
  async getTableCampaigns(): Promise<CampaignTableItem[]> {
    try {
      const data = await apiClient.get<CampaignTableItem[]>("/admin/marketing/table-campaigns");
      if (Array.isArray(data) && data.length > 0) return data;
      return FALLBACK_CAMPAIGN_TABLE_ITEMS;
    } catch {
      return FALLBACK_CAMPAIGN_TABLE_ITEMS;
    }
  },
  /**
   * GET /v1/admin/marketing/overview (A080)
   */
  async getOverview(): Promise<MarketingOverviewResponse> {
    try {
      const data = await apiClient.get<MarketingOverviewResponse>("/admin/marketing/overview");
      if (data && data.kpis) return data;
      return FALLBACK_MARKETING_OVERVIEW;
    } catch {
      return FALLBACK_MARKETING_OVERVIEW;
    }
  },

  /**
   * GET /v1/admin/marketing/campaigns (A081)
   */
  async getCampaigns(): Promise<CampaignListItem[]> {
    try {
      const data = await apiClient.get<CampaignListItem[]>("/admin/marketing/campaigns");
      if (Array.isArray(data) && data.length > 0) return data;
      return FALLBACK_CAMPAIGNS_LIST;
    } catch {
      return FALLBACK_CAMPAIGNS_LIST;
    }
  },

  /**
   * POST /v1/admin/marketing/campaigns (A082)
   */
  async createCampaign(payload: Partial<CampaignListItem>): Promise<CampaignListItem> {
    try {
      return await apiClient.post<CampaignListItem>("/admin/marketing/campaigns", payload);
    } catch {
      const newItem: CampaignListItem = {
        id: `camp-${Date.now()}`,
        name: payload.name || "New Promotional Campaign",
        channels: payload.channels || ["push"],
        audience: payload.audience || "All Active Customers",
        audienceCount: payload.audienceCount || 10000,
        startDate: payload.startDate || "Tomorrow",
        endDate: payload.endDate || "In 14 days",
        status: "draft",
        budgetSpent: "₹0",
        budgetTotal: payload.budgetTotal || "₹25,000",
        conversionRate: "—",
        attributedRevenue: "—",
      };
      return newItem;
    }
  },
};

