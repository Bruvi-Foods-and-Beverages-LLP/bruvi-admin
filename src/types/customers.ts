export type CustomerTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

export type CustomerSegment = 'all' | 'new' | 'regulars' | 'lapsed' | 'club';

export interface CustomerLastOrder {
  timeText: string;
  subtext: string;
  rawDate?: string;
}

export interface CustomerListItem {
  id: string;
  code: string;
  name: string;
  initials: string;
  phone: string;
  rawPhone: string;
  email: string | null;
  homeStore: string;
  tier: CustomerTier;
  visits: number;
  lifetime: number;
  wallet: number;
  lastOrder: CustomerLastOrder | null;
  tags: string[];
  memberSince: string;
  createdAt: string;
}

export interface CustomersStats {
  registeredCount: number;
  registeredText: string;
  registeredDelta: string;
  monthlyActive: string;
  monthlyActiveSubtitle: string;
  repeatRate: string;
  repeatRateSubtitle: string;
  avgLtv: string;
  avgLtvSubtitle: string;
}

export interface CustomersSegments {
  all: number;
  new: { count: number; percentage: string };
  regulars: { count: number; percentage: string };
  lapsed: { count: number; percentage: string };
  club: { count: number; label: string };
}

export interface CustomersListResponse {
  items: CustomerListItem[];
  stats: CustomersStats;
  segments: CustomersSegments;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomersQueryFilters {
  q?: string;
  segment: CustomerSegment;
  tier: string;
  page: number;
  limit: number;
}

// ─── Customer Detail Types ──────────────────────────────────────────────

export interface CustomerEntity {
  id: string;
  code: string;
  name: string;
  initials: string;
  phone: string;
  rawPhone: string;
  email: string | null;
  homeStore: string;
  tier: CustomerTier;
  points: number;
  visits: number;
  lifetime: number;
  wallet: number;
  tags: string[];
  memberSince: string;
  createdAt: string;
  avatarUrl?: string | null;
}

export interface CustomerKpiMetrics {
  lifetimeSpend: number;
  lifetimeSpendSubtitle: string;
  visits: number;
  visitsSubtitle: string;
  avgOrderValue: number;
  avgOrderValueSubtitle: string;
  walletBalance: number;
  walletBalanceSubtitle: string;
}

export interface CustomerFavouriteDrink {
  title: string;
  overline: string;
  customization: string;
  price: number;
  priceBreakdown: string;
  imageUrl?: string | null;
}

export interface CustomerRecentActivityItem {
  id: string;
  title: string;
  subtitle: string;
  statusBadge?: string;
  statusType?: 'success' | 'info' | 'warning' | 'neutral';
  amountText: string;
  timeText: string;
  isPositive?: boolean;
}

export interface CustomerSubscription {
  planName: string;
  status: 'Active' | 'Paused' | 'Expired' | 'None';
  usedDrinks: number;
  totalDrinks: number;
  cycleText: string;
}

export interface CustomerConsent {
  push: boolean;
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
}

export interface CustomerDevice {
  id: string;
  name: string;
  type: 'phone' | 'kiosk';
  subtitle: string;
  lastSeen: string;
}

export interface CustomerPreferences {
  milkSweetness: string | null;
  dietBirthday: string | null;
  consents: CustomerConsent | null;
  devices: CustomerDevice[];
}

export interface CustomerNote {
  id: string;
  author: string;
  role?: string;
  date: string;
  content: string;
}

export interface CustomerOverviewDetail {
  customer: CustomerEntity;
  metrics: CustomerKpiMetrics;
  favourite: CustomerFavouriteDrink | null;
  recentActivity: CustomerRecentActivityItem[];
  subscription: CustomerSubscription | null;
  preferences: CustomerPreferences;
  latestNote: CustomerNote | null;
}

// Orders Tab
export interface CustomerSpendByMonth {
  month: string;
  amount: number;
  isCurrent?: boolean;
}

export interface CustomerOrderItem {
  id: string;
  displayCode: string;
  createdAt: string;
  channelKey: 'app' | 'counter' | 'kiosk';
  placedTime: string;
  channel: string;
  store: string;
  channelSubtext?: string;
  itemsDescription: string;
  paymentMethod: string;
  status: 'Paid' | 'Preparing' | 'Completed' | 'Cancelled';
  pointsText: string;
  total: number;
}

export interface CustomerOrdersDetail {
  spendByMonth: CustomerSpendByMonth[];
  spendSummaryText: string;
  currentMonthSpend: number;
  currentMonthLabel: string;
  totalOrders: number;
  channelSplit: {
    app: { count: number; percentage: number };
    counter: { count: number; percentage: number };
    kiosk: { count: number; percentage: number };
  };
  orders: CustomerOrderItem[];
}

// Wallet Tab
export interface CustomerWalletLedgerItem {
  id: string;
  dateText: string;
  timeText: string;
  type: 'Spend' | 'Top-up' | 'Refund' | 'Goodwill' | 'Adjustment';
  title: string;
  subtitle: string;
  amount: number;
  amountText: string;
  balanceAfter: number;
  balanceText: string;
  isCredit: boolean;
}

export interface CustomerWalletDetail {
  balance: number;
  walletCode: string;
  status: string;
  loadedLifetime: number;
  bonusEarned: number;
  spentLifetime: number;
  spentOrdersCount: number;
  refundsLifetime: number;
  refundsCountText: string;
  ledger: CustomerWalletLedgerItem[];
  kycStatus: string | null;
  ppiLimit: number;
  auditTrail: { action: string; timestamp: string }[];
}

// Loyalty Tab
export interface CustomerLoyaltyLedgerItem {
  id: string;
  dateText: string;
  timeText: string;
  type: 'Earned' | 'Pending' | 'Redeemed' | 'Scheduled' | 'Bonus' | 'Adjustment' | 'Expiring';
  title: string;
  subtitle: string;
  pointsText: string;
  balanceText: string;
  isPositive: boolean;
}

export interface CustomerLoyaltyReward {
  id: string;
  title: string;
  imageUrl?: string | null;
  pointsCost: number;
  unlocked: boolean;
}

export interface CustomerLoyaltyDetail {
  pointsBalance: number;
  pointsValueInr: number;
  currentTier: CustomerTier;
  nextTier: CustomerTier;
  ptsToGo: number;
  lifetimePoints: number;
  expiryMonths: number;
  currentTierFloor: number;
  targetPoints: number;
  progressPercent: number;
  progressSubtitle: string;
  earnMultiplierText: string;
  expiringPtsText: string;
  ledger: CustomerLoyaltyLedgerItem[];
  availableRewards: CustomerLoyaltyReward[];
}

