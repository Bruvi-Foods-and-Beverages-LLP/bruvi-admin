import type { Metadata } from "next";
import { WarehouseTransfersView } from "@/components/warehouse/warehouse-transfers-view";

export const metadata: Metadata = {
  title: "Outbound Transfers · Warehouse · BRUVI HQ",
  description: "Warehouse pick/pack/dispatch Kanban, FEFO bin picks, and hand-off signatures.",
};

export default function WarehouseTransfersPage() {
  return <WarehouseTransfersView />;
}
