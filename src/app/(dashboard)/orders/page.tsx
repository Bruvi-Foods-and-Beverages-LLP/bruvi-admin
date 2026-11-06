"use client";

import * as React from "react";
import { useAppDispatch } from "@/store";
import { fetchOrders } from "@/store/slices/orders-slice";
import { OrdersPageHeader } from "@/components/orders/orders-page-header";
import { OrdersTabBar } from "@/components/orders/orders-tab-bar";
import { OrdersFilterToolbar } from "@/components/orders/orders-filter-toolbar";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrdersPaginationFooter } from "@/components/orders/orders-pagination-footer";

/**
 * Omnichannel Orders Operations Dashboard (Figma 225:101092 / A060 All Orders)
 * Conforms to the 1136px design grid, 4px spacing unit, Archivo/Manrope typography tokens.
 */
export default function OrdersPage() {
  const dispatch = useAppDispatch();

  // Load initial orders stream
  React.useEffect(() => {
    dispatch(fetchOrders());

    // Near-live refresh: customer actions (e.g. "I've picked it up") show up within
    // seconds. Skipped while the tab is hidden and refreshed as soon as it is visible.
    const refresh = () => {
      if (document.visibilityState === "visible") dispatch(fetchOrders());
    };
    const interval = setInterval(refresh, 3000);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
      {/* 1. Header Bar with Overline, Title, 41 Live Badge, Export & Delayed Filter (Figma 225:101132) */}
      <OrdersPageHeader />

      {/* 2. Omnichannel Status Filter Tabs (Figma 225:101145) */}
      <OrdersTabBar />

      {/* 3. Orders Master Table Card (Figma 225:101153) */}
      <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
        {/* Filter Toolbar with Search, Store, Channel, Status & Date Dropdowns (Figma 225:101154) */}
        <OrdersFilterToolbar />

        {/* High-Density Orders Table with Header & Rows (Figma 225:101183) */}
        <OrdersTable />

        {/* Pagination & Telemetry Footer (Figma 225:101311) */}
        <OrdersPaginationFooter />
      </div>
    </div>
  );
}
