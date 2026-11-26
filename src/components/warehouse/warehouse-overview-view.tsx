"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  WarehouseModuleHeader,
  WarehouseTabBar,
} from "@/components/warehouse/warehouse-header-and-tabs";
import {
  DOCK_SCHEDULE_ROWS,
  WAREHOUSE_ALERTS,
  ZONE_CAPACITIES,
} from "@/lib/warehouse/mock-warehouse-data";
import { DockScheduleStatus } from "@/types/warehouse";
import { cn } from "@/lib/utils/cn";

function DockStatusPill({ status }: { status: DockScheduleStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap",
        status === "Received" && "bg-success-surface text-success",
        status === "Dispatched" && "bg-info-surface text-info",
        status === "Picking" && "bg-warning-surface text-warning",
        (status === "Packed" || status === "Scheduled" || status === "Expected") &&
          "bg-background-subtle text-text-secondary border border-border",
      )}
    >
      {status}
    </span>
  );
}

export function WarehouseOverviewView() {
  const [directionFilter, setDirectionFilter] = React.useState<
    "all" | "inbound" | "outbound"
  >("all");

  const filteredSchedule = React.useMemo(() => {
    if (directionFilter === "all") return DOCK_SCHEDULE_ROWS;
    return DOCK_SCHEDULE_ROWS.filter((r) => r.direction === directionFilter);
  }, [directionFilter]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <WarehouseModuleHeader
        overline="WH-BLR-01 · HOSUR ROAD · UPDATED 9:41 AM"
        title="Warehouse"
        actions={
          <>
            <Button asChild variant="workspace" size="compact">
              <Link href="/warehouse/receiving">Receive goods</Link>
            </Button>
            <Button asChild size="compact">
              <Link href="/warehouse/purchase-orders/new">
                New purchase order
              </Link>
            </Button>
          </>
        }
      />

      <WarehouseTabBar active="overview" />

      {/* 6-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        <Card className="bg-surface-inverse border-surface-inverse text-text-inverse p-4 sm:col-span-2 lg:col-span-1 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-medium text-text-inverse-secondary">
            Stock value
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-white">
            ₹38.6 L
          </span>
          <span className="text-[11px] text-text-inverse-muted">
            At landed cost · 214 SKUs
          </span>
        </Card>

        <Card className="p-4 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-medium text-text-muted">
            Active SKUs
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            214
          </span>
          <span className="text-[11px] text-text-muted">
            9 below reorder point
          </span>
        </Card>

        <Card className="p-4 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-medium text-text-muted">
            Open POs
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            6
          </span>
          <span className="text-[11px] text-text-muted tnum">
            ₹6.98 L open value
          </span>
        </Card>

        <Card className="p-4 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-medium text-text-muted">
            Inbound today
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            2
          </span>
          <span className="text-[11px] text-text-muted">
            1 received · 1 due 3 pm
          </span>
        </Card>

        <Card className="p-4 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-medium text-text-muted">
            Transfers out
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            7
          </span>
          <span className="text-[11px] text-text-muted">
            1 dispatched · 6 to go
          </span>
        </Card>

        <Card className="p-4 bg-warning-surface border-warning/25 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-bold text-warning">
            Expiring ≤ 30 days
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            3
          </span>
          <span className="text-[11px] text-warning font-medium tnum">
            batches · ₹24,600 at cost
          </span>
        </Card>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* Left: Today's Dock Schedule */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Today’s dock schedule
              </h2>
              <p className="text-[12px] text-text-muted">
                2 inbound · 7 outbound · Fri 2 Oct
              </p>
            </div>

            <div className="flex items-center gap-3 text-[12px] font-semibold">
              <button
                type="button"
                onClick={() =>
                  setDirectionFilter((d) => (d === "inbound" ? "all" : "inbound"))
                }
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer",
                  directionFilter === "inbound"
                    ? "bg-category-coffee-surface text-category-coffee"
                    : "text-text-secondary hover:bg-background-subtle",
                )}
              >
                <span className="h-2 w-2 rounded-full bg-category-coffee" />
                Inbound
              </button>
              <button
                type="button"
                onClick={() =>
                  setDirectionFilter((d) =>
                    d === "outbound" ? "all" : "outbound",
                  )
                }
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer",
                  directionFilter === "outbound"
                    ? "bg-surface-brand text-primary"
                    : "text-text-secondary hover:bg-background-subtle",
                )}
              >
                <span className="h-2 w-2 rounded-full bg-primary" />
                Outbound
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[580px] border-collapse">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-2.5 pr-2">Time</th>
                  <th className="py-2.5 px-2">Ref</th>
                  <th className="py-2.5 px-2">Party · contents</th>
                  <th className="py-2.5 px-2">Dock · vehicle</th>
                  <th className="py-2.5 pl-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSchedule.map((row) => (
                  <React.Fragment key={row.id}>
                    {row.showNowMarkerBefore && directionFilter === "all" && (
                      <tr>
                        <td colSpan={5} className="py-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-error tracking-wider uppercase whitespace-nowrap tnum">
                              Now 9:41
                            </span>
                            <div className="h-px flex-1 bg-error/60" />
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-background-subtle/60 transition-colors">
                      <td className="py-3 pr-2 text-[12px] font-semibold text-text tnum whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full shrink-0",
                              row.direction === "inbound"
                                ? "bg-category-coffee"
                                : "bg-primary",
                            )}
                          />
                          {row.time}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[13px] font-extrabold text-text tnum whitespace-nowrap">
                        <Link
                          href={row.href}
                          className="hover:text-primary hover:underline underline-offset-2"
                        >
                          {row.ref}
                        </Link>
                      </td>
                      <td className="py-3 px-2">
                        <p className="text-[13px] font-bold text-text">
                          {row.partyTitle}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {row.contentsSubtitle}
                        </p>
                      </td>
                      <td className="py-3 px-2 text-[12px] text-text-secondary whitespace-nowrap">
                        {row.dockVehicle}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <DockStatusPill status={row.status} />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Column: Capacity by Zone + Alerts */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Capacity by zone
              </h2>
              <span className="text-[12px] text-text-muted">
                Pallet positions
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {ZONE_CAPACITIES.map((zone) => (
                <div key={zone.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-bold text-text">{zone.name}</span>
                    <div className="flex items-center gap-3 tnum">
                      <span className="text-[12px] text-text-muted">
                        {zone.used} / {zone.total} · {zone.tempLabel}
                      </span>
                      <span
                        className={cn(
                          "font-extrabold",
                          zone.tone === "warning"
                            ? "text-warning"
                            : "text-text",
                        )}
                      >
                        {zone.percent}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background-subtle overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        zone.tone === "warning" && "bg-warning",
                        zone.tone === "primary" && "bg-primary",
                        zone.tone === "accent" && "bg-accent",
                      )}
                      style={{ width: `${zone.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Alerts
              </h2>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error text-white px-1.5 text-[11px] font-extrabold tnum">
                {WAREHOUSE_ALERTS.length}
              </span>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {WAREHOUSE_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 rounded-full shrink-0",
                        alert.tone === "warning" ? "bg-warning" : "bg-primary",
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-text">
                        {alert.title}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {alert.subtitle}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={alert.actionHref}
                    className="text-[12px] font-bold text-primary hover:text-primary-pressed shrink-0 whitespace-nowrap"
                  >
                    {alert.actionLabel}
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
