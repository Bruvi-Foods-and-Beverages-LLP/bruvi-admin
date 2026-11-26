"use client";

import * as React from "react";
import Link from "next/link";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AnalyticsModuleHeader,
  AnalyticsTabBar,
} from "@/components/analytics/analytics-header-and-tabs";
import {
  BruviSparkline,
  StackedPercentageBar,
} from "@/components/charts/bruvi-chart-primitives";
import {
  ADDON_ATTACH_RATES,
  DRINK_MIX_TILES,
  MODIFIER_CHOICE_ROWS,
  TOP_5_TREND_PRODUCTS,
} from "@/lib/analytics/mock-analytics-data";
import { cn } from "@/lib/utils/cn";

export function ProductAnalyticsView() {
  const [notice, setNotice] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <AnalyticsModuleHeader
        overline="ANALYTICS · SEP 1–30, 2026 VS AUG"
        title="Product analytics"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => {
                setNotice("Exported Product Analytics CSV");
                setTimeout(() => setNotice(null), 2400);
              }}
            >
              Export CSV
            </Button>
            <Button asChild size="compact">
              <Link href="/catalog">Manage catalog</Link>
            </Button>
          </>
        }
      />

      <AnalyticsTabBar active="products" />

      {notice && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-2.5 text-[13px] font-bold text-info">
          {notice}
        </div>
      )}

      {/* Top Row: Drink Mix Bento + Add-on Attach Rate */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 items-stretch">
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Drink mix
              </h2>
              <p className="text-[12px] text-text-muted">
                Share of 1,38,400 drinks sold in September
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-category-coffee" />
                Vietnamese
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-category-matcha" />
                Matcha
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-matcha-500" />
                LAB
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Hero Tile */}
            <div className="col-span-2 row-span-2 rounded-2xl bg-surface-inverse text-white p-4 flex flex-col justify-between min-h-[172px]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[14px] font-extrabold">
                    {DRINK_MIX_TILES[0].name}
                  </p>
                  <p className="text-[11px] text-text-inverse-muted mt-0.5">
                    {DRINK_MIX_TILES[0].subtitle}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <BruviIcon name="coffee" size={18} />
                </div>
              </div>
              <span className="text-price-l font-display font-extrabold tnum">
                {DRINK_MIX_TILES[0].sharePct}%
              </span>
            </div>

            {/* Secondary Tiles */}
            {DRINK_MIX_TILES.slice(1).map((tile) => (
              <div
                key={tile.id}
                className={cn(
                  "rounded-2xl p-3.5 flex flex-col justify-between min-h-[82px]",
                  tile.category === "Vietnamese" && "bg-surface-warm",
                  tile.category === "Matcha" && "bg-category-matcha-surface",
                  tile.category === "LAB" && "bg-category-matcha-surface",
                  tile.category === "Other" && "bg-background-subtle",
                )}
              >
                <p className="text-[12px] font-bold text-text leading-snug">
                  {tile.name}
                </p>
                <span
                  className={cn(
                    "text-[18px] font-display font-extrabold tnum mt-2",
                    tile.category === "Vietnamese" && "text-category-coffee",
                    (tile.category === "Matcha" || tile.category === "LAB") &&
                      "text-category-matcha",
                    tile.category === "Other" && "text-text",
                  )}
                >
                  {tile.sharePct}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Add-on attach rate
            </h2>
            <p className="text-[12px] text-text-muted">
              % of drinks with the add-on · add-on revenue
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {ADDON_ATTACH_RATES.map((row) => (
              <div key={row.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 text-[13px]">
                  <span className="font-bold text-text truncate">{row.name}</span>
                  <div className="flex items-center gap-3 shrink-0 tnum">
                    <span className="text-[12px] text-text-muted">
                      {row.revenueLabel}
                    </span>
                    <span className="font-extrabold text-text w-9 text-right">
                      {row.attachPct}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-background-subtle overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(100, row.attachPct * 2.2)}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-[11px]",
                    row.noteTone === "warning" && "text-warning font-semibold",
                    row.noteTone === "error" && "text-error font-semibold",
                    row.noteTone === "muted" && "text-text-muted",
                  )}
                >
                  {row.note}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row: Modifier Choices + Top 5 Trend */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 items-start">
        <Card className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Modifier choices
            </h2>
            <p className="text-[12px] text-text-muted">
              Share of drinks by option · September
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {MODIFIER_CHOICE_ROWS.map((row) => (
              <div
                key={row.group}
                className="grid grid-cols-[72px_1fr_92px] items-center gap-3 text-[12px]"
              >
                <span className="font-semibold text-text-secondary">
                  {row.group}
                </span>
                <StackedPercentageBar heightClass="h-6" segments={row.segments} />
                <span className="text-[11px] text-text-muted text-right truncate tnum">
                  {row.trailingLabel}
                </span>
              </div>
            ))}
          </div>

          <p className="pt-2 border-t border-border text-[12px] text-text-muted">
            41% choose Large — the +₹40 upsize added ₹22.7 L in September.
          </p>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Top 5 trend
            </h2>
            <p className="text-[12px] text-text-muted">
              Units sold in Sep · weekly trend · Δ vs Aug
            </p>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {TOP_5_TREND_PRODUCTS.map((item) => (
              <div
                key={item.name}
                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-surface-warm text-category-coffee flex items-center justify-center shrink-0">
                    <BruviIcon name="coffee" size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-text truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-text-muted tnum">
                      {item.sold.toLocaleString("en-IN")} sold
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <BruviSparkline
                    points={item.weeklyPoints}
                    positive={item.deltaPct >= 0}
                  />
                  <span
                    className={cn(
                      "text-[12px] font-extrabold tnum w-11 text-right",
                      item.deltaPct >= 0 ? "text-success" : "text-error",
                    )}
                  >
                    {item.deltaPct >= 0 ? "▲" : "▼"} {Math.abs(item.deltaPct)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
