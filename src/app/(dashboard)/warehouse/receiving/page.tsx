import type { Metadata } from "next";
import { GoodsReceiptView } from "@/components/warehouse/goods-receipt-view";

export const metadata: Metadata = {
  title: "Goods Receipt · Warehouse · BRUVI HQ",
  description: "GRN intake, cold-chain QC inspection, and 3-way invoice matching.",
};

export default function WarehouseReceivingPage() {
  return <GoodsReceiptView />;
}
