import type { Metadata } from "next";
import { StoreStockView } from "@/components/inventory/store-stock-view";

export const metadata: Metadata = {
  title: "Store Stock · Inventory · BRUVI HQ",
  description: "Store-level ingredient balances, par levels, and days of cover.",
};

export default async function StoreStockPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store } = await searchParams;
  return <StoreStockView initialStoreId={store || "indiranagar"} />;
}
