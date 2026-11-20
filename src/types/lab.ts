/**
 * Bruvi Lab TypeScript Definitions
 * Aligned with NestJS LabModule DTOs and Figma Nodes (474:244225, 474:244555, 474:244942, 474:245363)
 */

export type LabBatchStatus =
  | "IN_DEVELOPMENT"
  | "SCHEDULED"
  | "LIVE"
  | "EXTENDED"
  | "ENDED"
  | "PROMOTED"
  | "RETIRED";

export interface LabBatchItem {
  id: string;
  batchNumber: string;
  batchCode: string;
  name: string;
  subtitle: string;
  pricePaise: number;
  status: LabBatchStatus | string;
  statusLabel: string;
  windowLabel: string;
  storesCount: number;
  cupsSold: number;
  totalCups: number;
  rating: number | null;
  ratingCount: number;
  wouldBuyAgainPct: number | null;
  marginPct: number | null;
  imagePath: string;
  startDate?: string;
  endDate?: string | null;
  description?: string;
  pilotStores?: string[];
  recipeName?: string | null;
}

export interface LabPipelineItem {
  id: string;
  title: string;
  category?: string;
  votesCount: number;
  proposedBy?: string;
  recipeCostPaise?: number | null;
  tastingDate?: string | null;
  batchNumber?: string | null;
  stage: "IDEA" | "RND" | "PILOT" | "LIVE" | "ENDED";
}

export interface LabPipelineColumn {
  stage: string;
  title: string;
  count: number;
  items: LabPipelineItem[];
}

export interface LabOverviewStats {
  batchSold: number;
  vsPreviousPct: number;
  avgRating: number;
  totalRatings: number;
  wouldBuyAgainPct: number;
  promoteBarPct: number;
}

export interface LabOverviewData {
  liveBatch: LabBatchItem | null;
  stats: LabOverviewStats;
  pipeline: LabPipelineColumn[];
  batches: LabBatchItem[];
  totalBatches: number;
  backlogIdeasCount: number;
}

export interface DailySalesMetric {
  dayLabel: string;
  cupsSold: number;
  previousBatchCups: number;
  isToday: boolean;
}

export interface StoreMetric {
  storeName: string;
  cupsSold: number;
  rating: number;
  repeatIntentPct: number;
}

export interface IngredientMetric {
  name: string;
  status: "OK" | "SHORT" | "CRITICAL";
  note: string;
}

export interface RatingDistribution {
  stars: number;
  pct: number;
  count: number;
}

export interface CustomerQuote {
  quote: string;
  author: string;
  rating: number;
}

export interface LabBatchDetailData {
  batch: LabBatchItem;
  fullDetails?: any;
  dailySales: DailySalesMetric[];
  storeMetrics: StoreMetric[];
  ingredients: IngredientMetric[];
  ratingsDistribution: RatingDistribution[];
  sweetnessSentiment: string;
  customerQuotes: CustomerQuote[];
}

export interface ComparisonBatch {
  id: string;
  batchNumber: string;
  name: string;
  status: string;
  storesCount: number;
  cupsSold: number;
  cupsPerStorePerDay: number;
  avgRating: number;
  wouldBuyAgainPct: number;
  marginPct: number;
  reorderRatePct: number;
}

export interface ConversionFunnelStage {
  stage: string;
  count: number;
  pct: number;
  label: string;
}

export interface DecisionChecklistItem {
  label: string;
  current: string;
  passed: boolean;
}

export interface LabDecisionData {
  dueDate: string;
  title: string;
  criteriaMet: number;
  criteriaTotal: number;
  recommendation: string;
  conditions: string;
  checklist: DecisionChecklistItem[];
}

export interface LabPerformanceData {
  batches: ComparisonBatch[];
  conversionFunnel: ConversionFunnelStage[];
  decision: LabDecisionData;
}

export interface CreateLabBatchPayload {
  batchNumber: string;
  name: string;
  subtitle?: string;
  description: string;
  pricePaise: number;
  totalCups?: number;
  startDate?: string;
  endDate?: string;
  imagePath?: string;
  pilotStores?: string[];
  recipeName?: string;
  recipeCostPaise?: number;
  tastingNotes?: string[];
  feedbackQuestions?: any[];
  checklist?: any[];
}

export interface ExtendLabBatchPayload {
  daysToAdd: number;
  additionalCups?: number;
  reason?: string;
}

export interface PromoteLabBatchPayload {
  categoryId?: string;
  menuName?: string;
  pricePaise?: number;
  notes?: string;
}

export interface CreateLabIdeaPayload {
  title: string;
  stage?: "IDEA" | "RND" | "PILOT" | "LIVE" | "ENDED";
  proposedBy?: string;
  recipeCostPaise?: number;
  tastingDate?: string;
}

