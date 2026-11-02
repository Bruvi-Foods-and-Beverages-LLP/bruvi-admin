import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function StoreDetailSkeleton() {
  return (
    <div
      className="flex flex-col gap-6 max-w-[1136px] w-full animate-in fade-in duration-200"
      aria-label="Loading store details"
    >
      {/* 1. Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12 bg-gray-200/70" />
        <span className="text-border-strong select-none">/</span>
        <Skeleton className="h-4 w-28 bg-gray-200/70" />
      </div>

      {/* 2. Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-72 rounded-[8px] bg-gray-200/80" />
            <Skeleton className="h-6 w-16 rounded-full bg-gray-200/70" />
          </div>
          <Skeleton className="h-4 w-96 max-w-full bg-gray-200/60" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Skeleton className="h-9 w-16 rounded-[12px] bg-gray-200/70" />
          <Skeleton className="h-9 w-36 rounded-[12px] bg-gray-200/80" />
        </div>
      </div>

      {/* 3. Tabs Skeleton */}
      <div className="flex items-center gap-6 border-b border-border pb-2.5">
        <Skeleton className="h-5 w-20 bg-gray-200/80" />
        <Skeleton className="h-5 w-12 bg-gray-200/50" />
        <Skeleton className="h-5 w-12 bg-gray-200/50" />
        <Skeleton className="h-5 w-14 bg-gray-200/50" />
        <Skeleton className="h-5 w-12 bg-gray-200/50" />
      </div>

      {/* 4. Main 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col justify-between h-[126px] p-5 rounded-[16px] bg-surface border border-border"
              >
                <Skeleton className="h-4 w-24 bg-gray-200/70" />
                <Skeleton className="h-8 w-28 bg-gray-200/90" />
                <Skeleton className="h-3 w-20 bg-gray-200/60" />
              </div>
            ))}
          </div>

          {/* Today by hour Chart Skeleton */}
          <div className="flex flex-col rounded-[16px] bg-surface border border-border p-6 gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5 w-32 bg-gray-200/80" />
                <Skeleton className="h-4 w-52 bg-gray-200/60" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-16 bg-gray-200/60" />
                <Skeleton className="h-4 w-16 bg-gray-200/60" />
              </div>
            </div>

            {/* Simulated Chart Bars */}
            <div className="flex items-end justify-between gap-2 h-44 px-2 pt-6 pb-2 border-b border-border/60">
              {[40, 70, 95, 120, 80, 50, 60, 55, 35, 25, 20, 18, 12, 10, 8, 8, 8].map(
                (h, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <Skeleton
                      style={{ height: `${h}px` }}
                      className="w-full rounded-t-[4px] bg-gray-200/70"
                    />
                  </div>
                )
              )}
            </div>

            {/* Channel totals breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-16 bg-gray-200/60" />
                  <Skeleton className="h-5 w-24 bg-gray-200/80" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Issues Card Skeleton */}
          <div className="flex flex-col rounded-[16px] bg-surface border border-border p-5 gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <Skeleton className="h-5 w-32 bg-gray-200/80" />
              <Skeleton className="h-4 w-20 bg-gray-200/60" />
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full bg-gray-200/70" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-48 bg-gray-200/80" />
                    <Skeleton className="h-3 w-72 bg-gray-200/60" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full bg-gray-200/60" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Live Channels Skeleton */}
          <div className="flex flex-col rounded-[16px] bg-surface border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <Skeleton className="h-5 w-28 bg-gray-200/80" />
              <Skeleton className="h-3 w-24 bg-gray-200/60" />
            </div>
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 h-12">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-2 w-2 rounded-full bg-gray-200/80" />
                    <Skeleton className="h-4 w-24 bg-gray-200/70" />
                  </div>
                  <Skeleton className="h-3 w-28 bg-gray-200/60" />
                </div>
              ))}
            </div>
          </div>

          {/* Location Map Card Skeleton */}
          <div className="flex flex-col rounded-[16px] bg-surface border border-border overflow-hidden">
            <Skeleton className="h-[120px] w-full rounded-none bg-gray-200/70 border-b border-border" />
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-16 bg-gray-200/60" />
                <Skeleton className="h-4 w-full bg-gray-200/70" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-12 bg-gray-200/60" />
                  <Skeleton className="h-4 w-28 bg-gray-200/70" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-12 bg-gray-200/60" />
                  <Skeleton className="h-4 w-28 bg-gray-200/70" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-12 bg-gray-200/60" />
                  <Skeleton className="h-4 w-28 bg-gray-200/70" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-16 bg-gray-200/60" />
                  <Skeleton className="h-4 w-20 bg-gray-200/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

