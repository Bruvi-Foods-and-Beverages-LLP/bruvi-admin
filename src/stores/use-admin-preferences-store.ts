"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UiScalePreset = "90" | "95" | "100" | "105" | "110";
export type TableDensity = "comfortable" | "compact";

export const UI_SCALE_PX: Record<UiScalePreset, number> = {
  "90": 14,
  "95": 14.75,
  "100": 15.5,
  "105": 16.25,
  "110": 17,
};

export interface AdminPreferencesState {
  uiScale: UiScalePreset;
  tableDensity: TableDensity;
  sidebarCollapsedByDefault: boolean;
  showCommandHints: boolean;
  dateFormat: "DD MMM YYYY" | "YYYY-MM-DD" | "MM/DD/YYYY";
  numberFormat: "en-IN" | "en-US";
  setUiScale: (scale: UiScalePreset) => void;
  setTableDensity: (density: TableDensity) => void;
  setSidebarCollapsedByDefault: (val: boolean) => void;
  setShowCommandHints: (val: boolean) => void;
  setDateFormat: (fmt: "DD MMM YYYY" | "YYYY-MM-DD" | "MM/DD/YYYY") => void;
  setNumberFormat: (fmt: "en-IN" | "en-US") => void;
  resetPreferences: () => void;
}

export function applyAdminPreferencesToDom(state: {
  uiScale: UiScalePreset;
  tableDensity: TableDensity;
}) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.fontSize = `${UI_SCALE_PX[state.uiScale]}px`;
  root.dataset.density = state.tableDensity;
}

export const useAdminPreferencesStore = create<AdminPreferencesState>()(
  persist(
    (set) => ({
      uiScale: "100",
      tableDensity: "comfortable",
      sidebarCollapsedByDefault: false,
      showCommandHints: true,
      dateFormat: "DD MMM YYYY",
      numberFormat: "en-IN",
      setUiScale: (uiScale) => {
        set((s) => {
          applyAdminPreferencesToDom({ uiScale, tableDensity: s.tableDensity });
          return { uiScale };
        });
      },
      setTableDensity: (tableDensity) => {
        set((s) => {
          applyAdminPreferencesToDom({ uiScale: s.uiScale, tableDensity });
          return { tableDensity };
        });
      },
      setSidebarCollapsedByDefault: (sidebarCollapsedByDefault) =>
        set({ sidebarCollapsedByDefault }),
      setShowCommandHints: (showCommandHints) => set({ showCommandHints }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setNumberFormat: (numberFormat) => set({ numberFormat }),
      resetPreferences: () => {
        const defaults = {
          uiScale: "100" as UiScalePreset,
          tableDensity: "comfortable" as TableDensity,
          sidebarCollapsedByDefault: false,
          showCommandHints: true,
          dateFormat: "DD MMM YYYY" as const,
          numberFormat: "en-IN" as const,
        };
        applyAdminPreferencesToDom(defaults);
        set(defaults);
      },
    }),
    {
      name: "bruvi-admin-preferences",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyAdminPreferencesToDom({
            uiScale: state.uiScale,
            tableDensity: state.tableDensity,
          });
        }
      },
    },
  ),
);
