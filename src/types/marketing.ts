export type MarketingTab = "overview" | "campaigns" | "audiences" | "coupons" | "push";

export type CampaignStatus = "live" | "scheduled" | "draft" | "completed";

export type CampaignTableStatus = "Live" | "Scheduled" | "Always-on" | "Draft" | "Ended";

export type ChannelType = "push" | "in-app" | "whatsapp" | "sms" | "multi";

export type ColorTheme = "matcha" | "sky" | "coffee" | "navy" | "amber" | "purple";

export interface CampaignTableItem {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  type: string;
  audience: string;
  audienceSegment: string;
  status: CampaignTableStatus;
  schedule: string;
  sent: string;
  conv: string;
  revenue: string;
}

export interface MarketingKpi {
  activeCampaigns: number;
  activeCampaignsLive: number;
  activeCampaignsScheduled: number;
  revenueMtd: string;
  revenueMtdDelta: string;
  openRate: string;
  openRateDelta: string;
  couponRedemption: string;
  couponRedemptionDelta: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  channel: ChannelType;
  channelLabel: string;
  startDate: string;
  endDate: string;
  startDay: number;
  endDay: number;
  type: "ribbon" | "marker";
  colorTheme: ColorTheme;
  status: CampaignStatus;
  note?: string;
}

export interface LiveCampaign {
  id: string;
  title: string;
  channels: string;
  audienceSize: string;
  status: "Live" | "Scheduled" | "Completed" | "Draft";
  currentDay: number;
  totalDays: number;
  endDateLabel: string;
  targetHighlight: string;
  targetIsPositive: boolean;
  theme: "matcha" | "coffee" | "sky";
  metric1Label: string;
  metric1Value: string;
  metric2Label: string;
  metric2Value: string;
  metric3Label: string;
  metric3Value: string;
}

export interface ChannelPerformance {
  id: string;
  name: string;
  statLabel: string;
  bars: number[]; // 7 numbers between 0 and 100 representing past 7 days
  theme: "navy" | "sky" | "coffee" | "matcha";
  revenueMtd: string;
}

export interface CampaignListItem {
  id: string;
  name: string;
  channels: ChannelType[];
  audience: string;
  audienceCount: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  budgetSpent: string;
  budgetTotal: string;
  conversionRate: string;
  attributedRevenue: string;
}

export interface MarketingState {
  activeTab: MarketingTab;
  kpis: MarketingKpi;
  timelineEvents: TimelineEvent[];
  liveCampaigns: LiveCampaign[];
  channelPerformance: ChannelPerformance[];
  campaignsList: CampaignListItem[];
  selectedMonth: string;
  currentDay: number;
  totalDaysInMonth: number;
  isCreateCampaignOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

