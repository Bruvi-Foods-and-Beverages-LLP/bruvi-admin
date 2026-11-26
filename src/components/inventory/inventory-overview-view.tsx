"use client";

import * as React from "react";
import Link from "next/link";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InventoryModuleHeader,
  InventoryTabBar,
} from "@/components/inventory/inventory-header-and-tabs";
import {
  COVER_MATRIX_ROWS,
  UPCOMING_DELIVERIES,
  WEEKLY_WASTE_BY_REASON,
} from "@/lib/inventory/mock-inventory-data";
import { cn } from "@/lib/utils/cn";

function CoverCellPill({ days }: { days: number | null }) {
  if (days === null) {
    return (
      <span className="inline-flex h-7 w-full min-w-[64px] items-center justify-center rounded-[6px] bg-error text-white text-[12px] font-bold tnum">
        Out
      </span>
    );
  }
  if (days < 1.2) {
    return (
      <span className="inline-flex h-7 w-full min-w-[64px] items-center justify-center rounded-[6px] bg-warning text-white text-[12px] font-bold tnum">
        {days.toFixed(1)} d
      </span>
    );
  }
  if (days < 2.0) {
    return (
      <span className="inline-flex h-7 w-full min-w-[64px] items-center justify-center rounded-[6px] bg-warning-surface text-warning text-[12px] font-bold tnum">
        {days.toFixed(1)} d
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-full min-w-[64px] items-center justify-center rounded-[6px] bg-success-surface text-success text-[12px] font-bold tnum">
      {days.toFixed(1)} d
    </span>
  );
}

export function InventoryOverviewView() {
  const [exportNotice, setExportNotice] = React.useState(false);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2600);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <InventoryModuleHeader
        overline="SUPPLY · ALL STORES · UPDATED 9:41 AM"
        title="Inventory"
        actions={
          <>
            <Button variant="workspace" size="compact" onClick={handleExport}>
              <BruviIcon name="download" size={16} className="mr-1.5" />
              <span>{exportNotice ? "Exported CSV" : "Export"}</span>
            </Button>
            <Button asChild size="compact">
              <Link href="/inventory/transfers?new=1">New transfer</Link>
            </Button>
          </>
        }
      />

      <InventoryTabBar active="overview" />

      {/* 5-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-surface-inverse border-surface-inverse text-text-inverse p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-inverse-secondary">
            Stock value · 12 stores
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-white">
            ₹14.2 L
          </span>
          <span className="text-[12px] font-medium text-text-inverse-muted tnum">
            + ₹38.6 L at WH-BLR-01
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Items below par
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-warning">
            9
          </span>
          <span className="text-[12px] font-medium text-text-muted">
            6 stores · 4 are oat milk
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Out of stock
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-error">
            1
          </span>
          <span className="text-[12px] font-semibold text-error">
            Vanilla syrup · Indiranagar
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Waste this week
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            ₹6,840
          </span>
          <span className="text-[12px] font-semibold text-success">
            1.6% of sales · target 2%
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Stock accuracy
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            97.8%
          </span>
          <span className="text-[12px] font-medium text-text-muted">
            last count · 1 Oct, 10:30 pm
          </span>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-5 items-start">
        {/* Days of cover heatmap matrix */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-sans text-[16px] leading-6 font-extrabold text-text">
                Days of cover · key ingredients
              </h2>
              <p className="font-sans text-[12px] text-text-muted">
                At current usage · sorted by risk
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-error" />
                Out
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-warning" />
                Low &lt;1.2 d
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-warning-surface border border-warning/30" />
                Watch &lt;2 d
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-success-surface border border-success/30" />
                OK
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-2.5 pr-3">Store</th>
                  <th className="py-2.5 px-1.5 text-center">Oat milk</th>
                  <th className="py-2.5 px-1.5 text-center">Vanilla</th>
                  <th className="py-2.5 px-1.5 text-center">Matcha</th>
                  <th className="py-2.5 px-1.5 text-center">Robusta</th>
                  <th className="py-2.5 px-1.5 text-center">Condensed</th>
                  <th className="py-2.5 pl-1.5 text-center">Cups</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {COVER_MATRIX_ROWS.map((row) => (
                  <tr
                    key={row.storeId}
                    className="hover:bg-background-subtle/70 transition-colors"
                  >
                    <td className="py-2 pr-3 font-sans text-[13px] font-bold text-text whitespace-nowrap">
                      <Link
                        href={`/inventory/store-stock?store=${row.storeId}`}
                        className="hover:text-primary hover:underline underline-offset-2"
                      >
                        {row.storeName}
                      </Link>
                    </td>
                    <td className="py-1.5 px-1.5">
                      <Link href="/inventory/ingredients/ing-oat-1l">
                        <CoverCellPill days={row.oatMilkDays} />
                      </Link>
                    </td>
                    <td className="py-1.5 px-1.5">
                      <CoverCellPill days={row.vanillaDays} />
                    </td>
                    <td className="py-1.5 px-1.5">
                      <CoverCellPill days={row.matchaDays} />
                    </td>
                    <td className="py-1.5 px-1.5">
                      <CoverCellPill days={row.robustaDays} />
                    </td>
                    <td className="py-1.5 px-1.5">
                      <CoverCellPill days={row.condensedDays} />
                    </td>
                    <td className="py-1.5 pl-1.5">
                      <CoverCellPill days={row.cupsDays} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
            <span className="text-text-muted">
              + 3 stores all OK · Jayanagar, MG Road, Lower Parel
            </span>
            <Link
              href="/inventory/store-stock"
              className="font-bold text-primary hover:text-primary-pressed inline-flex items-center gap-1"
            >
              <span>Store stock</span>
              <BruviIcon name="arrow-right" size={14} />
            </Link>
          </div>
        </Card>

        {/* Right Column: Upcoming deliveries + Waste by reason */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] leading-6 font-extrabold text-text">
                Upcoming deliveries
              </h2>
              <Link
                href="/inventory/transfers"
                className="text-[12px] font-bold text-primary hover:text-primary-pressed inline-flex items-center gap-1"
              >
                <span>Transfers</span>
                <BruviIcon name="arrow-right" size={14} />
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {UPCOMING_DELIVERIES.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                        item.type === "transfer"
                          ? "bg-surface-brand text-primary"
                          : "bg-warning-surface text-warning",
                      )}
                    >
                      <BruviIcon
                        name={item.type === "transfer" ? "parcel" : "warehouse"}
                        size={18}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-text truncate group-hover:text-primary">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-text-muted truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-bold text-text tnum">
                      {item.rightTop}
                    </p>
                    <p
                      className={cn(
                        "text-[11px] font-semibold",
                        item.rightBottomTone === "info"
                          ? "text-info"
                          : "text-warning",
                      )}
                    >
                      {item.rightBottom}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-sans text-[16px] leading-6 font-extrabold text-text">
                Waste by reason
              </h2>
              <span className="text-[12px] font-medium text-text-muted tnum">
                This week · ₹6,840
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              {WEEKLY_WASTE_BY_REASON.map((row) => (
                <div
                  key={row.reason}
                  className="grid grid-cols-[120px_1fr_56px] items-center gap-3"
                >
                  <span className="text-[13px] font-medium text-text-secondary truncate">
                    {row.reason}
                  </span>
                  <div className="h-2.5 w-full rounded-full bg-background-subtle overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", row.colorClass)}
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="text-right text-[13px] font-bold text-text tnum">
                    ₹{row.amountInr.toLocaleString("en-IN")}
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
