import { apiClient } from "@/lib/api/client";
import {
  LabOverviewData,
  LabBatchDetailData,
  LabPerformanceData,
  LabPipelineItem,
  CreateLabBatchPayload,
  ExtendLabBatchPayload,
  PromoteLabBatchPayload,
  CreateLabIdeaPayload,
} from "@/types/lab";

export const LabApi = {
  /**
   * Get Lab Overview dashboard data (KPIs, active batch, pipeline columns, batches table)
   */
  async getOverview(): Promise<LabOverviewData> {
    return apiClient.get<LabOverviewData>("/admin/lab/overview");
  },

  /**
   * Get detail metrics for a single batch (daily sales, store breakdown, ingredients, sentiment)
   */
  async getBatchDetail(id: string): Promise<LabBatchDetailData> {
    return apiClient.get<LabBatchDetailData>(`/admin/lab/batches/${id}`);
  },

  /**
   * Get dynamic context for Create Lab Product page (stores, recipes, dates, next batch)
   */
  async getCreateContext(): Promise<any> {
    return apiClient.get<any>("/admin/lab/create-context");
  },

  /**
   * Get next auto-incremented batch number
   */
  async getNextBatchNumber(): Promise<{ nextBatchNumber: string }> {
    return apiClient.get<{ nextBatchNumber: string }>("/admin/lab/next-batch-number");
  },

  /**
   * Create a new lab experiment batch
   */
  async createBatch(payload: CreateLabBatchPayload): Promise<any> {
    return apiClient.post<any>("/admin/lab/batches", payload);
  },

  /**
   * Update draft batch parameters
   */
  async updateBatch(id: string, payload: Partial<CreateLabBatchPayload>): Promise<any> {
    return apiClient.patch<any>(`/admin/lab/batches/${id}`, payload);
  },

  /**
   * End batch pilot early before the scheduled end date
   */
  async endBatchEarly(id: string, reason?: string): Promise<any> {
    return apiClient.post<any>(`/admin/lab/batches/${id}/actions/end-early`, { reason });
  },

  /**
   * Extend batch pilot window and optionally expand cup cap
   */
  async extendBatchWindow(id: string, payload: ExtendLabBatchPayload): Promise<any> {
    return apiClient.post<any>(`/admin/lab/batches/${id}/actions/extend-window`, payload);
  },

  /**
   * Promote batch to permanent core menu
   */
  async promoteBatchToMenu(id: string, payload: PromoteLabBatchPayload = {}): Promise<any> {
    return apiClient.post<any>(`/admin/lab/batches/${id}/actions/promote`, payload);
  },

  /**
   * Get cross-batch performance metrics, comparison table, and graduation funnel
   */
  async getPerformance(): Promise<LabPerformanceData> {
    return apiClient.get<LabPerformanceData>("/admin/lab/performance");
  },

  /**
   * List all ideas in the R&D pipeline
   */
  async listIdeas(): Promise<LabPipelineItem[]> {
    return apiClient.get<LabPipelineItem[]>("/admin/lab/ideas");
  },

  /**
   * Propose a new lab drink idea
   */
  async createIdea(payload: CreateLabIdeaPayload): Promise<LabPipelineItem> {
    return apiClient.post<LabPipelineItem>("/admin/lab/ideas", payload);
  },

  /**
   * Upvote a proposed drink idea
   */
  async voteIdea(id: string): Promise<any> {
    return apiClient.post<any>(`/admin/lab/ideas/${id}/vote`);
  },
};
