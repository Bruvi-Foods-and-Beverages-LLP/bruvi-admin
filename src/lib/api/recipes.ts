import { apiClient } from "@/lib/api/client";
import {
  RecipeFilters,
  RecipeItem,
  RecipeListResponse,
  RecipeDetailItem,
  RecipeVersionComparison,
} from "@/types/recipes";

export interface CreateRecipePayload {
  name: string;
  sku: string;
  productId?: string;
  category: string;
  station: "Bar" | "Kitchen";
  stationDetail?: string;
  ownerName: string;
  ownerRole?: string;
  targetMarginPercent?: number;
  isVegetarian?: boolean;
  containsDairy?: boolean;
  imageUrl?: string;
}

export interface ApproveRecipePayload {
  approverName: string;
  approverRole: string;
  initials?: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  comments?: string;
}

export interface PublishRecipePayload {
  target: "PILOT" | "NETWORK";
  outletIds?: string[];
  notifyBaristas: boolean;
  effectiveFrom?: string;
}

export interface CostSimulatorPayload {
  sellingPricePaise: number;
  targetMarginPercent?: number;
  items: Array<{
    ingredientId: string;
    quantity: number;
    unit?: string;
    wastePercent?: number;
  }>;
}

export const RecipesApi = {
  /**
   * Fetch recipes list with search, tabs, filters, and pagination
   */
  async getRecipes(
    filters: Partial<RecipeFilters> = {},
    page: number = 1,
    limit: number = 9
  ): Promise<RecipeListResponse> {
    const params: Record<string, string | number | boolean | undefined> = {
      search: filters.search || undefined,
      tab: filters.tab || "ALL",
      category: filters.category && filters.category !== "ALL" ? filters.category : undefined,
      station: filters.station && filters.station !== "ALL" ? filters.station : undefined,
      owner: filters.owner && filters.owner !== "ALL" ? filters.owner : undefined,
      page,
      limit,
    };

    return await apiClient.get<RecipeListResponse>("/admin/recipes", { params });
  },

  /**
   * Get single recipe by ID or SKU
   */
  async getRecipeById(id: string): Promise<RecipeDetailItem> {
    return await apiClient.get<RecipeDetailItem>(`/admin/recipes/${id}`);
  },

  /**
   * Get version comparison between draft and live
   */
  async getRecipeVersionComparison(id: string): Promise<RecipeVersionComparison> {
    return await apiClient.get<RecipeVersionComparison>(`/admin/recipes/${id}/versions/compare`);
  },

  /**
   * Create new recipe master
   */
  async createRecipe(payload: CreateRecipePayload): Promise<{ id: string; message: string }> {
    return await apiClient.post<{ id: string; message: string }>("/admin/recipes", payload);
  },

  /**
   * Update existing recipe master
   */
  async updateRecipe(id: string, payload: Partial<CreateRecipePayload>): Promise<any> {
    return await apiClient.put(`/admin/recipes/${id}`, payload);
  },

  /**
   * Delete or archive a recipe
   */
  async deleteRecipe(id: string): Promise<any> {
    return await apiClient.delete(`/admin/recipes/${id}`);
  },

  /**
   * Create new draft version
   */
  async createVersion(recipeId: string, payload: any): Promise<any> {
    return await apiClient.post(`/admin/recipes/${recipeId}/versions`, payload);
  },

  /**
   * Sign off or approve a recipe version
   */
  async approveVersion(
    recipeId: string,
    versionId: string,
    payload: ApproveRecipePayload
  ): Promise<any> {
    return await apiClient.post(
      `/admin/recipes/${recipeId}/versions/${versionId}/approve`,
      payload
    );
  },

  /**
   * Publish version to pilot stores or full network
   */
  async publishVersion(
    recipeId: string,
    versionId: string,
    payload: PublishRecipePayload
  ): Promise<any> {
    return await apiClient.post(
      `/admin/recipes/${recipeId}/versions/${versionId}/publish`,
      payload
    );
  },

  /**
   * Fetch raw ingredients catalog
   */
  async getIngredients(): Promise<any[]> {
    try {
      return await apiClient.get<any[]>("/admin/recipes/ingredients");
    } catch {
      return [];
    }
  },

  /**
   * Simulate BOM cost and margin
   */
  async simulateCost(payload: CostSimulatorPayload): Promise<any> {
    try {
      return await apiClient.post("/admin/recipes/cost-simulator", payload);
    } catch {
      return null;
    }
  },

  /**
   * Export Costing & BOM CSV
   */
  async exportCosting(): Promise<{ url: string; filename: string }> {
    const csvContent =
      "SKU,Recipe Name,Category,Station,Version,Cost/Serve (INR),Selling Price (INR),Gross Margin (%),Target Margin (%)\n" +
      "VN-SCCB,Salted Cream Cold Brew,Vietnamese,Bar,v4 live,54.20,280,80.6,75.0\n" +
      "VN-CPSD,Cà Phê Sữa Đá,Vietnamese,Bar,v3 live,39.70,190,79.1,75.0\n" +
      "VN-BXIU,Bạc Xỉu,Vietnamese,Bar,v2 live,41.80,210,80.1,75.0\n" +
      "VN-COCO,Coconut Coffee,Vietnamese,Bar,v3 live,51.20,260,80.3,75.0\n" +
      "SP-EGGC,Egg Coffee,Specialty,Bar,v2 live,52.00,250,79.2,75.0\n" +
      "MT-ICML,Iced Matcha Latte,Matcha,Bar,v3 live,58.40,260,77.5,75.0\n" +
      "BT-BMPN,Bánh Mì Paneer,Bites,Kitchen,v1 live,68.00,220,69.1,70.0\n" +
      "LB-YCBT,Yuzu Cold Brew Tonic,LAB,Bar,v1 testing,56.50,280,79.8,75.0\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const filename = `bruvi_recipe_bom_costing_${new Date().toISOString().split("T")[0]}.csv`;
    return { url, filename };
  },
};
