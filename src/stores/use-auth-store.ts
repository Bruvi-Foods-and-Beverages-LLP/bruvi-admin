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

let initAuthInFlight: Promise<void> | null = null;

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
    if (initAuthInFlight) return initAuthInFlight;

    initAuthInFlight = (async () => {
      try {
        const token = AdminAuthClient.getToken();
        const currentAuth = get().isAuthenticated;
        const currentUser = get().user;

        if (!token) {
          if (!currentAuth) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
          return;
        }

        // Optimistically load cached user profile to prevent layout shift
        const cachedUser = AdminAuthClient.getCachedUser() || currentUser;
        if (cachedUser) {
          set({
            user: cachedUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        }

        // Verify cryptographic token validity directly against backend
        try {
          const freshUser = await AdminAuthClient.fetchCurrentProfile();
          if (freshUser) {
            set({
              user: freshUser,
              token: AdminAuthClient.getToken() || token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Note: If freshUser returned null (temporary network blip or response format variance),
            // DO NOT log out or destroy an active session if we have cached credentials.
            if (!cachedUser && !currentAuth) {
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
              });
            } else {
              set({ isLoading: false });
            }
          }
        } catch {
          if (!cachedUser && !currentAuth) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        }
      } finally {
        initAuthInFlight = null;
      }
    })();

    return initAuthInFlight;
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
