"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { SIDEBAR_NAV_SECTIONS, DASHBOARD_ITEM } from "@/config/sidebar-navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, KeyRound } from "lucide-react";

export interface RouteRbacGuardProps {
  children: React.ReactNode;
}

export function RouteRbacGuard({ children }: RouteRbacGuardProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasRole = useAuthStore((s) => s.hasRole);

  // Super Admin has unrestricted access to everything
  if (user?.role === "SUPER_ADMIN") {
    return <>{children}</>;
  }

  // 1. Check Store Creation route (Strictly SUPER_ADMIN or ADMIN)
  if (pathname === "/stores/new" && !hasRole(["SUPER_ADMIN", "ADMIN"])) {
    return (
      <AccessRestrictedView reason="Store creation requires HQ Operations or Super Administrator privileges." />
    );
  }

  // 2. Check Store Edit route
  if (pathname.includes("/edit") && !hasRole(["SUPER_ADMIN", "ADMIN", "STORE_MANAGER"])) {
    return (
      <AccessRestrictedView reason="Store modifications require General Manager or HQ Administrator privileges." />
    );
  }

  // 3. Match against navigation sections
  const allNavItems = [
    DASHBOARD_ITEM,
    ...SIDEBAR_NAV_SECTIONS.flatMap((section) => section.items),
  ];

  const matchedItem = allNavItems.find((item) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  });

  if (matchedItem?.requiredCapability && !hasPermission(matchedItem.requiredCapability)) {
    return (
      <AccessRestrictedView
        capability={matchedItem.requiredCapability}
        reason={`Access to ${matchedItem.title} requires the '${matchedItem.requiredCapability}' corporate permission.`}
      />
    );
  }

  return <>{children}</>;
}

function AccessRestrictedView({
  capability,
  reason,
}: {
  capability?: string;
  reason?: string;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-md mb-6">
        <ShieldX className="h-8 w-8" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">403 · Access Restricted</h1>
      <p className="max-w-md text-xs text-text-muted mb-4">
        {reason ||
          "Your current staff role does not possess the cryptographic capabilities or permissions required to view or mutate this operational resource."}
      </p>
      <div className="rounded-lg bg-white border border-border p-4 max-w-sm w-full text-left text-xs mb-8 shadow-xs">
        <div className="flex items-center space-x-2 text-text font-semibold mb-1">
          <KeyRound className="h-4 w-4 text-brand-navy" />
          <span>Elevated Access Required</span>
        </div>
        {capability && (
          <p className="text-[11px] font-mono text-[#55647A] mb-1">
            Missing capability: <strong>{capability}</strong>
          </p>
        )}
        <p className="text-[11px] text-text-muted">
          Contact your Store General Manager or HQ Operations team to request an updated role assignment.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Return to Executive Cockpit</span>
        </Link>
      </Button>
    </div>
  );
}

