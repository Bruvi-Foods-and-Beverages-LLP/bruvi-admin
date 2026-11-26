"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export type SettingsNavId =
  | "general"
  | "brand"
  | "payment"
  | "notifications"
  | "tax"
  | "integrations"
  | "roles"
  | "audit-logs"
  | "api";

const WORKSPACE_ITEMS: Array<{ id: SettingsNavId; label: string; href: string }> = [
  { id: "general", label: "General", href: "/settings" },
  { id: "brand", label: "Brand", href: "/settings/brand" },
  { id: "payment", label: "Payment", href: "/settings/payment" },
  { id: "notifications", label: "Notifications", href: "/settings/notifications" },
  { id: "tax", label: "Tax", href: "/settings/gst" },
  { id: "integrations", label: "Integrations", href: "/settings/integrations" },
];

const SECURITY_ITEMS: Array<{ id: SettingsNavId; label: string; href: string }> = [
  { id: "roles", label: "Roles & permissions", href: "/staff/permissions" },
  { id: "audit-logs", label: "Audit logs", href: "/settings/audit-logs" },
  { id: "api", label: "API & developers", href: "/settings/api" },
];

export function SettingsShell({
  active,
  overline,
  title,
  actions,
  children,
}: {
  active: SettingsNavId;
  overline: string;
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-overline font-serif uppercase tracking-[1.54px] text-text-muted">
            {overline}
          </span>
          <h1 className="text-display-s font-display font-black text-text tracking-[-0.96px]">
            {title}
          </h1>
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Responsive Mobile Nav */}
      <nav
        aria-label="Settings sections"
        className="flex lg:hidden items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {[...WORKSPACE_ITEMS, ...SECURITY_ITEMS].map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "px-3.5 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-colors",
                isActive
                  ? "bg-white text-text shadow-raised border border-border"
                  : "text-text-muted hover:text-text hover:bg-white/60",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Desktop Left Sub-Nav + Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 items-start">
        <aside className="hidden lg:flex flex-col gap-5 sticky top-4">
          <div className="flex flex-col gap-1">
            <span className="px-3 pb-1 text-overline font-serif uppercase tracking-[1.54px] text-text-muted">
              Workspace
            </span>
            {WORKSPACE_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-xl text-[13px] transition-all flex items-center gap-2",
                    isActive
                      ? "bg-white text-text font-extrabold shadow-raised border-l-2 border-primary"
                      : "text-text-secondary font-semibold hover:bg-white/60 hover:text-text",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-1">
            <span className="px-3 pb-1 text-overline font-serif uppercase tracking-[1.54px] text-text-muted">
              Security &amp; developers
            </span>
            {SECURITY_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-xl text-[13px] transition-all flex items-center gap-2",
                    isActive
                      ? "bg-white text-text font-extrabold shadow-raised border-l-2 border-primary"
                      : "text-text-secondary font-semibold hover:bg-white/60 hover:text-text",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
