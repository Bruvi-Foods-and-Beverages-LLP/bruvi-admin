import type { BruviIconName } from "@/components/icons";
import type { DomainCapability } from "@/types/auth";

export interface SidebarNavItem {
  title: string;
  href: string;
  iconName: BruviIconName;
  requiredCapability?: DomainCapability;
  /** Visible when the user holds any one of these (used instead of requiredCapability). */
  anyCapability?: DomainCapability[];
  /** Live dot next to the title, fed by a global watcher. */
  liveIndicator?: "support";
  description: string;
  category: string;
}

/** True when the user may open this item (sidebar, ⌘K and the route guard all use it). */
export function canAccessNavItem(
  item: SidebarNavItem,
  hasPermission: (permission: string) => boolean,
): boolean {
  if (item.anyCapability) return item.anyCapability.some((capability) => hasPermission(capability));
  return !item.requiredCapability || hasPermission(item.requiredCapability);
}

/** Customers tabs that need more than access to the module itself. */
export const CUSTOMER_TAB_CAPABILITY = {
  customers: "staff:view",
  wallet: "staff:view",
  segments: "staff:view",
  support: "orders:view",
} as const satisfies Record<string, DomainCapability>;

export interface SidebarNavSection {
  title: string; // e.g. "Operations", "Menu", "Supply", "Growth", "Business"
  items: SidebarNavItem[];
}

/**
 * Top Standalone Dashboard Item (Precedes Sections in Figma Node 225:193303)
 */
export const DASHBOARD_ITEM: SidebarNavItem = {
  title: "Dashboard",
  href: "/",
  iconName: "layout",
  description: "Unified corporate cockpit with live store telemetry, revenue metrics, and operational alerts.",
  category: "Overview",
};

/**
 * 5 Standard HQ Navigation Sections matching Figma Node 225:193303
 */
export const SIDEBAR_NAV_SECTIONS: SidebarNavSection[] = [
  {
    title: "Operations",
    items: [
      {
        title: "Orders",
        href: "/orders",
        iconName: "receipt",
        requiredCapability: "orders:view",
        description: "Real-time omnichannel order stream across Counter POS, Kiosk, App, and QR Dine-in.",
        category: "Operations",
      },
      {
        title: "Stores",
        href: "/stores",
        iconName: "store",
        requiredCapability: "menu:view",
        description: "Network telemetry for all 12 outlets, bar layout blueprints, and device heartbeats.",
        category: "Operations",
      },
    ],
  },
  {
    title: "Menu",
    items: [
      {
        title: "Catalog",
        href: "/catalog",
        iconName: "coffee",
        requiredCapability: "menu:view",
        description: "Master beverage and food item catalog with multi-outlet pricing, variants, and 86 rules.",
        category: "Menu",
      },
      {
        title: "Recipes",
        href: "/recipes",
        iconName: "file",
        requiredCapability: "recipes:view",
        description: "Standard Operating Procedures (SOP), bill of materials (BOM), and barista prep steps.",
        category: "Menu",
      },
    ],
  },
  {
    title: "Supply",
    items: [
      {
        title: "Inventory",
        href: "/inventory",
        iconName: "parcel",
        requiredCapability: "inventory:count",
        description: "Store-level stock counts, reorder thresholds, bean batches, and milk depletion rates.",
        category: "Supply",
      },
      {
        title: "Warehouse",
        href: "/warehouse",
        iconName: "warehouse",
        requiredCapability: "warehouse:grn",
        description: "Central roastery depot logistics, Goods Received Notes (GRN), and transfer orders.",
        category: "Supply",
      },
    ],
  },
  {
    title: "Growth",
    items: [
      {
        title: "Customers",
        href: "/customers",
        iconName: "users",
        anyCapability: ["staff:view", "orders:view"],
        liveIndicator: "support",
        description: "Customer profiles, wallet, segments, and the support inbox with live chat.",
        category: "Growth",
      },
      {
        title: "Marketing",
        href: "/marketing",
        iconName: "volume",
        description: "Promotional campaigns, push notification dispatch, seasonal menus, and coupon codes.",
        category: "Growth",
      },
      {
        title: "BRUVI LAB",
        href: "/lab",
        iconName: "flask",
        description: "Experimental coffee roasting logs, brew ratio R&D, and sensory tasting evaluations.",
        category: "Growth",
      },
      {
        title: "Loyalty",
        href: "/loyalty",
        iconName: "star",
        description: "Tiered rewards program rules, stamp card redemption, and member points engine.",
        category: "Growth",
      },
      {
        title: "Subscriptions",
        href: "/subscriptions",
        iconName: "refresh",
        description: "Recurring whole-bean roast shipments, corporate office subscriptions, and renewals.",
        category: "Growth",
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        title: "Finance",
        href: "/finance",
        iconName: "card",
        requiredCapability: "finance:view_reports",
        description: "Daily register reconciliation, payment gateway settlements, taxes, and margins.",
        category: "Business",
      },
      {
        title: "Analytics",
        href: "/analytics",
        iconName: "chart",
        description: "Executive business intelligence, hourly sales velocity, peak hour heatmaps, and churn.",
        category: "Business",
      },
      {
        title: "Staff",
        href: "/staff",
        iconName: "profile",
        requiredCapability: "staff:view",
        description: "Multi-store barista roster, biometric shift logs, station assignments, and certifications.",
        category: "Business",
      },
      {
        title: "Settings",
        href: "/settings",
        iconName: "sun",
        requiredCapability: "system:settings",
        description: "Global corporate configuration, tax rules, hardware peripherals, and security policies.",
        category: "Business",
      },
    ],
  },
];

