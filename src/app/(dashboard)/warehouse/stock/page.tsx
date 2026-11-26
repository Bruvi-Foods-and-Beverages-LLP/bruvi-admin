import type { Metadata } from "next";
import { WarehouseStockView } from "@/components/warehouse/warehouse-stock-view";

export const metadata: Metadata = {
  title: "Stock on Hand · Warehouse · BRUVI HQ",
  description: "Bin-level warehouse inventory, reserved stock, and expiry tracking.",
};

export default function WarehouseStockPage() {
  return <WarehouseStockView />;
}
