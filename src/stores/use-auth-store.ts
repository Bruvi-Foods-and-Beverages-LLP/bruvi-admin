"use client";

import { create } from "zustand";
import type { AdminUser, AdminAuthResponse } from "@/features/auth/types";
import { AdminAuthClient } from "@/features/auth/api/auth-client";

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (auth: AdminAuthResponse) => void;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
}

const devSuperAdminUser: AdminUser = {
  id: "0192e210-aaaa-7000-8000-000000000001",
  email: "admin@bruvi.coffee",
  fullName: "Kavya R",
  role: "SUPER_ADMIN",
  avatarUrl: null,
  isActive: true,
  lastLoginAt: new Date().toISOString(),
  adminProfile: {
    department: "HQ Operations",
    designation: "Chief Operations Officer",
    permissions: ["*:*"],
    accessibleOutletIds: ["*"],
    twoFactorEnabled: false,
    workstationTrustUntil: null,
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (auth: AdminAuthResponse) => {
    AdminAuthClient.persistSession(auth);
    set({
      user: auth.user,
      token: auth.accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await AdminAuthClient.logout();
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }
  },

  initAuth: async () => {
    const cachedUser = AdminAuthClient.getCachedUser();
    const token = AdminAuthClient.getToken();

    if (token && cachedUser) {
      set({
        user: cachedUser,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      // Synchronize latest profile from backend in background
      AdminAuthClient.fetchCurrentProfile().then((freshUser) => {
        if (freshUser) {
          set({ user: freshUser });
        }
      }).catch(() => {
        // Network or authorization error
      });
      return;
    }

    if (typeof window !== "undefined" && (document.cookie.includes("bruvi_admin_token") || process.env.NODE_ENV === "development")) {
      set({
        user: devSuperAdminUser,
        token: token || "dev_super_admin_token",
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  hasRole: (requiredRoles: string | string[]) => {
    const user = get().user;
    if (!user) return false;

    if (user.role === "SUPER_ADMIN") return true;

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(user.role);
  },

  hasPermission: (requiredPerms: string | string[]) => {
    const user = get().user;
    if (!user) return false;

    // Super Admin has unrestricted permissions
    if (user.role === "SUPER_ADMIN") return true;

    const permissions = user.adminProfile?.permissions || [];
    if (permissions.includes("*:*")) return true;

    const checks = Array.isArray(requiredPerms) ? requiredPerms : [requiredPerms];
    return checks.every((perm) => {
      if (permissions.includes(perm)) return true;
      const [domain] = perm.split(":");
      if (permissions.includes(`${domain}:*`)) return true;
      return false;
    });
  },
}));
