"use client";

import * as React from "react";
import Link from "next/link";
import { BruviIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InventoryModuleHeader,
  InventoryTabBar,
} from "@/components/inventory/inventory-header-and-tabs";
import { OAT_MILK_DETAIL } from "@/lib/inventory/mock-inventory-data";
import { cn } from "@/lib/utils/cn";

export function IngredientDetailView({ ingredientId }: { ingredientId: string }) {
  // Currently uses OAT_MILK_DETAIL as the primary reference dataset;
  // dynamic lookup by ingredientId can be wired directly to the API.
  const detail = OAT_MILK_DETAIL;
  const maxUsage = Math.max(...detail.usage14d.map((d) => d.units), 1);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <InventoryModuleHeader
        breadcrumb={`Inventory / Ingredients / ${detail.sku}`}
        title={detail.name}
        actions={
          <>
            <Button asChild variant="workspace" size="compact">
              <Link href={`/inventory/adjust?item=${ingredientId}`}>Edit item</Link>
            </Button>
            <Button asChild size="compact">
              <Link href={`/inventory/transfers?new=1&item=${ingredientId}`}>
                Create transfer
              </Link>
            </Button>
          </>
        }
      />

      <InventoryTabBar active="overview" />

      {/* Top Summary Strip */}
      <Card className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex flex-wrap items-center gap-6 sm:gap-10">
          <div className="h-12 w-12 rounded-xl bg-surface-brand text-primary flex items-center justify-center shrink-0">
            <BruviIcon name="parcel" size={22} />
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-medium text-text-muted">
              Stores on hand
            </span>
            <span className="text-price-m font-display font-extrabold text-text tnum">
              {detail.storesOnHandLabel}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-medium text-text-muted">
              Warehouse {detail.warehouseCode}
            </span>
            <span className="text-price-m font-display font-extrabold text-text tnum">
              {detail.warehouseOnHand}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-medium text-text-muted">
              Use / day (7-day avg)
            </span>
            <span className="text-price-m font-display font-extrabold text-text tnum">
              {detail.usePerDay7d}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-medium text-text-muted">
              Store cover
            </span>
            <span className="text-price-m font-display font-extrabold text-warning tnum">
              {detail.storeCoverLabel}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-medium text-text-muted">
              Stores below par
            </span>
            <span className="text-price-m font-display font-extrabold text-text tnum">
              {detail.storesBelowParLabel}
            </span>
          </div>
        </div>

        <Badge variant="warning" className="self-start lg:self-center px-3 py-1">
          {detail.demandAlertLabel}
        </Badge>
      </Card>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 items-start">
        {/* Left: Charts */}
        <div className="flex flex-col gap-5">
          {/* Network Stock by Store */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Network stock by store
              </h2>
              <span className="text-[12px] text-text-muted">
                Cartons on hand / par · bar = % of par
              </span>
            </div>

            <div className="w-full overflow-x-auto pb-1">
              <div className="grid grid-cols-12 gap-2.5 min-w-[560px] items-end pt-2">
                {detail.storeLevels.map((st) => {
                  const pct = Math.min(Math.round((st.onHand / st.par) * 100), 100);
                  return (
                    <div
                      key={st.storeCode}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="w-full h-32 rounded-lg bg-background-subtle flex items-end overflow-hidden">
                        <div
                          className={cn(
                            "w-full rounded-t-md transition-all",
                            st.isBelowPar ? "bg-warning" : "bg-primary",
                          )}
                          style={{ height: `${pct}%` }}
                          title={`${st.storeName}: ${st.onHand}/${st.par}`}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-[11px] font-extrabold tnum",
                          st.isBelowPar ? "text-warning" : "text-text",
                        )}
                      >
                        {st.onHand}/{st.par}
                      </span>
                      <span className="text-[11px] font-semibold text-text-muted">
                        {st.storeCode}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Usage Last 14 Days */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Usage · last 14 days
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-[12px] font-semibold text-text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Normal
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  Oat swap promo (from 27 Sep)
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto pb-1">
              <div className="grid grid-cols-14 gap-2 min-w-[560px] items-end pt-2">
                {detail.usage14d.map((day) => {
                  const pct = Math.round((day.units / maxUsage) * 100);
                  return (
                    <div
                      key={day.dayLabel}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="w-full h-36 flex items-end">
                        <div
                          className={cn(
                            "w-full rounded-t-md transition-all",
                            day.isPromo ? "bg-accent" : "bg-primary",
                          )}
                          style={{ height: `${pct}%` }}
                          title={`${day.dayLabel}: ${day.units} cartons`}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-[11px] tnum",
                          day.dayLabel === "1 Oct"
                            ? "font-extrabold text-text"
                            : "font-medium text-text-muted",
                        )}
                      >
                        {day.dayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Supply & Reorder, FEFO Batches, Used in */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Supply &amp; reorder
              </h2>
              <Link
                href="/inventory/low-stock"
                className="text-[12px] font-bold text-primary hover:text-primary-pressed"
              >
                Edit rules
              </Link>
            </div>
            <div className="flex flex-col gap-2.5 text-[13px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">Supplier</span>
                <span className="font-bold text-text text-right tnum">
                  {detail.supplierLabel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">Lead time · MOQ</span>
                <span className="font-bold text-text text-right tnum">
                  {detail.leadTimeMoqLabel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">Store rule</span>
                <span className="font-bold text-text text-right tnum">
                  {detail.storeRuleLabel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">Warehouse rule</span>
                <span className="font-bold text-text text-right tnum">
                  {detail.warehouseRuleLabel}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Batches · {detail.warehouseCode}
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                FEFO
              </span>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {detail.batches.map((b) => (
                <div
                  key={b.batchCode}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-text truncate">
                      {b.batchCode}
                    </p>
                    <p className="text-[12px] text-text-muted truncate">
                      {b.meta}
                    </p>
                  </div>
                  <span className="text-[13px] font-extrabold text-text tnum shrink-0">
                    {b.qtyLabel}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3.5">
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Used in
            </h2>
            <div className="flex flex-col gap-3">
              {detail.usedIn.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-background-subtle transition-colors"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                      link.tone === "coffee"
                        ? "bg-category-coffee-surface text-category-coffee"
                        : "bg-category-matcha-surface text-category-matcha",
                    )}
                  >
                    <BruviIcon
                      name={link.tone === "coffee" ? "coffee" : "leaf"}
                      size={18}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-text truncate">
                      {link.title}
                    </p>
                    <p className="text-[12px] text-text-muted truncate">
                      {link.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
