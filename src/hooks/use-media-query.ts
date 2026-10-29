"use client";

import { useSyncExternalStore } from "react";

/**
 * Standard Breakpoints matching Tailwind CSS & Figma Responsive Grid:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px (Desktop breakpoint)
 * - xl: 1280px (Standard Desktop)
 * - 2xl: 1536px (Large Display)
 */
export const BREAKPOINTS = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") {
      return () => {};
    }
    const media = window.matchMedia(query);
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.lg);
}
