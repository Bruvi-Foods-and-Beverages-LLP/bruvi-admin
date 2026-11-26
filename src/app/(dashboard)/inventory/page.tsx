import type { Metadata } from "next";
import { InventoryOverviewView } from "@/components/inventory/inventory-overview-view";

export const metadata: Metadata = {
  title: "Inventory · BRUVI HQ",
  description:
    "Network-wide store stock health, days of cover, upcoming deliveries, and weekly waste.",
};

export default function InventoryPage() {
  return <InventoryOverviewView />;
}
