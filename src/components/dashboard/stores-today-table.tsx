"use client";

import React from "react";
import Link from "next/link";
import { DashboardStoreItem } from "@/types/dashboard";

interface StoresTodayTableProps {
  totalStores?: number;
  topStores?: DashboardStoreItem[];
}

export function StoresTodayTable({
  totalStores = 0,
  topStores = [],
}: StoresTodayTableProps) {
  const getStatusBadgeClass = (tone: DashboardStoreItem["statusTone"]) => {
    switch (tone) {
      case "warning":
        return "bg-[#fdf0d8] text-[#9a5b00]";
      case "error":
        return "bg-[#fce8e6] text-[#c0352b]";
      case "success":
        return "bg-[#e3f4ea] text-[#1f7a4d]";
      default:
        return "bg-[#f5f7fa] text-[#55647a]";
    }
  };

  return (
    <div className="w-full lg:w-[720px] rounded-[16px] bg-white border border-[#dce2ea] overflow-hidden flex flex-col justify-between shadow-sm min-h-[522px]">
      <div>
        {/* Card Header */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">
              Stores today
            </h2>
            <span className="font-sans font-medium text-[12px] leading-[16px] text-[#3f4b5e]">
              Top {topStores.length} of {totalStores} by net sales
            </span>
          </div>

          <Link
            href="/stores"
            className="font-sans font-bold text-[14px] leading-[20px] text-[#1c3a66] hover:underline"
          >
            All stores →
          </Link>
        </div>

        {/* Table Header Row (Exact Title Case from Figma) */}
        <div className="bg-[#f5f7fa] border-y border-[#dce2ea] px-5 py-2.5 flex items-center gap-4 text-[#3f4b5e] font-sans font-bold text-[12px] leading-[16px]">
          <div className="flex-1 min-w-[150px]">Store</div>
          <div className="w-[90px]">City</div>
          <div className="w-[90px] text-right">Net sales</div>
          <div className="w-[64px] text-right">Orders</div>
          <div className="w-[76px] text-right">Make time</div>
          <div className="w-[100px]">Status</div>
        </div>

        {/* Table Rows or Empty State */}
        {topStores.length > 0 ? (
          <div className="divide-y divide-[#dce2ea]">
            {topStores.map((store) => (
              <Link
                key={store.id || store.code}
                href={`/stores/${store.code}`}
                className="h-[56px] px-5 flex items-center gap-4 hover:bg-[#f8fafc] transition-colors cursor-pointer group"
              >
                {/* Rank + Store Name */}
                <div className="flex-1 min-w-[150px] flex items-center gap-3 min-w-0">
                  <span className="font-display font-extrabold text-[14px] leading-[20px] text-[#55647a] w-6 shrink-0">
                    {store.rank}
                  </span>
                  <span className="font-sans font-bold text-[14px] leading-[20px] text-[#0f2340] group-hover:text-[#1c3a66] truncate">
                    {store.name}
                  </span>
                </div>

                {/* City */}
                <div className="w-[90px] font-sans font-normal text-[14px] leading-[20px] text-[#3f4b5e] truncate">
                  {store.city}
                </div>

                {/* Net Sales */}
                <div className="w-[90px] font-display font-extrabold text-[14px] leading-[20px] text-[#0f2340] text-right">
                  {store.netSalesFormatted}
                </div>

                {/* Orders */}
                <div className="w-[64px] font-sans font-semibold text-[14px] leading-[20px] text-[#0f2340] text-right">
                  {store.ordersCount}
                </div>

                {/* Make Time */}
                <div
                  className={`w-[76px] text-right text-[14px] leading-[20px] ${
                    store.isMakeTimeHigh
                      ? "font-display font-extrabold text-[#c0352b]"
                      : "font-sans font-semibold text-[#0f2340]"
                  }`}
                >
                  {store.makeTimeFormatted}
                </div>

                {/* Status Badge */}
                <div className="w-[100px] flex items-center">
                  <span
                    className={`h-6 px-2 rounded-[12px] font-sans font-bold text-[12px] leading-[16px] inline-flex items-center ${getStatusBadgeClass(
                      store.statusTone
                    )}`}
                  >
                    {store.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 px-6 text-center flex flex-col items-center justify-center">
            <p className="font-sans font-bold text-[14px] leading-[20px] text-[#0f2340]">
              No stores available
            </p>
            <p className="font-sans font-normal text-[12px] leading-[16px] text-[#3f4b5e] mt-1">
              No store locations have been provisioned yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
