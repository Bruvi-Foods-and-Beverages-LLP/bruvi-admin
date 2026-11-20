import type { AdminAuthResponse, AdminUser } from "../types";

const TOKEN_KEY = "bruvi_hq_admin_token";
const REFRESH_KEY = "bruvi_hq_admin_refresh_token";
const USER_KEY = "bruvi_hq_admin_user";

/** The one refresh in flight in this tab; every caller that hits a 401 awaits it. */
let refreshInFlight: Promise<string | null> | null = null;

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
      if (auth.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
      }
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      const maxAge =
        auth.expiresInSeconds ||
        (auth as unknown as { expiresIn?: number; expires_in?: number }).expiresIn ||
        (auth as unknown as { expiresIn?: number; expires_in?: number }).expires_in ||
        28800;
      document.cookie = `bruvi_admin_token=${auth.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
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
   * Silent refresh of the access token.
   *
   * The backend rotates refresh tokens and treats a second use of the same one as theft
   * (it revokes the whole session). Pages fire several requests at once, so when the access
   * token expires they would all refresh with the same token and log the admin out. Instead:
   * - callers in this tab share one refresh (single flight);
   * - tabs take turns through a Web Lock;
   * - a caller whose token was already replaced (by another caller or tab) just uses the
   *   current token instead of refreshing again.
   *
   * @param failedToken the access token the caller's request was rejected with
   */
  static async refreshSession(failedToken?: string | null): Promise<string | null> {
    const current = this.getToken();
    if (failedToken && current && current !== failedToken) return current;

    if (!refreshInFlight) {
      refreshInFlight = this.refreshExclusively(failedToken ?? current).finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  }

  private static async refreshExclusively(staleToken: string | null): Promise<string | null> {
    const run = async () => {
      // Another tab may have refreshed while this one waited for the lock
      const latest = this.getToken();
      if (staleToken && latest && latest !== staleToken) return latest;
      return this.performRefresh();
    };
    if (typeof navigator !== "undefined" && navigator.locks?.request) {
      return navigator.locks.request("bruvi-admin-token-refresh", run);
    }
    return run();
  }

  private static async performRefresh(): Promise<string | null> {
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
      const refreshPayload = data?.data ?? data;
      if (!refreshPayload || (!refreshPayload.accessToken && !(refreshPayload as { token?: string }).token)) {
        return null;
      }

      const accessToken = refreshPayload.accessToken || (refreshPayload as { token?: string }).token;
      const newRefreshToken = refreshPayload.refreshToken;
      const expiresInSeconds =
        refreshPayload.expiresInSeconds ||
        (refreshPayload as { expiresIn?: number }).expiresIn ||
        (refreshPayload as { expires_in?: number }).expires_in ||
        900;

      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, accessToken);
        if (newRefreshToken) {
          localStorage.setItem(REFRESH_KEY, newRefreshToken);
        }
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `bruvi_admin_token=${accessToken}; path=/; max-age=${expiresInSeconds}; SameSite=Lax${secure}`;
      }

      return accessToken;
    } catch {
      return null;
    }
  }

  /**
   * Helper to parse user profile from diverse backend envelope formats
   */
  private static extractUserFromPayload(payload: unknown): AdminUser | null {
    if (!payload || typeof payload !== "object") return null;
    const obj = payload as Record<string, unknown>;
    const candidate =
      (obj.data && typeof obj.data === "object" ? (obj.data as Record<string, unknown>).user ?? obj.data : null) ??
      obj.user ??
      (obj.id ? obj : null);

    if (candidate && typeof candidate === "object" && "id" in candidate && candidate.id) {
      return candidate as unknown as AdminUser;
    }
    return null;
  }

  /**
   * Fetch latest profile details from backend
   */
  static async fetchCurrentProfile(): Promise<AdminUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      let response = await fetch("/api/proxy/admin/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Try refreshing token once
        const newToken = await this.refreshSession(token);
        if (newToken) {
          response = await fetch("/api/proxy/admin/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
        } else {
          return null;
        }
      }

      if (!response.ok) return null;

      const data = await response.json();
      const user = this.extractUserFromPayload(data);

      if (user) {
        if (typeof window !== "undefined") {
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
        return user;
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
      // Attempt silent refresh (shared with any other request that failed at the same time)
      token = await this.refreshSession(token);
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
