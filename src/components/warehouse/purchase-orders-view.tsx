"use client";

import * as React from "react";
import Link from "next/link";
import { BruviIcon } from "@/components/icons";
import { TableEmptyRow } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  WarehouseModuleHeader,
  WarehouseTabBar,
} from "@/components/warehouse/warehouse-header-and-tabs";
import { PURCHASE_ORDERS_LIST } from "@/lib/warehouse/mock-warehouse-data";
import { PurchaseOrderStatus } from "@/types/warehouse";
import { cn } from "@/lib/utils/cn";

const STATUS_TABS: Array<{ id: string; label: string; count: number }> = [
  { id: "ALL", label: "All", count: 42 },
  { id: "Draft", label: "Draft", count: 1 },
  { id: "Awaiting approval", label: "Awaiting approval", count: 1 },
  { id: "Sent", label: "Sent", count: 2 },
  { id: "In transit · customs", label: "In transit", count: 1 },
  { id: "Partially received", label: "Partially received", count: 1 },
  { id: "Closed", label: "Closed", count: 36 },
];

function PoStatusPill({ status }: { status: PurchaseOrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap",
        status === "Draft" && "bg-background-subtle text-text-muted border border-border",
        (status === "Awaiting approval" || status === "Partially received") &&
          "bg-warning-surface text-warning",
        (status === "Sent" || status === "In transit · customs") &&
          "bg-info-surface text-info",
        status === "Closed" && "bg-success-surface text-success",
      )}
    >
      {status}
    </span>
  );
}

export function PurchaseOrdersView() {
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [search, setSearch] = React.useState("");
  const [dateRange, setDateRange] = React.useState("Last 30 days");
  const [exported, setExported] = React.useState(false);

  const activeFilterCount =
    (statusFilter !== "ALL" ? 1 : 0) +
    (search.trim() ? 1 : 0) +
    (dateRange !== "All time" ? 1 : 0);

  const clearAllFilters = () => {
    setStatusFilter("ALL");
    setSearch("");
    setDateRange("All time");
  };

  const filtered = React.useMemo(() => {
    return PURCHASE_ORDERS_LIST.filter((po) => {
      if (statusFilter !== "ALL" && po.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          po.poNumber.toLowerCase().includes(q) ||
          po.supplier.toLowerCase().includes(q) ||
          po.itemsSummary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, statusFilter]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <WarehouseModuleHeader
        breadcrumb="WAREHOUSE / PURCHASE ORDERS"
        title="Purchase orders"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => {
                setExported(true);
                setTimeout(() => setExported(false), 2400);
              }}
            >
              {exported ? "Exported CSV" : "Export"}
            </Button>
            <Button asChild size="compact">
              <Link href="/warehouse/purchase-orders/new">
                New purchase order
              </Link>
            </Button>
          </>
        }
      />

      <WarehouseTabBar active="purchase-orders" />

      {/* Filter Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "h-9 px-3 rounded-lg text-[12px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer",
                  active
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-text-secondary hover:bg-background-subtle",
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[11px] tnum",
                    active ? "text-white/80" : "text-text-muted",
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center w-full sm:w-[210px]">
            <BruviIcon
              name="search"
              size={15}
              className="pointer-events-none absolute left-3 text-text-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="PO, supplier or SKU"
              className="h-9 w-full pl-8 pr-3 rounded-lg border border-border-input bg-white text-[12px] font-medium text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>
          <select
            aria-label="Date range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border-input bg-white text-[12px] font-bold text-text cursor-pointer"
          >
            <option value="Last 30 days">Last 30 days</option>
            <option value="Last 90 days">Last 90 days</option>
            <option value="All time">All time</option>
          </select>
        </div>
      </div>

      {/* PO Table */}
      <Card className="overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <th className="py-3 pl-5 pr-2">PO</th>
                <th className="py-3 px-2">Supplier · items</th>
                <th className="py-3 px-2">Created</th>
                <th className="py-3 px-2">ETA</th>
                <th className="py-3 px-2 text-right">Value</th>
                <th className="py-3 px-2">Received</th>
                <th className="py-3 pl-2 pr-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((po) => {
                const hasProgress =
                  typeof po.receivedQty === "number" &&
                  typeof po.orderedQty === "number";
                const pct = hasProgress
                  ? Math.round((po.receivedQty! / po.orderedQty!) * 100)
                  : 0;
                return (
                  <tr
                    key={po.poNumber}
                    className="hover:bg-background-subtle/60 transition-colors"
                  >
                    <td className="py-3.5 pl-5 pr-2 text-[13px] font-extrabold text-text tnum whitespace-nowrap">
                      <Link
                        href={
                          po.status === "Draft"
                            ? "/warehouse/purchase-orders/new"
                            : po.status === "Partially received"
                              ? "/warehouse/receiving"
                              : "/warehouse/suppliers/SUP-004"
                        }
                        className="hover:text-primary hover:underline underline-offset-2"
                      >
                        {po.poNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-2">
                      <p className="text-[13px] font-bold text-text">
                        {po.supplier}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {po.itemsSummary}
                      </p>
                    </td>
                    <td className="py-3.5 px-2 text-[12px] text-text-secondary tnum whitespace-nowrap">
                      {po.created}
                    </td>
                    <td className="py-3.5 px-2 text-[12px] font-bold text-text tnum whitespace-nowrap">
                      {po.eta}
                    </td>
                    <td className="py-3.5 px-2 text-right text-[13px] font-extrabold text-text tnum whitespace-nowrap">
                      ₹{po.valueInr.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-2">
                      {hasProgress ? (
                        <div className="flex flex-col gap-1 min-w-[90px]">
                          <div className="h-1.5 w-full rounded-full bg-background-subtle overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                pct === 100 ? "bg-success" : "bg-warning",
                              )}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-text-muted tnum">
                            {po.receivedQty?.toLocaleString("en-IN")} /{" "}
                            {po.orderedQty?.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[12px] text-text-muted">—</span>
                      )}
                    </td>
                    <td className="py-3.5 pl-2 pr-5 text-right">
                      <PoStatusPill status={po.status} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <TableEmptyRow
                  colSpan={7}
                  title="No purchase orders match these filters"
                  description={
                    search.trim()
                      ? `Nothing matching “${search.trim()}”${statusFilter !== "ALL" ? ` is ${statusFilter.toLowerCase()}` : ""} in ${dateRange.toLowerCase()}.`
                      : "Try clearing or broadening your active status and date filters."
                  }
                  filterChips={[
                    ...(statusFilter !== "ALL"
                      ? [
                          {
                            id: "status",
                            label: `Status: ${statusFilter}`,
                            onRemove: () => setStatusFilter("ALL"),
                          },
                        ]
                      : []),
                    ...(search.trim()
                      ? [
                          {
                            id: "search",
                            label: `Search: “${search.trim()}”`,
                            onRemove: () => setSearch(""),
                          },
                        ]
                      : []),
                    ...(dateRange !== "All time"
                      ? [
                          {
                            id: "date",
                            label: dateRange,
                            onRemove: () => setDateRange("All time"),
                          },
                        ]
                      : []),
                  ]}
                  actionLabel="Clear all filters"
                  onAction={clearAllFilters}
                  secondaryActionLabel={
                    statusFilter !== "ALL" ? "Search all statuses" : undefined
                  }
                  onSecondaryAction={
                    statusFilter !== "ALL"
                      ? () => setStatusFilter("ALL")
                      : undefined
                  }
                />
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-text-muted">
          <span>
            {filtered.length === 0
              ? `0 of 42 purchase orders match · ${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} applied`
              : `1–${filtered.length} of 42 · sorted by status, then ETA`}
          </span>
          <div className="flex items-center gap-5">
            <span className="tnum">
              {filtered.length === 0 ? (
                "Open POs 6 across all statuses"
              ) : (
                <>
                  Open POs <strong className="text-text">6</strong> ·{" "}
                  <strong className="text-text">₹6,97,603 open value</strong>
                </>
              )}
            </span>
            {filtered.length > 0 && (
              <button
                type="button"
                className="font-bold text-text hover:text-primary cursor-pointer"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
