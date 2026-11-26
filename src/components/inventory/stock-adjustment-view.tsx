"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InventoryModuleHeader,
  InventoryTabBar,
} from "@/components/inventory/inventory-header-and-tabs";
import {
  INDIRANAGAR_STOCK_ITEMS,
  INVENTORY_BRANCHES,
  RECENT_ADJUSTMENTS,
} from "@/lib/inventory/mock-inventory-data";
import { AdjustmentReason, RecentAdjustmentItem } from "@/types/inventory";
import { cn } from "@/lib/utils/cn";

const REASONS: AdjustmentReason[] = [
  "Damaged / leaking",
  "Count correction",
  "Expired",
  "Theft / loss",
];

export function StockAdjustmentView({
  initialStoreId = "indiranagar",
  initialItemId = "ing-oat-1l",
}: {
  initialStoreId?: string;
  initialItemId?: string;
}) {
  const router = useRouter();
  const branch =
    INVENTORY_BRANCHES.find((b) => b.id === initialStoreId) ??
    INVENTORY_BRANCHES[0];

  const [selectedItemId, setSelectedItemId] = React.useState(initialItemId);
  const selectedItem =
    INDIRANAGAR_STOCK_ITEMS.find((i) => i.id === selectedItemId) ??
    INDIRANAGAR_STOCK_ITEMS[1];

  const [newCount, setNewCount] = React.useState<string>("1");
  const [reason, setReason] =
    React.useState<AdjustmentReason>("Damaged / leaking");
  const [note, setNote] = React.useState(
    "1 carton split at the seam in the bar chiller — found at opening, contents discarded.",
  );
  const [photos, setPhotos] = React.useState<string[]>(["IMG_0912"]);
  const [history, setHistory] =
    React.useState<RecentAdjustmentItem[]>(RECENT_ADJUSTMENTS);
  const [savedBanner, setSavedBanner] = React.useState<string | null>(null);

  const parsedNewCount = Number.isNaN(parseFloat(newCount))
    ? selectedItem.onHand
    : parseFloat(newCount);
  const delta = Number((parsedNewCount - selectedItem.onHand).toFixed(2));
  const valueDeltaInr = Math.round(delta * selectedItem.unitCostInr);
  const newCover =
    selectedItem.usePerDay > 0
      ? Math.max(0, parsedNewCount / selectedItem.usePerDay)
      : 0;
  const requiresNote =
    reason === "Damaged / leaking" || reason === "Theft / loss";
  const needsApproval = Math.abs(valueDeltaInr) >= 500;
  const isDirty = delta !== 0;

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    const nextItem =
      INDIRANAGAR_STOCK_ITEMS.find((i) => i.id === id) ?? selectedItem;
    setNewCount(String(Math.max(0, nextItem.onHand - 1)));
    setSavedBanner(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresNote && !note.trim()) return;
    const sign = delta > 0 ? "+" : "";
    setHistory((prev) => [
      {
        id: `adj-${Date.now()}`,
        title: `${selectedItem.name} ${sign}${delta} ${selectedItem.unit}`,
        meta: `Just now · ${reason.split(" /")[0]} · Kavya R.`,
        valueDeltaInr,
      },
      ...prev,
    ]);
    setSavedBanner(
      `Saved ${selectedItem.name} (${sign}${delta} ${selectedItem.unit}) · ₹${Math.abs(valueDeltaInr)}`,
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <InventoryModuleHeader
        breadcrumb={`Inventory / Store stock / ${branch.name}`}
        title="Adjust stock"
        actions={
          <>
            <Button asChild variant="workspace" size="compact">
              <Link href="/inventory/store-stock">View history</Link>
            </Button>
            <Button
              size="compact"
              onClick={() => {
                setNewCount(String(selectedItem.onHand));
                setNote("");
                setSavedBanner(null);
              }}
            >
              New adjustment
            </Button>
          </>
        }
      />

      <InventoryTabBar active="store-stock" />

      {savedBanner && (
        <div className="rounded-xl border border-success/30 bg-success-surface px-4 py-3 text-[13px] font-bold text-success flex items-center justify-between">
          <span>{savedBanner}</span>
          <Link
            href="/inventory/store-stock"
            className="underline underline-offset-2"
          >
            Back to Store stock
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_1fr] gap-5 items-start">
        {/* Left: Adjustment Form */}
        <Card className="p-6">
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                {branch.name} · {branch.code}
              </h2>
              <p className="text-[13px] text-text-muted mt-0.5">
                Adjustments update on-hand stock immediately and are logged
                against your name.
              </p>
            </div>

            {/* Item Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-text">Item</label>
              <div className="relative">
                <select
                  value={selectedItem.id}
                  onChange={(e) => handleSelectItem(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border-input bg-white px-4 text-[14px] font-bold text-text focus:outline-none focus:ring-2 focus:ring-focus cursor-pointer"
                >
                  {INDIRANAGAR_STOCK_ITEMS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} · {item.brandSpec} ({item.sku})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3-Up Numeric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-text">
                  Current on hand
                </span>
                <div className="h-12 px-3.5 rounded-xl bg-background-subtle border border-border flex items-center justify-between">
                  <span className="text-[16px] font-extrabold text-text tnum">
                    {selectedItem.onHand}
                  </span>
                  <span className="text-[12px] font-medium text-text-muted">
                    {selectedItem.unit}s
                  </span>
                </div>
                <span className="text-[11px] text-text-muted">
                  Counted {selectedItem.countedAt.toLowerCase()} by Arjun S.
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="new-count-input"
                  className="text-[12px] font-bold text-text"
                >
                  New count
                </label>
                <div className="h-12 px-3.5 rounded-xl bg-white border-2 border-primary flex items-center justify-between focus-within:ring-2 focus-within:ring-focus-halo">
                  <input
                    id="new-count-input"
                    type="number"
                    min={0}
                    step={selectedItem.wholeUnitsOnly ? 1 : 0.1}
                    value={newCount}
                    onChange={(e) => setNewCount(e.target.value)}
                    className="w-full bg-transparent text-[16px] font-extrabold text-text tnum focus:outline-none"
                  />
                  <span className="text-[12px] font-medium text-text-muted shrink-0 ml-2">
                    {selectedItem.unit}s
                  </span>
                </div>
                <span className="text-[11px] text-text-muted">
                  {selectedItem.wholeUnitsOnly
                    ? `Whole ${selectedItem.unit}s only`
                    : `Decimals allowed (${selectedItem.unit})`}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-text">Change</span>
                <div
                  className={cn(
                    "h-12 px-3.5 rounded-xl flex items-center justify-center text-[14px] font-extrabold tnum",
                    delta < 0
                      ? "bg-error-surface text-error"
                      : delta > 0
                        ? "bg-success-surface text-success"
                        : "bg-background-subtle text-text-muted",
                  )}
                >
                  {delta === 0
                    ? "No change"
                    : `${delta > 0 ? "+" : "−"}${Math.abs(delta)} ${selectedItem.unit} · ${valueDeltaInr < 0 ? "−" : "+"}₹${Math.abs(valueDeltaInr).toLocaleString("en-IN")}`}
                </div>
                <span className="text-[11px] text-text-muted tnum">
                  At cost ₹{selectedItem.unitCostInr} / {selectedItem.unit}
                </span>
              </div>
            </div>

            {/* Reason Radio Pills */}
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-bold text-text">Reason</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {REASONS.map((r) => {
                  const active = reason === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={cn(
                        "h-10 px-3 rounded-xl border text-[12px] font-bold flex items-center gap-2 transition-all cursor-pointer",
                        active
                          ? "border-primary border-2 bg-white text-text"
                          : "border-border bg-white text-text-secondary hover:bg-background-subtle",
                      )}
                    >
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                          active
                            ? "border-primary bg-primary"
                            : "border-border-input",
                        )}
                      >
                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </span>
                      <span className="truncate">{r}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note & Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="adjustment-note"
                  className="text-[13px] font-bold text-text"
                >
                  Note
                </label>
                <textarea
                  id="adjustment-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required={requiresNote}
                  placeholder="Describe what happened..."
                  className="w-full rounded-xl border border-border-input bg-white p-3 text-[13px] text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus"
                />
                <span className="text-[11px] text-text-muted">
                  Required for Damaged and Theft / loss
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] font-bold text-text">Photo</span>
                <div className="flex items-center gap-2">
                  {photos.slice(0, 1).map((p) => (
                    <div
                      key={p}
                      className="h-[74px] w-16 rounded-xl bg-surface-warm border border-border flex flex-col items-center justify-end p-1.5"
                    >
                      <span className="text-[10px] font-bold text-text truncate w-full text-center">
                        {p}
                      </span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setPhotos((prev) => [...prev, `IMG_09${12 + prev.length}`])
                    }
                    className="h-[74px] w-16 rounded-xl border border-dashed border-border-input bg-white hover:bg-background-subtle flex flex-col items-center justify-center gap-0.5 text-[12px] font-bold text-text-muted cursor-pointer"
                  >
                    <span className="text-[16px] leading-none">+</span>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[12px] font-medium text-text-muted">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isDirty ? "bg-warning" : "bg-success",
                  )}
                />
                {isDirty ? "Unsaved changes" : "No pending delta"}
              </span>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <Button
                  type="button"
                  variant="workspace"
                  size="compact"
                  onClick={() => router.push("/inventory/store-stock")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="compact"
                  disabled={!isDirty || (requiresNote && !note.trim())}
                >
                  Save adjustment · {valueDeltaInr < 0 ? "−" : "+"}₹
                  {Math.abs(valueDeltaInr).toLocaleString("en-IN")}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Right: Impact & Recent Adjustments */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-4">
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Impact
            </h2>
            <div>
              <span
                className={cn(
                  "text-price-l font-display font-extrabold tnum",
                  valueDeltaInr < 0 ? "text-error" : "text-success",
                )}
              >
                {valueDeltaInr < 0 ? "−" : "+"}₹
                {Math.abs(valueDeltaInr).toLocaleString("en-IN")}
              </span>
              <span className="ml-2 text-[13px] font-medium text-text-muted">
                stock value
              </span>
            </div>

            <div className="flex flex-col gap-2 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">On hand</span>
                <span className="font-bold text-text tnum">
                  {selectedItem.onHand} → {parsedNewCount} {selectedItem.unit}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Days of cover</span>
                <span className="font-bold text-error tnum">
                  {selectedItem.coverDays.toFixed(1)} → {newCover.toFixed(1)} d
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Logged as</span>
                <span className="font-bold text-text">
                  Waste · {reason.split(" /")[0]}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "rounded-xl px-3.5 py-2.5 text-[12px] font-bold flex items-center gap-2",
                needsApproval
                  ? "bg-warning-surface text-warning"
                  : "bg-success-surface text-success",
              )}
            >
              <BruviIcon name={needsApproval ? "alert" : "check"} size={15} />
              <span>
                {needsApproval
                  ? "Manager approval needed · ≥ ₹500"
                  : "No approval needed · under ₹500"}
              </span>
            </div>

            <div className="rounded-xl bg-info-surface text-info px-3.5 py-2.5 text-[12px] font-bold flex items-center gap-2">
              <BruviIcon name="parcel" size={15} />
              <span>TR-0882 brings 12 cartons · ETA 1:45 pm</span>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Recent adjustments
              </h2>
              <Link
                href="/inventory/store-stock"
                className="text-[12px] font-bold text-primary hover:text-primary-pressed"
              >
                All →
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {history.slice(0, 4).map((adj) => (
                <div
                  key={adj.id}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-text truncate">
                      {adj.title}
                    </p>
                    <p className="text-[11px] text-text-muted truncate">
                      {adj.meta}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[13px] font-extrabold tnum shrink-0",
                      adj.valueDeltaInr < 0 ? "text-error" : "text-success",
                    )}
                  >
                    {adj.valueDeltaInr < 0 ? "−" : "+"}₹
                    {Math.abs(adj.valueDeltaInr)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
