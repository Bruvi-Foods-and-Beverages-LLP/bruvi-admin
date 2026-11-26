import type { Metadata } from "next";
import { StockAdjustmentView } from "@/components/inventory/stock-adjustment-view";

export const metadata: Metadata = {
  title: "Adjust Stock · Inventory · BRUVI HQ",
  description: "Immediate store stock adjustment with cost impact and audit trail.",
};

export default async function StockAdjustmentPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string; item?: string }>;
}) {
  const { store, item } = await searchParams;
  return (
    <StockAdjustmentView
      initialStoreId={store || "indiranagar"}
      initialItemId={item || "ing-oat-1l"}
    />
  );
}
