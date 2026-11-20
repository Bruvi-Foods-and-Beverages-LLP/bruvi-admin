"use client";

import * as React from "react";

export function LabOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* 1. Top KPI Row Skeleton (4 Cards h-[106px]) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[106px] rounded-[16px] border border-[#DCE2EA] bg-white p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-[#EBEFF4] rounded-[4px]" />
              <div className="h-6 w-16 bg-[#EBEFF4] rounded-full" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="h-8 w-28 bg-[#EBEFF4] rounded-[6px]" />
              <div className="h-3 w-16 bg-[#EBEFF4] rounded-[4px]" />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Pipeline Kanban Skeleton (5 Columns) */}
      <div className="rounded-[16px] border border-[#DCE2EA] bg-white p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 bg-[#EBEFF4] rounded-[6px]" />
          <div className="h-4 w-28 bg-[#EBEFF4] rounded-[4px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((col) => (
            <div
              key={col}
              className="rounded-[12px] bg-[#F5F7FA] p-3 flex flex-col gap-3 min-h-[180px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#DCE2EA]/60">
                <div className="h-3.5 w-20 bg-[#DCE2EA] rounded-[4px]" />
                <div className="h-4 w-6 bg-[#DCE2EA] rounded-full" />
              </div>
              <div className="h-20 rounded-[8px] bg-white border border-[#DCE2EA] p-2.5 flex flex-col justify-between">
                <div className="h-3.5 w-full bg-[#EBEFF4] rounded-[4px]" />
                <div className="h-3 w-2/3 bg-[#EBEFF4] rounded-[4px]" />
                <div className="flex justify-between items-center pt-1">
                  <div className="h-3 w-12 bg-[#EBEFF4] rounded-[3px]" />
                  <div className="h-3 w-8 bg-[#EBEFF4] rounded-[3px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Batches Table Skeleton */}
      <div className="rounded-[16px] border border-[#DCE2EA] bg-white overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#DCE2EA] flex items-center justify-between">
          <div className="h-5 w-32 bg-[#EBEFF4] rounded-[6px]" />
          <div className="h-8 w-48 bg-[#EBEFF4] rounded-[8px]" />
        </div>
        <div className="p-4 flex flex-col gap-3">
          {[1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="h-14 rounded-[8px] bg-[#F5F7FA] px-4 flex items-center justify-between gap-4"
            >
              <div className="h-4 w-16 bg-[#DCE2EA] rounded-[4px]" />
              <div className="h-4 w-40 bg-[#DCE2EA] rounded-[4px]" />
              <div className="h-4 w-24 bg-[#DCE2EA] rounded-[4px]" />
              <div className="h-4 w-20 bg-[#DCE2EA] rounded-[4px]" />
              <div className="h-6 w-20 bg-[#DCE2EA] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

