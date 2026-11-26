import type { Metadata } from "next";
import { PurchaseOrdersView } from "@/components/warehouse/purchase-orders-view";

export const metadata: Metadata = {
  title: "Purchase Orders · Warehouse · BRUVI HQ",
  description: "Supplier purchase orders, approval status, and receiving progress.",
};

export default function WarehousePurchaseOrdersPage() {
  return <PurchaseOrdersView />;
}
