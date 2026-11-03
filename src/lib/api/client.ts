import { ApiResponse, ApiError } from "@/types/api";
import { AdminAuthClient } from "@/features/auth/api/auth-client";
import { useAppStore } from "@/stores/use-app-store";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly response: ApiError;

  constructor(statusCode: number, response: ApiError) {
    super(response.message || `Request failed with status ${statusCode}`);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Enterprise HTTP Client
 * Built on native fetch with interceptors, timeouts, and correlation IDs.
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/proxy") {
    this.baseUrl = baseUrl;
  }

  private generateCorrelationId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  public async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, timeoutMs = 15000, headers, ...restOptions } = options;

    let url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    const correlationId = this.generateCorrelationId();

    const isFormData = typeof FormData !== "undefined" && restOptions.body instanceof FormData;
    const requestHeaders = new Headers(headers);
    if (!isFormData && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }
    requestHeaders.set("Accept", "application/json");
    requestHeaders.set("x-correlation-id", correlationId);

    // Mandatory Token-Only API Ingestion
    const token = AdminAuthClient.getToken();
    if (token && !requestHeaders.has("Authorization")) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      let response = await fetch(url, {
        ...restOptions,
        headers: requestHeaders,
        signal: options.signal || controller.signal,
      });

      // Handle session expiration and automatic token rotation
      if (response.status === 401 && !endpoint.includes("/admin/auth/")) {
        const refreshedToken = await AdminAuthClient.refreshSession();
        if (refreshedToken) {
          requestHeaders.set("Authorization", `Bearer ${refreshedToken}`);
          response = await fetch(url, {
            ...restOptions,
            headers: requestHeaders,
            signal: options.signal || controller.signal,
          });
        } else {
          // Both access token and refresh token have expired
          if (typeof window !== "undefined") {
            useAppStore.getState().setSessionExpired(true);
          }
        }
      }

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!response.ok) {
        let errorPayload: ApiError;
        if (isJson) {
          errorPayload = await response.json();
        } else {
          errorPayload = {
            success: false,
            statusCode: response.status,
            message: response.statusText || "HTTP Error",
            error: "HttpException",
            path: endpoint,
            timestamp: new Date().toISOString(),
            correlationId,
          };
        }
        throw new ApiClientError(response.status, errorPayload);
      }

      if (!isJson) {
        return (await response.text()) as unknown as T;
      }

      const body: ApiResponse<T> = await response.json();
      return body.data !== undefined ? body.data : (body as unknown as T);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiClientError) {
        throw error;
      }

      const isTimeout = error instanceof DOMException && error.name === "AbortError";
      const networkError: ApiError = {
        success: false,
        statusCode: isTimeout ? 408 : 0,
        message: isTimeout ? "Request timed out after 15s" : "Network error or server unreachable",
        error: isTimeout ? "RequestTimeout" : "NetworkError",
        path: endpoint,
        timestamp: new Date().toISOString(),
        correlationId,
      };

      throw new ApiClientError(networkError.statusCode, networkError);
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  public upload<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      timeoutMs: options?.timeoutMs ?? 60000,
    });
  }
}

export const apiClient = new ApiClient();

