"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { WarehouseSectionTab } from "@/types/warehouse";

interface WarehouseModuleHeaderProps {
  overline?: string;
  breadcrumb?: string;
  title: string;
  actions?: React.ReactNode;
}

export function WarehouseModuleHeader({
  overline,
  breadcrumb,
  title,
  actions,
}: WarehouseModuleHeaderProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        {overline && (
          <span className="text-overline font-serif uppercase tracking-[1.54px] text-text-muted">
            {overline}
          </span>
        )}
        {breadcrumb && (
          <span className="text-overline font-serif uppercase tracking-[1.54px] text-text-muted truncate">
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

const WAREHOUSE_TABS: Array<{
  id: WarehouseSectionTab;
  label: string;
  href: string;
}> = [
  { id: "overview", label: "Overview", href: "/warehouse" },
  { id: "stock", label: "Stock", href: "/warehouse/stock" },
  { id: "receiving", label: "Receiving", href: "/warehouse/receiving" },
  { id: "purchase-orders", label: "Purchase orders", href: "/warehouse/purchase-orders" },
  { id: "suppliers", label: "Suppliers", href: "/warehouse/suppliers/SUP-004" },
  { id: "transfers", label: "Transfers", href: "/warehouse/transfers" },
  { id: "batches", label: "Batches", href: "/warehouse/batches/OAT-2609-17" },
];

export function WarehouseTabBar({ active }: { active: WarehouseSectionTab }) {
  return (
    <nav
      aria-label="Warehouse sections"
      className="w-full flex items-end gap-6 border-b border-border overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {WAREHOUSE_TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "h-9 flex items-center justify-center pb-2 text-label whitespace-nowrap transition-all border-b-2 -mb-px font-sans",
              isActive
                ? "border-primary text-text font-bold"
                : "border-transparent text-text-muted font-semibold hover:text-text hover:border-border-input",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
