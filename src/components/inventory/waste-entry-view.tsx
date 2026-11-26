"use client";

import * as React from "react";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InventoryModuleHeader,
  InventoryTabBar,
} from "@/components/inventory/inventory-header-and-tabs";
import {
  INITIAL_WASTE_LOGS,
  INVENTORY_BRANCHES,
  WASTE_CATALOG_OPTIONS,
} from "@/lib/inventory/mock-inventory-data";
import { WasteLogEntry, WasteReason } from "@/types/inventory";
import { cn } from "@/lib/utils/cn";

const WASTE_REASONS: WasteReason[] = [
  "Spill / remake",
  "Cancelled order",
  "Expired",
  "Damaged",
  "End of day",
];

export function WasteEntryView() {
  const [logs, setLogs] = React.useState<WasteLogEntry[]>(INITIAL_WASTE_LOGS);
  const [storeId, setStoreId] = React.useState("indiranagar");
  const [catalogItemId, setCatalogItemId] = React.useState("wc-1");
  const [qty, setQty] = React.useState(1);
  const [reason, setReason] = React.useState<WasteReason>("Spill / remake");
  const [linkedOrder, setLinkedOrder] = React.useState(
    "Q-31 · Table 4 · wrong milk",
  );
  const [exportDone, setExportDone] = React.useState(false);

  const selectedStore =
    INVENTORY_BRANCHES.find((b) => b.id === storeId) ?? INVENTORY_BRANCHES[0];
  const selectedCatalogItem =
    WASTE_CATALOG_OPTIONS.find((c) => c.id === catalogItemId) ??
    WASTE_CATALOG_OPTIONS[0];
  const wasteValueInr = qty * selectedCatalogItem.unitCostInr;

  const totalTodayInr = React.useMemo(
    () => logs.reduce((acc, item) => acc + item.valueInr, 0),
    [logs],
  );

  const handleLogWaste = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: WasteLogEntry = {
      id: `w-${Date.now()}`,
      time: "Just now",
      store: selectedStore.name,
      itemTitle: `${selectedCatalogItem.label.split(" ·")[0]} ×${qty}${linkedOrder.trim() ? ` · ${linkedOrder.split(" ·")[0]}` : ""}`,
      loggedByDetail: `Kavya R. · ${linkedOrder.trim() || reason.toLowerCase()}`,
      reason,
      valueInr: wasteValueInr,
    };
    setLogs((prev) => [newEntry, ...prev]);
    setQty(1);
    setLinkedOrder("");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <InventoryModuleHeader
        breadcrumb="Inventory / Waste · Today"
        title="Waste log"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => {
                setExportDone(true);
                setTimeout(() => setExportDone(false), 2400);
              }}
            >
              <BruviIcon name="download" size={16} className="mr-1.5" />
              <span>{exportDone ? "Exported CSV" : "Export"}</span>
            </Button>
            <Button
              size="compact"
              onClick={() =>
                document.getElementById("waste-form-store")?.focus()
              }
            >
              Log waste
            </Button>
          </>
        }
      />

      <InventoryTabBar active="waste" />

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* Left: Summary Strip + Ledger Table */}
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] gap-4">
            <Card className="bg-surface-inverse border-surface-inverse text-text-inverse p-5 flex flex-col justify-between gap-2">
              <span className="text-[12px] font-medium text-text-inverse-secondary">
                Network today
              </span>
              <span className="text-price-l font-display font-extrabold text-white tnum">
                ₹{totalTodayInr.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-text-inverse-muted">
                {logs.length} entries · 0.3% of sales
              </span>
            </Card>

            <Card className="p-4 flex flex-col justify-between gap-3">
              <span className="text-[13px] font-bold text-text">By reason</span>
              <div className="h-2.5 w-full rounded-full overflow-hidden flex gap-0.5">
                <div className="bg-primary" style={{ width: "33%" }} />
                <div className="bg-accent" style={{ width: "22%" }} />
                <div className="bg-category-coffee" style={{ width: "19%" }} />
                <div className="bg-category-matcha" style={{ width: "15%" }} />
                <div className="bg-border-input" style={{ width: "11%" }} />
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-text-secondary tnum">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Damaged ₹405
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Spill/remake ₹270
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-category-coffee" />
                  Expired ₹240
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-category-matcha" />
                  Cancelled ₹190
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-border-input" />
                  End of day ₹135
                </span>
              </div>
            </Card>

            <Card className="p-4 flex flex-col justify-between gap-2.5">
              <span className="text-[13px] font-bold text-text">By store</span>
              <div className="flex flex-col gap-1.5 text-[12px] tnum">
                <div className="grid grid-cols-[84px_1fr_42px] items-center gap-2">
                  <span className="text-text-secondary truncate">Indiranagar</span>
                  <div className="h-2 rounded-full bg-background-subtle overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[82%]" />
                  </div>
                  <span className="font-bold text-text text-right">₹318</span>
                </div>
                <div className="grid grid-cols-[84px_1fr_42px] items-center gap-2">
                  <span className="text-text-secondary truncate">Bandra</span>
                  <div className="h-2 rounded-full bg-background-subtle overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[70%]" />
                  </div>
                  <span className="font-bold text-text text-right">₹270</span>
                </div>
                <div className="grid grid-cols-[84px_1fr_42px] items-center gap-2">
                  <span className="text-text-secondary truncate">Koramangala</span>
                  <div className="h-2 rounded-full bg-background-subtle overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[58%]" />
                  </div>
                  <span className="font-bold text-text text-right">₹220</span>
                </div>
              </div>
              <span className="text-[11px] text-text-muted">
                + 3 more stores · ₹432
              </span>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="py-3 pl-5 pr-2">Time</th>
                    <th className="py-3 px-2">Store</th>
                    <th className="py-3 px-2">Item · logged by</th>
                    <th className="py-3 px-2">Reason</th>
                    <th className="py-3 pl-2 pr-5 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-background-subtle/60 transition-colors"
                    >
                      <td className="py-3 pl-5 pr-2 text-[12px] font-medium text-text-muted tnum whitespace-nowrap">
                        {entry.time}
                      </td>
                      <td className="py-3 px-2 text-[13px] font-semibold text-text-secondary whitespace-nowrap">
                        {entry.store}
                      </td>
                      <td className="py-3 px-2">
                        <p className="text-[13px] font-bold text-text">
                          {entry.itemTitle}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {entry.loggedByDetail}
                        </p>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-background-subtle border border-border px-2.5 py-0.5 text-[11px] font-bold text-text-secondary">
                          {entry.reason}
                        </span>
                      </td>
                      <td className="py-3 pl-2 pr-5 text-right text-[13px] font-extrabold text-text tnum whitespace-nowrap">
                        ₹{entry.valueInr}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border flex items-center justify-between text-[13px] font-extrabold text-text bg-background-subtle/30">
              <span>Total today · 6 stores</span>
              <span className="tnum">
                ₹{totalTodayInr.toLocaleString("en-IN")}
              </span>
            </div>
          </Card>
        </div>

        {/* Right: Log Waste Form */}
        <Card className="p-5">
          <form onSubmit={handleLogWaste} className="flex flex-col gap-4">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Log waste
              </h2>
              <p className="text-[12px] text-text-muted mt-0.5">
                Deducts stock and posts to waste at cost.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="waste-form-store"
                className="text-[12px] font-bold text-text"
              >
                Store
              </label>
              <select
                id="waste-form-store"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                className="h-11 rounded-xl border border-border-input bg-white px-3.5 text-[13px] font-bold text-text focus:outline-none focus:ring-2 focus:ring-focus"
              >
                {INVENTORY_BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-[1fr_112px] gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="waste-form-item"
                  className="text-[12px] font-bold text-text"
                >
                  Item
                </label>
                <select
                  id="waste-form-item"
                  value={catalogItemId}
                  onChange={(e) => setCatalogItemId(e.target.value)}
                  className="h-11 rounded-xl border-2 border-primary bg-white px-3 text-[13px] font-bold text-text focus:outline-none"
                >
                  {WASTE_CATALOG_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-text">Qty</span>
                <div className="h-11 rounded-xl border border-border-input bg-white flex items-center justify-between px-2">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-7 w-7 rounded-lg hover:bg-background-subtle font-bold text-text cursor-pointer"
                  >
                    −
                  </button>
                  <span className="text-[14px] font-extrabold text-text tnum">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => q + 1)}
                    className="h-7 w-7 rounded-lg hover:bg-background-subtle font-bold text-text cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-bold text-text">Reason</span>
              <div className="flex flex-wrap gap-2">
                {WASTE_REASONS.map((r) => {
                  const active = reason === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={cn(
                        "h-8 px-3 rounded-full text-[12px] font-bold transition-colors cursor-pointer",
                        active
                          ? "bg-primary text-white"
                          : "bg-white border border-border text-text-secondary hover:bg-background-subtle",
                      )}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="waste-linked-order"
                className="text-[12px] font-bold text-text"
              >
                Linked order (optional)
              </label>
              <input
                id="waste-linked-order"
                type="text"
                value={linkedOrder}
                onChange={(e) => setLinkedOrder(e.target.value)}
                placeholder="Order #, table, or note"
                className="h-11 rounded-xl border border-border-input bg-white px-3.5 text-[13px] text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus"
              />
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-text-muted">
                  Waste value
                </span>
                <span className="text-[18px] font-display font-extrabold text-text tnum">
                  ₹{wasteValueInr.toLocaleString("en-IN")}
                </span>
              </div>
              <Button type="submit" size="compact">
                Log waste
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
