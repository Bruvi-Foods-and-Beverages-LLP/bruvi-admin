import type { Metadata } from "next";
import { SupplierDetailView } from "@/components/warehouse/supplier-detail-view";

export const metadata: Metadata = {
  title: "Supplier · Warehouse · BRUVI HQ",
  description: "Supplier scorecard, contract SKUs, recent deliveries, and compliance documents.",
};

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SupplierDetailView supplierId={id} />;
}
