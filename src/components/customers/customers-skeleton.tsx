"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomersTableSkeleton() {
  return (
    <div className="w-full flex flex-col">
      {/* Table Header Placeholder */}
      <div className="h-9 px-5 flex items-center gap-3 bg-[#f5f7fa] border-b border-[#dce2ea]">
        <div className="w-6 flex justify-center">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-[218px] h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-[120px] h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-[96px] h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-[80px] h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-[56px] h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-[96px] h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-[80px] h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-[96px] h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-[120px] h-3 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Row Shimmers */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-14 px-5 flex items-center gap-3 border-b border-[#dce2ea] last:border-b-0"
        >
          {/* Checkbox */}
          <div className="w-6 flex justify-center">
            <Skeleton className="h-4 w-4 rounded-[4px]" />
          </div>
          {/* Customer */}
          <div className="w-[218px] flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-2.5 w-32 rounded" />
            </div>
          </div>
          {/* Phone */}
          <div className="w-[120px]">
            <Skeleton className="h-3.5 w-24 rounded" />
          </div>
          {/* Store */}
          <div className="w-[96px]">
            <Skeleton className="h-3.5 w-20 rounded" />
          </div>
          {/* Tier */}
          <div className="w-[80px]">
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          {/* Visits */}
          <div className="w-[56px] flex justify-end">
            <Skeleton className="h-3.5 w-8 rounded" />
          </div>
          {/* Lifetime */}
          <div className="w-[96px] flex justify-end">
            <Skeleton className="h-3.5 w-16 rounded" />
          </div>
          {/* Wallet */}
          <div className="w-[80px] flex justify-end">
            <Skeleton className="h-3.5 w-14 rounded" />
          </div>
          {/* Last Order */}
          <div className="w-[96px] flex flex-col gap-1">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-2.5 w-16 rounded" />
          </div>
          {/* Tags */}
          <div className="w-[120px]">
            <Skeleton className="h-6 w-18 rounded-[4px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

