"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export type StaffSectionTab = "people" | "roles" | "permissions" | "shifts";

interface StaffModuleHeaderProps {
  overline: string;
  title: string;
  actions?: React.ReactNode;
}

export function StaffModuleHeader({
  overline,
  title,
  actions,
}: StaffModuleHeaderProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-sans text-[12px] leading-4 font-medium text-text-muted">
          {overline}
        </span>
        <h1 className="text-display-s font-display font-black text-text tracking-[-0.96px]">
          {title}
        </h1>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}

const STAFF_TABS: Array<{ id: StaffSectionTab; label: string; href: string }> = [
  { id: "people", label: "People", href: "/staff" },
  { id: "roles", label: "Roles", href: "/staff/roles" },
  { id: "permissions", label: "Permissions", href: "/staff/permissions" },
  { id: "shifts", label: "Shifts", href: "/staff/shifts" },
];

export function StaffTabBar({ active }: { active: StaffSectionTab }) {
  return (
    <nav
      aria-label="Staff sections"
      className="w-full flex items-end gap-6 border-b border-border overflow-x-auto overflow-y-hidden no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {STAFF_TABS.map((tab) => {
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
