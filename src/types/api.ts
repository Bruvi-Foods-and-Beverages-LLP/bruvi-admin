/**
 * Standard Backend Response Envelope
 * Matches NestJS standard response filter envelope.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  timestamp: string;
  correlationId?: string;
}

/**
 * Standard API Error Envelope
 */
export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  error: string;
  path: string;
  timestamp: string;
  correlationId?: string;
  validationErrors?: Record<string, string[]>;
}

/**
 * Standard Pagination Metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Standard Pagination Query Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

/**
 * Immutable Audit Metadata for ERP entities
 */
export interface AuditMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
}

