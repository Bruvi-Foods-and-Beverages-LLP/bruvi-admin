"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Pixel-Perfect Loading Skeleton for Product Details (Figma 225:90840)
 */
export function ProductDetailSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-150">
      {/* 1. Header Skeleton */}
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48 bg-[#EBEFF4]" />
            <Skeleton className="h-10 w-80 bg-[#EBEFF4]" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-6 w-24 bg-[#EBEFF4]" />
              <Skeleton className="h-6 w-20 rounded-[4px] bg-[#EBEFF4]" />
              <Skeleton className="h-6 w-32 rounded-[12px] bg-[#EBEFF4]" />
              <Skeleton className="h-6 w-24 rounded-[12px] bg-[#EBEFF4]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-[12px] bg-[#EBEFF4]" />
            <Skeleton className="h-9 w-28 rounded-[12px] bg-[#EBEFF4]" />
          </div>
        </div>

        {/* Tab Bar Skeleton */}
        <div className="w-full border-b border-[#DCE2EA] flex gap-6 pt-2 pb-1">
          <Skeleton className="h-8 w-16 bg-[#EBEFF4]" />
          <Skeleton className="h-8 w-24 bg-[#EBEFF4]" />
          <Skeleton className="h-8 w-16 bg-[#EBEFF4]" />
          <Skeleton className="h-8 w-20 bg-[#EBEFF4]" />
          <Skeleton className="h-8 w-24 bg-[#EBEFF4]" />
        </div>
      </div>

      {/* 2. Grid Columns Skeleton */}
      <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column Skeleton (712px) */}
        <div className="w-full lg:w-[712px] flex flex-col gap-5">
          {/* Top Card */}
          <div className="w-full rounded-[16px] border border-[#DCE2EA] bg-white p-[21px] flex gap-6">
            <Skeleton className="w-[160px] h-[160px] rounded-[12px] bg-[#EBEFF4] shrink-0" />
            <div className="flex-1 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24 bg-[#EBEFF4]" />
                <Skeleton className="h-4 w-full bg-[#EBEFF4]" />
                <Skeleton className="h-4 w-3/4 bg-[#EBEFF4]" />
              </div>
              <div className="grid grid-cols-4 gap-6 pt-2 border-t border-[#F5F7FA]">
                <Skeleton className="h-12 w-full bg-[#EBEFF4]" />
                <Skeleton className="h-12 w-full bg-[#EBEFF4]" />
                <Skeleton className="h-12 w-full bg-[#EBEFF4]" />
                <Skeleton className="h-12 w-full bg-[#EBEFF4]" />
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="w-full flex flex-col sm:flex-row gap-5">
            <Skeleton className="w-full sm:w-[320px] h-[348px] rounded-[16px] bg-[#EBEFF4]" />
            <Skeleton className="flex-1 h-[348px] rounded-[16px] bg-[#EBEFF4]" />
          </div>
        </div>

        {/* Right Column Skeleton (400px) */}
        <div className="w-full lg:w-[400px] flex flex-col gap-5 shrink-0">
          <Skeleton className="w-full h-[460px] rounded-[16px] bg-[#EBEFF4]" />
          <Skeleton className="w-full h-[104px] rounded-[16px] bg-[#EBEFF4]" />
        </div>
      </div>
    </div>
  );
}
