"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  SIDEBAR_NAV_SECTIONS,
  DASHBOARD_ITEM,
  canAccessNavItem,
} from "@/config/sidebar-navigation";
import { NoPermissionView } from "@/components/feedback/no-permission-view";

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

  const roleSlug = (user?.role ?? "staff").toLowerCase();

  // 1. Check Store Creation route (Strictly SUPER_ADMIN or ADMIN)
  if (pathname === "/stores/new" && !hasRole(["SUPER_ADMIN", "ADMIN"])) {
    return (
      <NoPermissionView
        overline="OPERATIONS / STORES"
        pageTitle="Stores"
        resourceName="Store Creation"
        description="Creating a new outlet requires HQ Operations or Super Administrator privileges. Your current role can view and manage assigned store operations."
        errorCode="STORE-CREATE-DENIED"
        roleSlug={roleSlug}
        pathname={pathname}
        primaryReturnHref="/stores"
        primaryReturnLabel="Go to Stores"
      />
    );
  }

  // 2. Check Store Edit route
  if (
    pathname.includes("/edit") &&
    !hasRole(["SUPER_ADMIN", "ADMIN", "STORE_MANAGER"])
  ) {
    return (
      <NoPermissionView
        overline="OPERATIONS / EDIT"
        pageTitle="Restricted action"
        resourceName="this edit view"
        description="Modifying store configuration requires General Manager or HQ Administrator privileges."
        errorCode="EDIT-ACTION-DENIED"
        roleSlug={roleSlug}
        pathname={pathname}
      />
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

  if (matchedItem && !canAccessNavItem(matchedItem, hasPermission)) {
    const needed =
      matchedItem.anyCapability?.[0] ??
      matchedItem.requiredCapability ??
      "VIEW";
    const errorCode = `${needed.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}-DENIED`;
    const sectionLabel = matchedItem.category?.toUpperCase() || "WORKSPACE";

    return (
      <NoPermissionView
        overline={`${sectionLabel} / ${matchedItem.title.toUpperCase()}`}
        pageTitle={matchedItem.title}
        resourceName={matchedItem.title}
        description={
          matchedItem.title === "Finance"
            ? "Finance shows network revenue, payments, settlements and tax for all 12 stores. Your current role covers your own assigned store’s sales and shift reports."
            : `${matchedItem.title} requires the '${needed}' capability. Your current role (${roleSlug}) does not include this permission.`
        }
        errorCode={errorCode}
        roleSlug={roleSlug}
        pathname={pathname}
        primaryReturnHref="/"
        primaryReturnLabel="Go to Dashboard"
      />
    );
  }

  return <>{children}</>;
}
