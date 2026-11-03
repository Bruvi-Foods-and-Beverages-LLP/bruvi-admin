import { apiClient } from "@/lib/api/client";
import {
  ProductDetail,
  ProductListResponse,
  CategoryMetric,
  CategoryItem,
  CatalogQueryFilters,
  ModifierGroup,
  ProductCreatePayload,
  ProductUpdatePayload,
  BulkActionPayload,
  ProductVariant,
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

  /**
   * Get modifier groups (all or filtered by productId)
   */
  async getModifierGroups(productId?: string): Promise<ModifierGroup[]> {
    return apiClient.get<ModifierGroup[]>("/admin/catalog/modifiers/groups", {
      params: productId ? { productId } : undefined,
    });
  },

  /**
   * Get all categories master list
   */
  async getCategories(): Promise<CategoryItem[]> {
    return apiClient.get<CategoryItem[]>("/admin/catalog/categories");
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
