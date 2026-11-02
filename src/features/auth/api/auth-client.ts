import type { AdminAuthResponse, AdminUser } from "../types";

const TOKEN_KEY = "bruvi_hq_admin_token";
const REFRESH_KEY = "bruvi_hq_admin_refresh_token";
const USER_KEY = "bruvi_hq_admin_user";

export class AdminAuthClient {
  /**
   * Helper to parse cookie from document.cookie
   */
  private static getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
    return match ? decodeURIComponent(match[3]) : null;
  }

  /**
   * Authenticate admin via enterprise email and password
   */
  static async login(
    email: string,
    password: string,
    rememberWorkstation = false
  ): Promise<AdminAuthResponse> {
    const payload = {
      email: email.trim().toLowerCase(),
      password,
      rememberWorkstation,
    };

    let response: Response;
    let data: { success?: boolean; message?: string; data?: AdminAuthResponse } | null = null;

    try {
      response = await fetch("/api/proxy/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error("Unable to reach authentication server. Please ensure the backend is running.");
    }

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response || !response.ok || !data || !data.success || !data.data) {
      const errorMessage = data?.message || "Invalid corporate credentials or unauthorized access.";
      throw new Error(errorMessage);
    }

    const authResponse: AdminAuthResponse = data.data;
    this.persistSession(authResponse);
    return authResponse;
  }

  /**
   * Persist session tokens and cached user data in browser
   */
  static persistSession(auth: AdminAuthResponse) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(TOKEN_KEY, auth.accessToken);
      localStorage.setItem(REFRESH_KEY, auth.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `bruvi_admin_token=${auth.accessToken}; path=/; max-age=${auth.expiresInSeconds}; SameSite=Lax${secure}`;
    } catch {
      // localStorage may fail in restricted sandboxes
    }
  }

  /**
   * Retrieve cached authenticated user profile
   */
  static getCachedUser(): AdminUser | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get active token (prefers localStorage, falls back to cookie)
   */
  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      const local = localStorage.getItem(TOKEN_KEY);
      if (local && local.trim().length > 0) return local;
      return this.getCookie("bruvi_admin_token");
    } catch {
      return this.getCookie("bruvi_admin_token");
    }
  }

  /**
   * Get refresh token
   */
  static getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(REFRESH_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Perform silent refresh of JWT access token using stored refresh token
   */
  static async refreshSession(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch("/api/proxy/admin/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      if (!data.success || !data.data) {
        return null;
      }

      const { accessToken, refreshToken: newRefreshToken, expiresInSeconds } = data.data;

      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, accessToken);
        if (newRefreshToken) {
          localStorage.setItem(REFRESH_KEY, newRefreshToken);
        }
        document.cookie = `bruvi_admin_token=${accessToken}; path=/; max-age=${expiresInSeconds || 900}; SameSite=Lax`;
      }

      return accessToken;
    } catch {
      return null;
    }
  }

  /**
   * Fetch latest profile details from backend
   */
  static async fetchCurrentProfile(): Promise<AdminUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch("/api/proxy/admin/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Try refreshing token once
        const newToken = await this.refreshSession();
        if (newToken) {
          const retryRes = await fetch("/api/proxy/admin/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            if (retryData.success && retryData.data) {
              if (typeof window !== "undefined") {
                localStorage.setItem(USER_KEY, JSON.stringify(retryData.data));
              }
              return retryData.data as AdminUser;
            }
          }
        }
        return null;
      }

      if (!response.ok) return null;

      const data = await response.json();
      if (data.success && data.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem(USER_KEY, JSON.stringify(data.data));
        }
        return data.data as AdminUser;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Authenticated Fetch Wrapper
   * Injects active Bearer token and automatically handles token refresh on 401
   */
  static async authenticatedFetch(
    input: RequestInfo | URL,
    init: RequestInit = {}
  ): Promise<Response> {
    let token = this.getToken();

    const headers = new Headers(init.headers || {});
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let response = await fetch(input, {
      ...init,
      headers,
    });

    if (response.status === 401) {
      // Attempt silent refresh
      token = await this.refreshSession();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        response = await fetch(input, {
          ...init,
          headers,
        });
      }
    }

    return response;
  }

  /**
   * Sign out and clear credentials
   */
  static async logout(): Promise<void> {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null;
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

    if (refreshToken && token) {
      try {
        await fetch("/api/proxy/admin/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // Ignore network errors on logout
      }
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
      document.cookie = "bruvi_admin_token=; path=/; max-age=0";
    }
  }
}
