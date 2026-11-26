import type { Metadata } from "next";
import { WarehouseOverviewView } from "@/components/warehouse/warehouse-overview-view";

export const metadata: Metadata = {
  title: "Warehouse & Logistics · BRUVI HQ",
  description:
    "Central depot stock value, dock schedule, zone pallet capacity, and operational alerts.",
};

export default function WarehousePage() {
  return <WarehouseOverviewView />;
}
