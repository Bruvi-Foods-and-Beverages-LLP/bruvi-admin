"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearFilters, fetchOrders } from "@/store/slices/orders-slice";
import { Order } from "@/types/orders";
import { OrderStatusBadge } from "./order-status-badge";
import { OrdersTableSkeleton } from "./orders-skeleton";
import { OrdersEmptyState } from "./orders-empty-state";
import { cn } from "@/lib/utils/cn";

export function OrdersTable() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, isLoading, filters } = useAppSelector((state) => state.orders);

  const handleRowClick = (order: Order) => {
    router.push(`/orders/${encodeURIComponent(order.orderNumber)}`);
  };

  const handleResetFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchOrders({ search: "", store: "All 12", channel: "All", status: "All" }));
  };

  if (isLoading && orders.length === 0) {
    return <OrdersTableSkeleton />;
  }

  const isFiltered = Boolean(
    filters.search ||
    (filters.store && filters.store !== "All 12") ||
    (filters.channel && filters.channel !== "All") ||
    (filters.status && filters.status !== "All") ||
    (filters.tab && filters.tab !== "ALL")
  );

  if (orders.length === 0) {
    return (
      <OrdersEmptyState
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="min-w-[1000px] flex flex-col">
        {/* Table Header Row (Figma 225:101183) */}
        <div className="h-9 px-5 flex items-center gap-4 bg-[#f5f7fa] border-b border-[#dce2ea] select-none">
          <div className="w-[64px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700]">
            Order
          </div>
          <div className="w-[48px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700]">
            Time
          </div>
          <div className="w-[96px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700]">
            Store
          </div>
          <div className="w-[80px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700]">
            Channel
          </div>
          <div className="flex-1 min-w-[160px] max-w-[310px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700]">
            Customer
          </div>
          <div className="w-[48px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-right [font-variation-settings:'wght'_700]">
            Items
          </div>
          <div className="w-[80px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-right [font-variation-settings:'wght'_700]">
            Total
          </div>
          <div className="w-[64px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700]">
            Payment
          </div>
          <div className="w-[96px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700]">
            Status
          </div>
          <div className="w-[64px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-right [font-variation-settings:'wght'_700]">
            Make
          </div>
        </div>

        {/* Table Data Rows */}
        <div className="flex flex-col divide-y divide-[#dce2ea]">
          {orders.map((order) => {
            const isCancelled = order.status === "Cancelled" || order.isCancelled;
            const isDelayed = order.isDelayed || order.status.startsWith("Delayed");
            const hasTimer = order.makeTime && order.makeTime !== "—";

            return (
              <div
                key={order.id}
                onClick={() => handleRowClick(order)}
                className="h-13 px-5 flex items-center gap-4 hover:bg-[#f5f7fa]/70 transition-colors cursor-pointer select-none group"
              >
                {/* 1. Order Number */}
                <div className="w-[64px] font-sans font-extrabold text-[14px] leading-5 text-[#0f2340] group-hover:text-[#1c3a66] transition-colors [font-variation-settings:'wght'_800]">
                  {order.orderNumber}
                </div>

                {/* 2. Time */}
                <div className="w-[48px] font-sans font-normal text-[14px] leading-5 text-[#3f4b5e] whitespace-nowrap [font-variation-settings:'wght'_400]">
                  {order.time}
                </div>

                {/* 3. Store */}
                <div className="w-[96px] font-sans font-normal text-[14px] leading-5 text-[#0f2340] truncate [font-variation-settings:'wght'_400]" title={order.storeName}>
                  {order.storeName}
                </div>

                {/* 4. Channel */}
                <div className="w-[80px] font-sans font-normal text-[14px] leading-5 text-[#3f4b5e] truncate [font-variation-settings:'wght'_400]" title={order.channel}>
                  {order.channel}
                </div>

                {/* 5. Customer */}
                <div
                  className="flex-1 min-w-[160px] max-w-[310px] font-sans font-normal text-[14px] leading-5 text-[#0f2340] truncate [font-variation-settings:'wght'_400]"
                  title={order.customerName}
                >
                  {order.customerName}
                </div>

                {/* 6. Items Count */}
                <div className="w-[48px] font-sans font-semibold text-[14px] leading-5 text-[#0f2340] text-right [font-variation-settings:'wght'_600]">
                  {order.itemCount}
                </div>

                {/* 7. Total Amount */}
                <div
                  className={cn(
                    "w-[80px] font-display font-extrabold text-[14px] leading-5 text-right tnum [font-variation-settings:'wdth'_112,'wght'_800] [font-feature-settings:'tnum'_1]",
                    isCancelled ? "line-through text-[#3f4b5e]" : "text-[#0f2340]"
                  )}
                >
                  ₹{order.totalAmount}
                </div>

                {/* 8. Payment Method */}
                <div className="w-[64px] font-sans font-normal text-[14px] leading-5 text-[#3f4b5e] [font-variation-settings:'wght'_400]">
                  {order.paymentMethod}
                </div>

                {/* 9. Status Badge */}
                <div className="w-[96px] flex items-center">
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* 10. Make Timer */}
                <div
                  className={cn(
                    "w-[64px] font-sans font-semibold text-[14px] leading-5 text-right [font-variation-settings:'wght'_600]",
                    isDelayed ? "text-[#c0352b]" : hasTimer ? "text-[#0f2340]" : "text-[#7f8ca0]"
                  )}
                >
                  {order.makeTime || "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
