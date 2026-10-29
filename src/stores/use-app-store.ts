import { create } from "zustand";

interface AppState {
  // Store Switcher Scope (Figma: "All stores · 12" vs individual outlet)
  activeStoreId: string;
  setActiveStoreId: (storeId: string) => void;

  // Responsive Layout
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Global Command Palette (⌘K)
  isCommandMenuOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
  toggleCommandMenu: () => void;

  // Critical State AS05: Session Timeout with Form Preservation
  isSessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;

  // Critical State AS06: Offline & Stale Data Warning
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
  lastOnlineTimestamp: string;
}

export const useAppStore = create<AppState>((set) => ({
  activeStoreId: "all",
  setActiveStoreId: (storeId) => set({ activeStoreId: storeId }),

  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  isCommandMenuOpen: false,
  setCommandMenuOpen: (open) => set({ isCommandMenuOpen: open }),
  toggleCommandMenu: () => set((state) => ({ isCommandMenuOpen: !state.isCommandMenuOpen })),

  isSessionExpired: false,
  setSessionExpired: (expired) => set({ isSessionExpired: expired }),

  isOffline: false,
  setOffline: (offline) =>
    set({
      isOffline: offline,
      lastOnlineTimestamp: offline ? new Date().toISOString() : "",
    }),
  lastOnlineTimestamp: "",
}));

