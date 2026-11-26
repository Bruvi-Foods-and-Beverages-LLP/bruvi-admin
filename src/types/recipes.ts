/**
 * Enterprise Recipe Management & BOM Types
 * Aligned with Figma Node 474:229593 (Recipes Overview) and Master ERP BOM Specification
 */

export type RecipeStatus = "LIVE" | "DRAFT_PENDING" | "DRAFT_TESTING" | "ARCHIVED";
export type RecipeStation = "Bar" | "Kitchen";

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: "ml" | "g" | "shots" | "pumps" | "set" | "pcs";
  costPaise: number;
  scalesWith?: string;
  wastePercentage?: number;
  isAllergen?: boolean;
}

export interface RecipeSizeFormulation {
  code: "regular" | "large" | "jumbo" | string;
  label: string; // e.g., "Regular · 250 ml"
  shortLabel: string; // e.g., "Regular"
  volumeMl: number;
  menuPrice: number; // e.g. 280
  costPerServe: number; // e.g. 54.20
  marginPercentage: number; // e.g. 80.6
  yield: string; // e.g. "1 × 350 ml"
  subtitle: string;
  ingredients: RecipeIngredient[];
}

export interface RecipeStep {
  stepNumber: string; // "01", "02", ...
  title: string;
  detail: string;
}

export interface RecipeAllergen {
  label: string;
  type: "warning" | "default" | "veg";
}

export interface RecipeDetailItem extends RecipeItem {
  activeSize: string;
  sizesFormulations: RecipeSizeFormulation[];
  method: {
    stepsCount: number;
    targetMakeTime: string; // e.g. "1:30"
    steps: RecipeStep[];
  };
  allergensList: RecipeAllergen[];
  stationDetail: string; // e.g. "Bar · KDS Bar 1"
  ownerDetail: string; // e.g. "Bev R&D · Tran L."
  liveSinceText: string; // e.g. "14 Aug 2026 · all 12 stores"
  liveStoresCount?: number;
  draftVersionLabel?: string;
  mediaPreview: {
    imageUrl: string;
    videoDuration?: string;
    photosCount?: number;
  };
  regularComparisonText?: string;
}

export interface RecipeVersionDiffItem {
  id: string;
  name: string;
  v4LiveQty: string;
  v5DraftQty: string;
  deltaCostPaise: number;
  deltaCostFormatted: string; // e.g. "−₹1.25", "—"
  isChanged: boolean;
  ladderDetails?: {
    label: string;
    v4Levels: string;
    v5Levels: string;
    note: string;
  };
}

export interface RecipeRolloutStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  isCurrent: boolean;
  isCompleted: boolean;
}

export interface RecipeApprovalItem {
  id: string;
  initials: string;
  name: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  dateText: string;
  isCurrentUser?: boolean;
}

export interface RecipeVersionComparison {
  recipeId: string;
  recipeName: string;
  comparisonTitle: string; // "v5 draft vs v4 live"
  statusBadge: string; // "Awaiting 1 approval"
  reasonForChange: {
    title: string;
    description: string;
    avgSweetness: number;
    maxSweetness: number;
  };
  sideBySide: {
    sizeTitle: string; // "Side-by-side · Large 350 ml"
    subtitle: string; // "2 ingredients changed · sweetness ladder rescaled · all sizes scale"
    diffItems: RecipeVersionDiffItem[];
    v4CostPerServe: number;
    v5CostPerServe: number;
    deltaCostPerServe: number;
    v4Margin: number;
    v5Margin: number;
    deltaMarginPt: number;
    menuPrice: number;
  };
  rolloutPlan: {
    title: string;
    subtitle: string;
    steps: RecipeRolloutStep[];
  };
  approvals: {
    title: string;
    items: RecipeApprovalItem[];
    methodNotice: string;
  };
}

export interface RecipeSize {
  code: "R" | "L" | "J" | "Single" | "Regular";
  name: string;
  sellingPricePaise: number;
  costPaise: number;
  marginPercentage: number;
}

export interface RecipeItem {
  id: string;
  name: string;
  sku: string;
  category: "Vietnamese" | "Specialty" | "Matcha" | "Bites" | "LAB" | string;
  station: RecipeStation;
  version: string;
  sizes: string;
  sizesList?: RecipeSize[];
  costPerServe: number;
  sellingPrice: number;
  margin: number;
  targetMargin: number;
  changed: string;
  changedDate: string;
  owner: string;
  status: RecipeStatus;
  statusLabel: string;
  image: string | null;
  iconType?: "flask" | "coffee";
  isDraftPending?: boolean;
  ingredientsSummary?: string;
  ingredients?: RecipeIngredient[];
  prepTimeSeconds?: number;
  stationNotes?: string;
}

export interface RecipeFilters {
  search: string;
  tab: "ALL" | "DRAFTS";
  category: string;
  station: string;
  owner: string;
}

export interface RecipeOverviewMetrics {
  totalCount: number;
  draftsCount: number;
  avgMargin: number;
  targetMargin: number;
  updatedAt: string;
}

export interface RecipeListResponse {
  recipes: RecipeItem[];
  metrics: RecipeOverviewMetrics;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: string[];
  stations: string[];
  owners: string[];
}
