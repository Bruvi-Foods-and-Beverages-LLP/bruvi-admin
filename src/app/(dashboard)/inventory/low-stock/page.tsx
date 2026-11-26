import type { Metadata } from "next";
import { LowStockView } from "@/components/inventory/low-stock-view";

export const metadata: Metadata = {
  title: "Low Stock Alerts · Inventory · BRUVI HQ",
  description: "Out-of-stock & below-reorder alerts, menu impact, and auto-reorder rules.",
};

export default function LowStockPage() {
  return <LowStockView />;
}
