"use client";

import * as React from "react";

export function CustomerDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse select-none">
      {/* 1. Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 rounded bg-[#ebeff4]" />
        <div className="h-4 w-3 rounded bg-[#ebeff4]" />
        <div className="h-4 w-32 rounded bg-[#ebeff4]" />
      </div>

      {/* 2. Hero Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#ebeff4] shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-48 rounded bg-[#ebeff4]" />
              <div className="h-6 w-24 rounded-full bg-[#ebeff4]" />
              <div className="h-6 w-28 rounded-full bg-[#ebeff4]" />
            </div>
            <div className="h-4 w-80 rounded bg-[#ebeff4]" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-24 rounded-[12px] bg-[#ebeff4]" />
          <div className="h-9 w-28 rounded-[12px] bg-[#ebeff4]" />
          <div className="h-9 w-28 rounded-[12px] bg-[#ebeff4]" />
        </div>
      </div>

      {/* 3. Tabs Navigation Skeleton */}
      <div className="flex items-center gap-6 border-b border-[#dce2ea] pb-2">
        <div className="h-6 w-20 rounded bg-[#ebeff4]" />
        <div className="h-6 w-24 rounded bg-[#ebeff4]" />
        <div className="h-6 w-16 rounded bg-[#ebeff4]" />
        <div className="h-6 w-16 rounded bg-[#ebeff4]" />
        <div className="h-6 w-20 rounded bg-[#ebeff4]" />
      </div>

      {/* 4. Two Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* KPI Cards skeleton */}
          <div className="h-[106px] w-full rounded-[16px] bg-[#ebeff4]" />
          {/* Favourite Drink skeleton */}
          <div className="h-[122px] w-full rounded-[16px] bg-[#ebeff4]" />
          {/* Recent Activity skeleton */}
          <div className="h-[350px] w-full rounded-[16px] bg-[#ebeff4]" />
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Club Card skeleton */}
          <div className="h-[158px] w-full rounded-[16px] bg-[#ebeff4]" />
          {/* Preferences skeleton */}
          <div className="h-[320px] w-full rounded-[16px] bg-[#ebeff4]" />
          {/* Latest Note skeleton */}
          <div className="h-[98px] w-full rounded-[16px] bg-[#ebeff4]" />
        </div>
      </div>
    </div>
  );
}

