"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { InventorySectionTab } from "@/types/inventory";

interface InventoryModuleHeaderProps {
  overline?: string;
  breadcrumb?: string;
  title: string;
  actions?: React.ReactNode;
}

export function InventoryModuleHeader({
  overline,
  breadcrumb,
  title,
  actions,
}: InventoryModuleHeaderProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        {overline && (
          <span className="text-overline font-serif uppercase tracking-[1.54px] text-text-muted">
            {overline}
          </span>
        )}
        {breadcrumb && (
          <span className="font-sans text-[12px] leading-4 font-medium text-text-muted truncate">
            {breadcrumb}
          </span>
        )}
        <h1 className="text-display-s font-display font-black text-text tracking-[-0.96px] truncate">
          {title}
        </h1>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

const INVENTORY_TABS: Array<{
  id: InventorySectionTab;
  label: string;
  href: string;
  badgeCount?: number;
}> = [
  { id: "overview", label: "Overview", href: "/inventory" },
  { id: "store-stock", label: "Store stock", href: "/inventory/store-stock" },
  { id: "counts", label: "Counts", href: "/inventory/counts" },
  { id: "waste", label: "Waste", href: "/inventory/waste" },
  { id: "transfers", label: "Transfers", href: "/inventory/transfers" },
  { id: "low-stock", label: "Low stock", href: "/inventory/low-stock", badgeCount: 10 },
];

export function InventoryTabBar({
  active,
  lowStockCount = 10,
}: {
  active: InventorySectionTab;
  lowStockCount?: number;
}) {
  return (
    <nav
      aria-label="Inventory sections"
      className="w-full flex items-end gap-6 border-b border-border overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {INVENTORY_TABS.map((tab) => {
        const isActive = active === tab.id;
        const count = tab.id === "low-stock" ? lowStockCount : tab.badgeCount;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "h-9 flex items-center justify-center gap-1.5 pb-2 text-label whitespace-nowrap transition-all border-b-2 -mb-px font-sans",
              isActive
                ? "border-primary text-text font-bold"
                : "border-transparent text-text-muted font-semibold hover:text-text hover:border-border-input",
            )}
          >
            <span>{tab.label}</span>
            {typeof count === "number" && (
              <span className="inline-flex items-center justify-center rounded-full bg-error-surface text-error px-1.5 py-0.5 text-[11px] leading-none font-bold tnum">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
