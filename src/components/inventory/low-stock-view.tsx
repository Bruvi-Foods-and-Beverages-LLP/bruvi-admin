"use client";

import * as React from "react";
import Link from "next/link";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  InventoryModuleHeader,
  InventoryTabBar,
} from "@/components/inventory/inventory-header-and-tabs";
import {
  INITIAL_REORDER_RULES,
  LOW_STOCK_ALERTS,
  MENU_IMPACT_ITEMS,
} from "@/lib/inventory/mock-inventory-data";
import { AutoReorderRule } from "@/types/inventory";
import { cn } from "@/lib/utils/cn";

export function LowStockView() {
  const [rules, setRules] = React.useState<AutoReorderRule[]>(
    INITIAL_REORDER_RULES,
  );
  const [appliedBanner, setAppliedBanner] = React.useState<string | null>(null);

  const outAlerts = LOW_STOCK_ALERTS.filter((a) => a.severity === "out");
  const lowAlerts = LOW_STOCK_ALERTS.filter((a) => a.severity === "low");

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <InventoryModuleHeader
        breadcrumb="Inventory / Low stock · network-wide"
        title="Low stock alerts"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() =>
                document.getElementById("auto-reorder-rules")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Reorder rules
            </Button>
            <Button
              size="compact"
              onClick={() =>
                setAppliedBanner(
                  "Created 3 warehouse/store transfers and 2 draft POs from suggestions.",
                )
              }
            >
              Apply all suggestions (5)
            </Button>
          </>
        }
      />

      <InventoryTabBar active="low-stock" lowStockCount={LOW_STOCK_ALERTS.length} />

      {appliedBanner && (
        <div className="rounded-xl border border-success/30 bg-success-surface px-4 py-3 text-[13px] font-bold text-success flex items-center justify-between gap-2">
          <span>{appliedBanner}</span>
          <button
            type="button"
            onClick={() => setAppliedBanner(null)}
            className="text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* Left: Alert Queue */}
        <Card className="overflow-hidden">
          {/* Out of stock section */}
          <div className="px-5 py-2.5 bg-error-surface/80 border-b border-error/15 flex items-center justify-between text-[11px] font-bold text-error">
            <span className="uppercase tracking-wider">
              Out of stock · {outAlerts.length}
            </span>
            <span>Menu items auto-hidden</span>
          </div>

          <div className="divide-y divide-border">
            {outAlerts.map((alert) => (
              <div
                key={alert.id}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="h-7 w-1 rounded-full bg-error shrink-0" />
                  <div>
                    <Link
                      href={`/inventory/ingredients/${alert.ingredientId}`}
                      className="text-[14px] font-bold text-text hover:text-primary"
                    >
                      {alert.ingredientName}
                    </Link>
                    <p className="text-[12px] text-text-muted">
                      {alert.storeName} · {alert.onHandLabel}
                    </p>
                  </div>
                </div>

                <span className="text-[13px] font-extrabold text-error tnum">
                  {alert.coverLabel}
                </span>

                <span className="text-[13px] text-text-secondary flex-1">
                  {alert.recommendation}
                </span>

                <Button
                  asChild
                  variant="workspace"
                  size="sm"
                  className="shrink-0"
                >
                  <Link href={alert.actionHref}>View transfer</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Below reorder point section */}
          <div className="px-5 py-2.5 bg-warning-surface/80 border-y border-warning/15 flex items-center justify-between text-[11px] font-bold text-warning">
            <span className="uppercase tracking-wider">
              Low · below reorder point · {lowAlerts.length}
            </span>
            <span>Sorted by days of cover</span>
          </div>

          <div className="divide-y divide-border">
            {lowAlerts.map((alert) => (
              <div
                key={alert.id}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-background-subtle/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="h-7 w-1 rounded-full bg-warning shrink-0" />
                  <div>
                    <Link
                      href={`/inventory/ingredients/${alert.ingredientId}`}
                      className="text-[14px] font-bold text-text hover:text-primary"
                    >
                      {alert.ingredientName}
                    </Link>
                    <p className="text-[12px] text-text-muted">
                      {alert.storeName} · {alert.onHandLabel}
                    </p>
                  </div>
                </div>

                <span className="text-[13px] font-extrabold text-warning tnum w-12">
                  {alert.coverLabel}
                </span>

                <span className="text-[13px] text-text-secondary flex-1">
                  {alert.recommendation}
                </span>

                <Button
                  asChild
                  variant={
                    alert.actionType === "view-transfer"
                      ? "workspace"
                      : "default"
                  }
                  size="sm"
                  className="shrink-0 min-w-[126px]"
                >
                  <Link href={alert.actionHref}>
                    {alert.actionType === "view-transfer"
                      ? "View transfer"
                      : alert.actionType === "create-transfer"
                        ? "Create transfer"
                        : "Create PO"}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Menu Impact + Auto-reorder Rules */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Menu impact
              </h2>
              <span className="text-[12px] text-text-muted">
                App · kiosk · QR
              </span>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {MENU_IMPACT_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                        item.iconKind === "hidden" &&
                          "bg-error-surface text-error",
                        item.iconKind === "matcha" &&
                          "bg-category-matcha-surface text-category-matcha",
                        item.iconKind === "oat" &&
                          "bg-surface-brand text-primary",
                      )}
                    >
                      <BruviIcon
                        name={
                          item.iconKind === "hidden"
                            ? "eye-off"
                            : item.iconKind === "matcha"
                              ? "leaf"
                              : "parcel"
                        }
                        size={17}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-text truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold shrink-0",
                      item.badgeTone === "error"
                        ? "bg-error-surface text-error"
                        : "bg-warning-surface text-warning",
                    )}
                  >
                    {item.badgeLabel}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card id="auto-reorder-rules" className="p-5 flex flex-col gap-4">
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Auto-reorder rules
            </h2>
            <div className="flex flex-col gap-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-text">
                      {rule.title}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      {rule.subtitle}
                    </p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                    aria-label={rule.title}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
