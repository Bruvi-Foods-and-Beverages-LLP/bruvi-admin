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
          <div className="w-[64px] text-caption-bold text-text-secondary uppercase tracking-[0.48px] text-left">
            Order
          </div>
          <div className="w-[48px] text-caption-bold text-text-secondary uppercase tracking-[0.48px] text-left">
            Time
          </div>
          <div className="w-[96px] text-caption-bold text-text-secondary uppercase tracking-[0.48px] text-left">
            Store
          </div>
          <div className="w-[80px] text-caption-bold text-text-secondary uppercase tracking-[0.48px] text-left">
            Channel
          </div>
          <div className="flex-1 min-w-[160px] max-w-[310px] text-caption-bold text-text-secondary uppercase tracking-[0.48px] text-left">
            Customer
          </div>
          <div className="w-[48px] text-caption-bold text-text-secondary uppercase tracking-[0.48px] text-right">
            Items
          </div>
          <div className="w-[80px] text-caption-bold text-text-secondary uppercase tracking-[0.48px] text-right">
            Total
          </div>
          <div className="w-[64px] text-caption-bold text-text-secondary uppercase tracking-[0.48px] text-left">
            Payment
          </div>
          <div className="w-[96px] text-caption-bold text-text-secondary uppercase tracking-[0.48px] text-left">
            Status
          </div>
          <div className="w-[64px] text-caption-bold text-text-secondary uppercase tracking-[0.48px] text-right">
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
                className="h-14 px-5 flex items-center gap-4 hover:bg-[#f5f7fa]/70 transition-colors cursor-pointer select-none group"
              >
                {/* 1. Order Number */}
                <div className="w-[64px] text-body-s font-extrabold text-[#0f2340] group-hover:text-[#1c3a66] transition-colors">
                  {order.orderNumber}
                </div>

                {/* 2. Time */}
                <div className="w-[48px] text-body-s text-[#3f4b5e]">
                  {order.time}
                </div>

                {/* 3. Store */}
                <div className="w-[96px] text-body-s text-[#0f2340] truncate" title={order.storeName}>
                  {order.storeName}
                </div>

                {/* 4. Channel */}
                <div className="w-[80px] text-body-s text-[#3f4b5e] truncate" title={order.channel}>
                  {order.channel}
                </div>

                {/* 5. Customer */}
                <div
                  className="flex-1 min-w-[160px] max-w-[310px] text-body-s text-[#0f2340] truncate"
                  title={order.customerName}
                >
                  {order.customerName}
                </div>

                {/* 6. Items Count */}
                <div className="w-[48px] text-body-s font-semibold text-[#0f2340] text-right">
                  {order.itemCount}
                </div>

                {/* 7. Total Amount */}
                <div
                  className={cn(
                    "w-[80px] text-price-xs font-display font-extrabold text-right tnum",
                    isCancelled ? "line-through text-[#3f4b5e]" : "text-[#0f2340]"
                  )}
                >
                  ₹{order.totalAmount}
                </div>

                {/* 8. Payment Method */}
                <div className="w-[64px] text-body-s text-[#3f4b5e]">
                  {order.paymentMethod}
                </div>

                {/* 9. Status Badge */}
                <div className="w-[96px] flex items-center">
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* 10. Make Timer */}
                <div
                  className={cn(
                    "w-[64px] text-body-s font-semibold text-right",
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
