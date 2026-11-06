"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersTableSkeleton() {
  return (
    <div className="w-full flex flex-col">
      {/* Table Header Placeholder */}
      <div className="h-9 px-5 flex items-center gap-4 bg-[#f5f7fa] border-b border-[#dce2ea]">
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="flex-1 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Row Shimmers (AS01 Pattern) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-13 px-5 flex items-center gap-4 border-b border-[#dce2ea] last:border-b-0"
        >
          {/* Order No */}
          <div className="w-16">
            <Skeleton className="h-4 w-12 rounded-[4px]" />
          </div>
          {/* Time */}
          <div className="w-12">
            <Skeleton className="h-4 w-9 rounded-[4px]" />
          </div>
          {/* Store */}
          <div className="w-24">
            <Skeleton className="h-4 w-20 rounded-[4px]" />
          </div>
          {/* Channel */}
          <div className="w-20">
            <Skeleton className="h-4 w-14 rounded-[4px]" />
          </div>
          {/* Customer */}
          <div className="flex-1">
            <Skeleton className="h-4 w-36 rounded-[4px]" />
          </div>
          {/* Items */}
          <div className="w-12 flex justify-end">
            <Skeleton className="h-4 w-4 rounded-[4px]" />
          </div>
          {/* Total */}
          <div className="w-20 flex justify-end">
            <Skeleton className="h-4 w-12 rounded-[4px]" />
          </div>
          {/* Payment */}
          <div className="w-16">
            <Skeleton className="h-4 w-10 rounded-[4px]" />
          </div>
          {/* Status Badge */}
          <div className="w-24">
            <Skeleton className="h-6 w-20 rounded-[12px]" />
          </div>
          {/* Make Timer */}
          <div className="w-16 flex justify-end">
            <Skeleton className="h-4 w-8 rounded-[4px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

