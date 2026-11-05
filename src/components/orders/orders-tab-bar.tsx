"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTab, fetchOrders } from "@/store/slices/orders-slice";
import { OrderTab } from "@/types/orders";
import { cn } from "@/lib/utils/cn";

export function OrdersTabBar() {
  const dispatch = useAppDispatch();
  const { counts, filters } = useAppSelector((state) => state.orders);

  const tabs: Array<{ id: OrderTab; label: string; count: number; isError?: boolean }> = [
    { id: "ALL", label: "All", count: counts.all },
    { id: "LIVE", label: "Live", count: counts.live },
    { id: "DELAYED", label: "Delayed", count: counts.delayed, isError: true },
    { id: "COMPLETED", label: "Completed", count: counts.completed },
    { id: "REFUNDED", label: "Refunded", count: counts.refunded },
    { id: "CANCELLED", label: "Cancelled", count: counts.cancelled },
  ];

  const handleSelectTab = (tabId: OrderTab) => {
    dispatch(setTab(tabId));
    dispatch(fetchOrders({ tab: tabId }));
  };

  return (
    <div className="w-full flex items-end gap-6 border-b border-[#dce2ea] overflow-x-auto overflow-y-hidden no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => {
        const isActive = filters.tab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSelectTab(tab.id)}
            className={cn(
              "h-9 flex items-center justify-center pb-2 text-label whitespace-nowrap cursor-pointer transition-all border-b-2 -mb-px",
              isActive
                ? "border-[#1c3a66] text-[#0f2340] font-bold"
                : "border-transparent font-bold hover:border-gray-300",
              !isActive && tab.isError ? "text-[#c0352b] hover:text-[#9e271e]" : "",
              !isActive && !tab.isError ? "text-[#3f4b5e] hover:text-[#0f2340]" : ""
            )}
          >
            <span>
              {tab.label} · {tab.count.toLocaleString("en-IN")}
            </span>
          </button>
        );
      })}
    </div>
  );
}

