import { apiClient } from "@/lib/api/client";
import {
  ProductDetail,
  ProductListResponse,
  CategoryMetric,
  CategoryItem,
  CatalogQueryFilters,
  ModifierGroupDetail,
  ModifierGroupPayload,
  ModifierOptionPayload,
  ModifierStockEntry,
  ProductModifierBinding,
  ProductCreatePayload,
  ProductUpdatePayload,
  BulkActionPayload,
  ProductVariant,
  ProductPerformance,
  ProductPerformanceFilters,
} from "@/types/catalog";

export const CatalogApi = {
  /**
   * Search, filter, and paginate products
   */
  async getProducts(filters: CatalogQueryFilters = {}): Promise<ProductListResponse> {
    return apiClient.get<ProductListResponse>("/admin/catalog/products", {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Get category metric pills
   */
  async getCategoryMetrics(): Promise<CategoryMetric[]> {
    return apiClient.get<CategoryMetric[]>("/admin/catalog/categories/metrics");
  },

  /**
   * Get single product by ID with full details (variants, modifiers, overrides, margin)
   */
  async getProductById(id: string): Promise<ProductDetail> {
    return apiClient.get<ProductDetail>(`/admin/catalog/products/${id}`);
  },

  /**
   * Real sales performance (7-day trend, margin, top store, top modifier) for one product
   */
  async getProductPerformance(
    id: string,
    filters: ProductPerformanceFilters = {},
  ): Promise<ProductPerformance> {
    return apiClient.get<ProductPerformance>(`/admin/catalog/products/${id}/performance`, {
      params: {
        outletIds: filters.outletIds?.length ? filters.outletIds.join(",") : undefined,
        channel: filters.channel,
        days: filters.days,
      },
    });
  },

  /**
   * Create a new product
   */
  async createProduct(payload: ProductCreatePayload): Promise<ProductDetail> {
    return apiClient.post<ProductDetail>("/admin/catalog/products", payload);
  },

  /**
   * Update an existing product
   */
  async updateProduct(id: string, payload: ProductUpdatePayload): Promise<ProductDetail> {
    return apiClient.patch<ProductDetail>(`/admin/catalog/products/${id}`, payload);
  },

  /**
   * Archive / Soft-delete a product
   */
  async archiveProduct(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/admin/catalog/products/${id}`);
  },

  /**
   * Restore an archived product back to DRAFT
   */
  async restoreProduct(id: string): Promise<ProductDetail> {
    return apiClient.post<ProductDetail>(`/admin/catalog/products/${id}/restore`);
  },

  /**
   * Bulk action (status change, delete, category change, price adjust)
   */
  async bulkAction(payload: BulkActionPayload): Promise<{ success: boolean; action: string; affectedItems: number }> {
    return apiClient.post<{ success: boolean; action: string; affectedItems: number }>(
      "/admin/catalog/products/bulk",
      payload
    );
  },

  // ---------------------------------------------------------------------------
  // Modifier groups & options (/admin/catalog/modifiers)
  // ---------------------------------------------------------------------------

  async getModifierGroups(productId?: string): Promise<ModifierGroupDetail[]> {
    return apiClient.get<ModifierGroupDetail[]>("/admin/catalog/modifiers/groups", {
      params: productId ? { productId } : undefined,
    });
  },

  async getModifierGroupById(id: string): Promise<ModifierGroupDetail> {
    return apiClient.get<ModifierGroupDetail>(`/admin/catalog/modifiers/groups/${id}`);
  },

  async createModifierGroup(payload: ModifierGroupPayload & { name: string }): Promise<ModifierGroupDetail> {
    return apiClient.post<ModifierGroupDetail>("/admin/catalog/modifiers/groups", payload);
  },

  async updateModifierGroup(id: string, payload: ModifierGroupPayload): Promise<ModifierGroupDetail> {
    return apiClient.patch<ModifierGroupDetail>(`/admin/catalog/modifiers/groups/${id}`, payload);
  },

  async deleteModifierGroup(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/admin/catalog/modifiers/groups/${id}`);
  },

  async duplicateModifierGroup(id: string): Promise<ModifierGroupDetail> {
    return apiClient.post<ModifierGroupDetail>(`/admin/catalog/modifiers/groups/${id}/duplicate`);
  },

  async reorderModifierGroups(ids: string[]): Promise<ModifierGroupDetail[]> {
    return apiClient.put<ModifierGroupDetail[]>("/admin/catalog/modifiers/groups/order", { ids });
  },

  async createModifierOption(
    payload: ModifierOptionPayload & { modifierGroupId: string; name: string },
  ): Promise<ModifierGroupDetail> {
    return apiClient.post<ModifierGroupDetail>("/admin/catalog/modifiers/items", payload);
  },

  async updateModifierOption(id: string, payload: ModifierOptionPayload): Promise<ModifierGroupDetail> {
    return apiClient.patch<ModifierGroupDetail>(`/admin/catalog/modifiers/items/${id}`, payload);
  },

  async deleteModifierOption(id: string): Promise<ModifierGroupDetail> {
    return apiClient.delete<ModifierGroupDetail>(`/admin/catalog/modifiers/items/${id}`);
  },

  async reorderModifierOptions(groupId: string, ids: string[]): Promise<ModifierGroupDetail> {
    return apiClient.put<ModifierGroupDetail>(`/admin/catalog/modifiers/groups/${groupId}/items/order`, { ids });
  },

  /** Groups attached to a product, with its defaults and hidden options */
  async getProductModifierBindings(productId: string): Promise<ProductModifierBinding[]> {
    return apiClient.get<ProductModifierBinding[]>(`/admin/catalog/products/${productId}/modifier-groups`);
  },

  async setProductModifierBindings(
    productId: string,
    groups: Pick<
      ProductModifierBinding,
      "modifierGroupId" | "defaultModifierId" | "hiddenModifierIds" | "isRequiredOverride" | "maxSelectOverride" | "includedQuantityOverride"
    >[],
  ): Promise<ProductModifierBinding[]> {
    return apiClient.put<ProductModifierBinding[]>(`/admin/catalog/products/${productId}/modifier-groups`, { groups });
  },

  /** Options marked out at one store */
  async getModifierStock(outletId: string): Promise<ModifierStockEntry[]> {
    return apiClient.get<ModifierStockEntry[]>("/admin/catalog/modifiers/availability", {
      params: { outletId },
    });
  },

  async setModifierStock(
    outletId: string,
    items: { modifierId: string; isAvailable: boolean; reason?: string | null }[],
  ): Promise<ModifierStockEntry[]> {
    return apiClient.put<ModifierStockEntry[]>("/admin/catalog/modifiers/availability", { outletId, items });
  },

  /**
   * Get all categories master list
   */
  async getCategories(): Promise<CategoryItem[]> {
    return apiClient.get<CategoryItem[]>("/admin/catalog/categories");
  },

  /**
   * Create a new category
   */
  async createCategory(payload: {
    name: string;
    slug?: string;
    description?: string | null;
    displayOrder?: number;
    colorTheme?: string;
    bgColorTheme?: string;
    isActive?: boolean;
    metadata?: Record<string, unknown>;
  }): Promise<CategoryItem> {
    return apiClient.post<CategoryItem>("/admin/catalog/categories", payload);
  },

  /**
   * Update a category. `metadata` replaces the stored object, so pass the full merged value.
   */
  async updateCategory(
    id: string,
    payload: { description?: string | null; metadata?: Record<string, unknown> }
  ): Promise<CategoryItem> {
    return apiClient.patch<CategoryItem>(`/admin/catalog/categories/${id}`, payload);
  },

  /**
   * Delete a category by ID
   */
  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/admin/catalog/categories/${id}`);
  },

  /**
   * Product Variants
   */
  async getVariants(productId: string): Promise<ProductVariant[]> {
    return apiClient.get<ProductVariant[]>(`/admin/catalog/products/${productId}/variants`);
  },

  async createVariant(productId: string, payload: Partial<ProductVariant>): Promise<ProductVariant> {
    return apiClient.post<ProductVariant>(`/admin/catalog/products/${productId}/variants`, payload);
  },

  async updateVariant(variantId: string, payload: Partial<ProductVariant>): Promise<ProductVariant> {
    return apiClient.patch<ProductVariant>(`/admin/catalog/variants/${variantId}`, payload);
  },

  async deleteVariant(variantId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/admin/catalog/variants/${variantId}`);
  },
};
