"use client";

import { useAppStore } from "@/stores/use-app-store";
import { WifiOff, RefreshCw } from "lucide-react";

/**
 * Figma AS06: Offline & Stale Data Warning
 * Sticky, non-blocking notification allowing users to continue viewing cached data.
 */
export function OfflineBanner() {
  const isOffline = useAppStore((s) => s.isOffline);

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className="sticky top-0 z-50 flex items-center justify-between bg-amber-500 px-4 py-2 text-xs font-medium text-white shadow-md animate-in slide-in-from-top"
    >
      <div className="flex items-center space-x-2">
        <WifiOff className="h-4 w-4 shrink-0 animate-pulse" />
        <span>
          <strong>Live data paused</strong> · Displaying cached operational data · Connection lost.
        </span>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="flex items-center space-x-1 rounded bg-black/20 px-2 py-1 text-white hover:bg-black/30 transition-colors"
      >
        <RefreshCw className="h-3 w-3" />
        <span>Retry Now</span>
      </button>
    </div>
  );
}

