import type { Metadata } from "next";
import { TransferStockView } from "@/components/inventory/transfer-stock-view";

export const metadata: Metadata = {
  title: "Transfers · Inventory · BRUVI HQ",
  description: "FEFO stock transfers, cold-chain transit, and driver telemetry.",
};

export default async function TransferStockPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <TransferStockView initialTransferId={id || "TR-0882"} />;
}
