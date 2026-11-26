import type { Metadata } from "next";
import { StockCountView } from "@/components/inventory/stock-count-view";

export const metadata: Metadata = {
  title: "Stock Count · Inventory · BRUVI HQ",
  description: "Blind cycle count variance review and manager approval.",
};

export default function StockCountPage() {
  return <StockCountView />;
}
