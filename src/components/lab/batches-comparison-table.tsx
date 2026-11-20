"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { ComparisonBatch } from "@/types/lab";

interface BatchesComparisonTableProps {
  batches: ComparisonBatch[];
}

export function BatchesComparisonTable({ batches }: BatchesComparisonTableProps) {
  return (
    <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-[#dce2ea] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-title text-[#0F2340]">Batch comparison</h2>
          <span className="text-caption font-semibold px-2 py-0.5 rounded-full bg-[#EBEFF4] text-[#55647A]">
            Last 3 pilots
          </span>
        </div>
        <span className="text-caption text-[#55647A]">
          Normalized across operating stores & window days
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="h-9 border-b border-[#dce2ea] bg-[#F5F7FA]">
              <th className="px-6 text-caption-bold text-[#55647A] uppercase tracking-wider text-[11px]">
                BATCH
              </th>
              <th className="px-4 text-caption-bold text-[#55647A] uppercase tracking-wider text-[11px]">
                STORES
              </th>
              <th className="px-4 text-caption-bold text-[#55647A] uppercase tracking-wider text-[11px]">
                CUPS SOLD
              </th>
              <th className="px-4 text-caption-bold text-[#55647A] uppercase tracking-wider text-[11px]">
                CUPS / STORE / DAY
              </th>
              <th className="px-4 text-caption-bold text-[#55647A] uppercase tracking-wider text-[11px]">
                AVG RATING
              </th>
              <th className="px-4 text-caption-bold text-[#55647A] uppercase tracking-wider text-[11px]">
                BUY AGAIN %
              </th>
              <th className="px-4 text-caption-bold text-[#55647A] uppercase tracking-wider text-[11px]">
                MARGIN %
              </th>
              <th className="px-6 text-caption-bold text-[#55647A] uppercase tracking-wider text-[11px]">
                REORDER RATE
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dce2ea]">
            {batches.map((b) => {
              const isLive = b.status === "LIVE";
              return (
                <tr
                  key={b.id}
                  className={`h-14 transition-colors ${
                    isLive ? "bg-[#EBF1DE]/25 hover:bg-[#EBF1DE]/40" : "hover:bg-[#F5F7FA]"
                  }`}
                >
                  {/* 1. Batch name & tag */}
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] ${
                          isLive
                            ? "bg-[#DCFCE7] text-[#15803D]"
                            : "bg-[#EBEFF4] text-[#55647A]"
                        }`}
                      >
                        {b.batchNumber}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-label text-[#0F2340] font-bold">
                          {b.name}
                        </span>
                        <span className="text-[11px] text-[#55647A] uppercase font-semibold">
                          {b.status}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Stores */}
                  <td className="px-4 py-2 text-body-s text-[#55647A]">
                    {b.storesCount} stores
                  </td>

                  {/* 3. Cups sold */}
                  <td className="px-4 py-2 text-price-xs text-[#0F2340]">
                    {b.cupsSold.toLocaleString()}
                  </td>

                  {/* 4. Velocity */}
                  <td className="px-4 py-2">
                    <span
                      className={`text-price-xs font-bold ${
                        isLive ? "text-[#566F2C]" : "text-[#0F2340]"
                      }`}
                    >
                      {b.cupsPerStorePerDay}
                    </span>
                    {isLive && (
                      <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#DCFCE7] text-[#15803D]">
                        +238%
                      </span>
                    )}
                  </td>

                  {/* 5. Rating */}
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      <span className="text-price-xs text-[#0F2340]">{b.avgRating}</span>
                    </div>
                  </td>

                  {/* 6. Buy again */}
                  <td className="px-4 py-2">
                    <span
                      className={`text-price-xs font-bold px-2 py-0.5 rounded-[6px] ${
                        b.wouldBuyAgainPct >= 60
                          ? "bg-[#DCFCE7] text-[#15803D]"
                          : "text-[#55647A]"
                      }`}
                    >
                      {b.wouldBuyAgainPct}%
                    </span>
                  </td>

                  {/* 7. Margin */}
                  <td className="px-4 py-2 text-price-xs text-[#0F2340]">
                    {b.marginPct}%
                  </td>

                  {/* 8. Reorder rate */}
                  <td className="px-6 py-2 text-price-xs text-[#0F2340]">
                    {b.reorderRatePct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

