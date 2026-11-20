export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type RewardCategoryColor = 'coffee' | 'warm' | 'neutral' | 'matcha';
export type RewardIconType = 'bean' | 'phin' | 'cup' | 'lock';
export type RewardItemType = 'ADD_ON' | 'DRINK' | 'FOOD' | 'MERCH';
export type RewardStatus = 'LIVE' | 'DRAFT' | 'ARCHIVED';

export type LoyaltyRuleType = 'BASE_EARN' | 'TIER_MULTIPLIER' | 'CATEGORY_PROMO' | 'BONUS_EVENT' | 'BURN_RULE';
export type LoyaltyRuleCategory = 'EARN' | 'BURN' | 'TIER' | 'BONUS';

export interface LoyaltyRuleConditions {
  applies_to?: string;
  starts_at?: string;
  ends_at?: string;
  channels?: string[];
  stores?: string;
  stores_summary?: string;
  stack_with_tier?: boolean;
  is_promo?: boolean;
  [key: string]: any;
}

export interface LoyaltyRule {
  id: string;
  name: string;
  description: string;
  rule_type: LoyaltyRuleType;
  category: LoyaltyRuleCategory;
  rate_value: number;
  burn_rate_paise?: number;
  min_points_redeem?: number;
  max_rewards_per_order?: number;
  points_expiry_months?: number;
  is_active: boolean;
  conditions?: LoyaltyRuleConditions;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyBurnRules {
  pointValueInr: number;
  minRedeemPoints: number;
  maxRewardsPerOrder: number;
  pointsExpiryMonths: number;
  exclusions: string[];
}

export interface CatalogReward {
  id: string;
  title: string;
  description?: string | null;
  points_cost: number;
  category_color: RewardCategoryColor;
  icon_type: RewardIconType;
  item_type: RewardItemType;
  linked_product_id?: string | null;
  status: RewardStatus;
  valid_days: number;
  min_tier: LoyaltyTier;
  stock_limit?: number | null;
  redemptions_count: number;
  confirmation_note?: string | null;
  image_url?: string | null;
  stock_display?: string | null;
  available_stores?: string | null;
  cost_to_bruvi?: number | null;
  eligible_tiers?: string[];
  channels?: string[];
  redemption_limit?: string;
  stores?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoyaltyDashboardKpis {
  totalMembers: number;
  pointsIssued30d: number;
  pointsIssuedPrior30d?: number;
  issuedDeltaPercent?: number;
  pointsRedeemed30d: number;
  totalPointsLiability: number;
  liabilityRupees: number;
  redemptionRate: number;
  pointsExpiringSoon: number;
  expiringRupees: number;
  expiringMembers?: number;
  joinedThisMonth?: number;
}

export interface WeeklyTrendItem {
  week: string;
  weekLabel?: string;
  issued: number;
  redeemed: number;
}

export interface TierDistributionItem {
  count: number;
  percent: number;
}

export interface DashboardTopRewardItem {
  id: string;
  title: string;
  points_cost: number;
  redemptions_count: number;
  category_color: RewardCategoryColor;
  icon_type: RewardIconType;
  status: RewardStatus;
  share_percent: number;
}

export interface ExpiringBreakdownItem {
  window: string;
  members: string;
  points: string;
  isUrgent: boolean;
}

export interface LoyaltyDashboardData {
  kpis: LoyaltyDashboardKpis;
  weeklyTrend: WeeklyTrendItem[];
  tierDistribution: {
    silver: TierDistributionItem;
    gold: TierDistributionItem;
    platinum: TierDistributionItem;
  };
  topRewards: DashboardTopRewardItem[];
  expiringBreakdown?: ExpiringBreakdownItem[];
}

export interface TierBenefitRow {
  id: string;
  name?: string;
  benefit: string;
  silver: string;
  gold: string;
  platinum: string;
}

export interface TierQualificationSettings {
  windowMonths: number;
  windowType?: string;
  gracePeriodDays: number;
  downgradeGracePeriodDays?: number;
  instantUpgrade: boolean;
  membersInGrace: number;
  graceDeadline: string;
}

export interface LoyaltyTierInfo {
  id: string;
  name: string;
  code: LoyaltyTier;
  tag?: string;
  threshold?: string;
  minPoints: number;
  maxPoints: number | null;
  earnMultiplier: number;
  earnMultiplierText: string;
  memberCount: number;
  memberPercent?: number;
  censusMembers?: string;
  censusShare?: string;
  change30d?: string;
  benefits: string[];
}

export interface LoyaltyTiersData {
  tiers: LoyaltyTierInfo[];
  benefitsMatrix?: TierBenefitRow[];
  qualificationSettings?: TierQualificationSettings;
  qualificationBasis: string;
}

export interface LoyaltyTransactionItem {
  id: string;
  userId: string;
  customerName: string;
  customerCode?: string;
  customerTier?: string;
  customerEmail: string;
  customerPhone?: string;
  storeName?: string;
  eventType: string;
  typeLabel?: string;
  points: number;
  balanceAfter: number;
  referenceType?: string;
  referenceId?: string;
  referenceText?: string;
  description?: string;
  actorName?: string;
  createdAt: string;
  isAnomaly?: boolean;
  isFlagged?: boolean;
}

export interface LoyaltyTransactionsResponse {
  items: LoyaltyTransactionItem[];
  total: number;
  page: number;
  limit: number;
  hasAnomaly: boolean;
  totalPages: number;
  anomalyAlert?: {
    title: string;
    description: string;
    actor: string;
    isFrozen?: boolean;
  };
  summaryToday?: {
    earnedLakh: string;
    burnedPoints: string;
  };
}

export interface CreateRewardPayload {
  id?: string;
  title: string;
  description?: string;
  pointsCost: number;
  categoryColor: RewardCategoryColor;
  iconType: RewardIconType;
  itemType: RewardItemType;
  linkedProductId?: string | null;
  status: RewardStatus;
  validDays: number;
  minTier: LoyaltyTier;
  stockLimit?: number | null;
  confirmationNote?: string;
  costToBruvi?: number;
  cost_to_bruvi?: number;
  eligibleTiers?: string[];
  eligible_tiers?: string[];
  channels?: string[];
  redemptionLimit?: string;
  redemption_limit?: string;
  stores?: string;
}

export type UpdateRewardPayload = Partial<CreateRewardPayload>;

export interface ManualAdjustPayload {
  userId: string;
  points: number;
  reason: string;
  referenceId?: string;
}
