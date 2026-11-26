"use client";

import * as React from "react";
import Link from "next/link";
import { BruviIcon } from "@/components/icons";
import { TableEmptyRow } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InventoryModuleHeader,
  InventoryTabBar,
} from "@/components/inventory/inventory-header-and-tabs";
import {
  INDIRANAGAR_STOCK_ITEMS,
  INVENTORY_BRANCHES,
} from "@/lib/inventory/mock-inventory-data";
import { cn } from "@/lib/utils/cn";

type StatusFilter = "all" | "below-par" | "out";

export function StoreStockView({ initialStoreId = "indiranagar" }: { initialStoreId?: string }) {
  const [selectedStoreId, setSelectedStoreId] = React.useState(initialStoreId);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [keyItemsOnly, setKeyItemsOnly] = React.useState(false);

  const activeBranch =
    INVENTORY_BRANCHES.find((b) => b.id === selectedStoreId) ??
    INVENTORY_BRANCHES[0];

  const filteredItems = React.useMemo(() => {
    return INDIRANAGAR_STOCK_ITEMS.filter((item) => {
      if (keyItemsOnly && !item.isKeyItem) return false;
      if (statusFilter === "below-par" && item.status !== "Low") return false;
      if (statusFilter === "out" && item.status !== "Out") return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.brandSpec.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [keyItemsOnly, search, statusFilter]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <InventoryModuleHeader
        breadcrumb="Inventory / Store stock"
        title={`${activeBranch.name} stock`}
        actions={
          <>
            <Button asChild variant="workspace" size="compact">
              <Link href="/inventory/counts">Start count</Link>
            </Button>
            <Button asChild size="compact">
              <Link href={`/inventory/transfers?new=1&to=${activeBranch.id}`}>
                Request transfer
              </Link>
            </Button>
          </>
        }
      />

      <InventoryTabBar active="store-stock" />

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Store Select */}
          <div className="relative flex items-center">
            <BruviIcon
              name="store"
              size={16}
              className="pointer-events-none absolute left-3 text-text-secondary"
            />
            <select
              aria-label="Select store"
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="h-9 pl-9 pr-8 rounded-lg border border-border-input bg-white text-[13px] font-bold text-text focus:outline-none focus:ring-2 focus:ring-focus cursor-pointer"
            >
              {INVENTORY_BRANCHES.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} · {branch.code}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center w-full sm:w-[240px]">
            <BruviIcon
              name="search"
              size={16}
              className="pointer-events-none absolute left-3 text-text-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ingredients"
              className="h-9 w-full pl-9 pr-3 rounded-lg border border-border-input bg-white text-[13px] font-medium text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "all", label: "All · 42" },
                { id: "below-par", label: "Below par · 2" },
                { id: "out", label: "Out · 1" },
              ] as Array<{ id: StatusFilter; label: string }>
            ).map((chip) => {
              const active = statusFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setStatusFilter(chip.id)}
                  className={cn(
                    "h-9 px-3.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer",
                    active
                      ? "bg-primary text-white"
                      : "bg-white border border-border text-text-secondary hover:bg-background-subtle",
                  )}
                >
                  {chip.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setKeyItemsOnly((v) => !v)}
              className={cn(
                "h-9 px-3.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer",
                keyItemsOnly
                  ? "bg-surface-brand border border-primary/40 text-primary"
                  : "bg-white border border-border text-text-secondary hover:bg-background-subtle",
              )}
            >
              Key items
            </button>
          </div>
        </div>

        <span className="text-[13px] font-semibold text-text-muted tnum shrink-0">
          Stock value{" "}
          <strong className="font-extrabold text-text">
            {activeBranch.stockValueLabel}
          </strong>
        </span>
      </div>

      {/* Store Stock Table */}
      <Card className="overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <th className="py-3 pl-5 pr-3">Ingredient</th>
                <th className="py-3 px-3">Unit</th>
                <th className="py-3 px-3 text-right">On hand</th>
                <th className="py-3 px-3 text-right">Par</th>
                <th className="py-3 px-3 text-right">Reorder</th>
                <th className="py-3 px-3 text-right">Use / day</th>
                <th className="py-3 px-3 text-right">Cover</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Counted</th>
                <th className="py-3 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-background-subtle/60 transition-colors"
                >
                  <td className="py-3.5 pl-5 pr-3">
                    <Link
                      href={`/inventory/ingredients/${item.id}`}
                      className="block group"
                    >
                      <p className="text-[14px] font-bold text-text group-hover:text-primary">
                        {item.name}
                      </p>
                      <p className="text-[12px] text-text-muted">
                        {item.brandSpec}
                      </p>
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-[13px] font-medium text-text-secondary">
                    {item.unit}
                  </td>
                  <td
                    className={cn(
                      "py-3.5 px-3 text-right text-[14px] font-extrabold tnum",
                      item.status === "Out"
                        ? "text-error"
                        : item.status === "Low"
                          ? "text-warning"
                          : "text-text",
                    )}
                  >
                    {item.onHand}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[13px] font-semibold text-text-secondary tnum">
                    {item.par}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[13px] font-semibold text-text-secondary tnum">
                    {item.reorderPoint}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[13px] font-semibold text-text-secondary tnum">
                    {item.usePerDay}
                  </td>
                  <td
                    className={cn(
                      "py-3.5 px-3 text-right text-[13px] font-bold tnum",
                      item.status === "Out"
                        ? "text-error"
                        : item.status === "Low"
                          ? "text-warning"
                          : "text-text",
                    )}
                  >
                    {item.coverDays === 0 ? "0 d" : `${item.coverDays.toFixed(1)} d`}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                        item.status === "Out" && "bg-error-surface text-error",
                        item.status === "Low" && "bg-warning-surface text-warning",
                        item.status === "OK" && "bg-success-surface text-success",
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[12px] font-medium text-text-muted whitespace-nowrap">
                    {item.countedAt}
                  </td>
                  <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-3 text-[13px] font-bold">
                      <Link
                        href={`/inventory/adjust?store=${activeBranch.id}&item=${item.id}`}
                        className="text-text hover:text-primary"
                      >
                        Adjust
                      </Link>
                      <Link
                        href={`/inventory/transfers?new=1&to=${activeBranch.id}&item=${item.id}`}
                        className="text-primary hover:text-primary-pressed"
                      >
                        Transfer
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <TableEmptyRow
                  colSpan={10}
                  title="No ingredients match these filters"
                  description={`No stock items in ${activeBranch.name} match your active search or status filters.`}
                  filterChips={[
                    ...(statusFilter !== "all"
                      ? [
                          {
                            id: "status",
                            label: `Status: ${statusFilter === "below-par" ? "Below par" : "Out"}`,
                            onRemove: () => setStatusFilter("all"),
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
                    ...(keyItemsOnly
                      ? [
                          {
                            id: "key-items",
                            label: "Key items only",
                            onRemove: () => setKeyItemsOnly(false),
                          },
                        ]
                      : []),
                  ]}
                  actionLabel="Clear all filters"
                  onAction={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setKeyItemsOnly(false);
                  }}
                  secondaryActionLabel={
                    statusFilter !== "all" ? "Show all statuses" : undefined
                  }
                  onSecondaryAction={
                    statusFilter !== "all"
                      ? () => setStatusFilter("all")
                      : undefined
                  }
                />
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-5 py-3.5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-text-muted">
          <span>
            1–{filteredItems.length} of 42 ingredients · sorted by days of cover
          </span>
          <div className="flex items-center gap-3 font-bold">
            <button
              type="button"
              disabled
              className="text-text-muted/60 cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              type="button"
              className="text-text hover:text-primary cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
