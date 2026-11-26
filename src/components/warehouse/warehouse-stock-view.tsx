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
import { WAREHOUSE_STOCK_ROWS } from "@/lib/warehouse/mock-warehouse-data";
import { WarehouseStockStatus } from "@/types/warehouse";
import { cn } from "@/lib/utils/cn";

function StockStatusBadge({ status }: { status: WarehouseStockStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap",
        status === "In stock" && "bg-success-surface text-success",
        (status === "Low" || status === "Expiring") &&
          "bg-warning-surface text-warning",
        status === "Reorder" && "bg-error-surface text-error",
      )}
    >
      {status}
    </span>
  );
}

export function WarehouseStockView() {
  const [search, setSearch] = React.useState("");
  const [zone, setZone] = React.useState("ALL");
  const [category, setCategory] = React.useState("ALL");
  const [supplier, setSupplier] = React.useState("ALL");
  const [priorityFilter, setPriorityFilter] = React.useState(true);
  const [exported, setExported] = React.useState(false);

  const filtered = React.useMemo(() => {
    return WAREHOUSE_STOCK_ROWS.filter((row) => {
      if (zone !== "ALL" && row.zone !== zone) return false;
      if (category !== "ALL" && row.category !== category) return false;
      if (supplier !== "ALL" && row.supplier !== supplier) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          row.sku.toLowerCase().includes(q) ||
          row.name.toLowerCase().includes(q) ||
          row.bin.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [category, search, supplier, zone]);

  const totalShownValue = React.useMemo(
    () => filtered.reduce((acc, r) => acc + r.valueInr, 0),
    [filtered],
  );

  const clearFilters = () => {
    setSearch("");
    setZone("ALL");
    setCategory("ALL");
    setSupplier("ALL");
    setPriorityFilter(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <WarehouseModuleHeader
        breadcrumb="WAREHOUSE / STOCK"
        title="Stock on hand"
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
              {exported ? "Exported CSV" : "Export CSV"}
            </Button>
            <Button asChild size="compact">
              <Link href="/inventory/adjust">Adjust stock</Link>
            </Button>
          </>
        }
      />

      <WarehouseTabBar active="stock" />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex items-center flex-1 min-w-[220px]">
          <BruviIcon
            name="search"
            size={16}
            className="pointer-events-none absolute left-3 text-text-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU, item or bin"
            className="h-9 w-full pl-9 pr-3 rounded-lg border border-border-input bg-white text-[13px] font-medium text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus"
          />
        </div>

        <select
          aria-label="Filter by zone"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border-input bg-white text-[13px] font-bold text-text cursor-pointer"
        >
          <option value="ALL">Zone: All</option>
          <option value="A">Zone: Ambient (A)</option>
          <option value="C">Zone: Chiller (C)</option>
          <option value="F">Zone: Freezer (F)</option>
        </select>

        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border-input bg-white text-[13px] font-bold text-text cursor-pointer"
        >
          <option value="ALL">Category: All</option>
          <option value="Coffee">Coffee</option>
          <option value="Dairy">Dairy</option>
          <option value="Syrups">Syrups</option>
          <option value="Matcha">Matcha</option>
          <option value="Packaging">Packaging</option>
        </select>

        <button
          type="button"
          onClick={() => setPriorityFilter((v) => !v)}
          className={cn(
            "h-9 px-3.5 rounded-lg text-[13px] font-bold transition-colors cursor-pointer",
            priorityFilter
              ? "bg-primary text-white"
              : "bg-white border border-border-input text-text-secondary hover:bg-background-subtle",
          )}
        >
          Low &amp; expiring + top value
        </button>

        <select
          aria-label="Filter by supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border-input bg-white text-[13px] font-bold text-text cursor-pointer"
        >
          <option value="ALL">Supplier: All</option>
          <option value="Oatside India">Oatside India</option>
          <option value="Monin India">Monin India</option>
          <option value="Dak Lak Coffee Traders">Dak Lak Coffee Traders</option>
          <option value="Fresh Farms">Fresh Farms</option>
        </select>

        <button
          type="button"
          onClick={clearFilters}
          className="h-9 px-2.5 text-[13px] font-bold text-text-secondary hover:text-primary cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Stock Table */}
      <Card className="overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <th className="py-3 pl-5 pr-2">SKU</th>
                <th className="py-3 px-2">Item</th>
                <th className="py-3 px-2">Zone · bin</th>
                <th className="py-3 px-2 text-right">On hand</th>
                <th className="py-3 px-2 text-right">Reserved</th>
                <th className="py-3 px-2 text-right">Available</th>
                <th className="py-3 px-2 text-right">Unit cost</th>
                <th className="py-3 px-2 text-right">Value</th>
                <th className="py-3 px-2">Expiry</th>
                <th className="py-3 pl-2 pr-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((row) => (
                <tr
                  key={row.sku}
                  className="hover:bg-background-subtle/60 transition-colors"
                >
                  <td className="py-3.5 pl-5 pr-2 text-[12px] font-semibold text-text-muted tnum whitespace-nowrap">
                    {row.sku}
                  </td>
                  <td className="py-3.5 px-2">
                    <Link
                      href={
                        row.sku === "DY-OAT-1L"
                          ? "/warehouse/batches/OAT-2609-17"
                          : "/inventory/ingredients/ing-oat-1l"
                      }
                      className="block group"
                    >
                      <p className="text-[13px] font-bold text-text group-hover:text-primary">
                        {row.name}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {row.subtitle}
                      </p>
                    </Link>
                  </td>
                  <td className="py-3.5 px-2 text-[12px] font-bold text-text-secondary tnum whitespace-nowrap">
                    {row.bin}
                  </td>
                  <td className="py-3.5 px-2 text-right text-[13px] font-extrabold text-text tnum whitespace-nowrap">
                    {row.onHandLabel}
                  </td>
                  <td className="py-3.5 px-2 text-right text-[12px] font-medium text-text-muted tnum">
                    {row.reserved}
                  </td>
                  <td className="py-3.5 px-2 text-right text-[13px] font-extrabold text-text tnum whitespace-nowrap">
                    {row.availableLabel}
                  </td>
                  <td className="py-3.5 px-2 text-right text-[12px] font-medium text-text-secondary tnum whitespace-nowrap">
                    ₹{row.unitCostInr.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-2 text-right text-[13px] font-extrabold text-text tnum whitespace-nowrap">
                    ₹{row.valueInr.toLocaleString("en-IN")}
                  </td>
                  <td
                    className={cn(
                      "py-3.5 px-2 text-[12px] font-semibold whitespace-nowrap",
                      row.status === "Expiring"
                        ? "text-warning font-bold"
                        : "text-text-secondary",
                    )}
                  >
                    {row.expiryLabel}
                  </td>
                  <td className="py-3.5 pl-2 pr-5 text-right">
                    <StockStatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <TableEmptyRow
                  colSpan={10}
                  title="No warehouse stock items match these filters"
                  description="No SKUs in WH-BLR-01 match the selected zone, category, supplier, or search term."
                  filterChips={[
                    ...(zone !== "ALL"
                      ? [
                          {
                            id: "zone",
                            label: `Zone: ${zone}`,
                            onRemove: () => setZone("ALL"),
                          },
                        ]
                      : []),
                    ...(category !== "ALL"
                      ? [
                          {
                            id: "category",
                            label: `Category: ${category}`,
                            onRemove: () => setCategory("ALL"),
                          },
                        ]
                      : []),
                    ...(supplier !== "ALL"
                      ? [
                          {
                            id: "supplier",
                            label: `Supplier: ${supplier}`,
                            onRemove: () => setSupplier("ALL"),
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
                  ]}
                  actionLabel="Clear all filters"
                  onAction={clearFilters}
                  secondaryActionLabel={
                    zone !== "ALL" ? "Show all zones" : undefined
                  }
                  onSecondaryAction={
                    zone !== "ALL" ? () => setZone("ALL") : undefined
                  }
                />
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-text-muted">
          <span>
            1–{filtered.length} of 23 matching · 214 SKUs in WH-BLR-01
          </span>
          <div className="flex items-center gap-5">
            <span className="font-bold text-text tnum">
              Value shown ₹{totalShownValue.toLocaleString("en-IN")}
            </span>
            <button
              type="button"
              className="font-bold text-text hover:text-primary cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
