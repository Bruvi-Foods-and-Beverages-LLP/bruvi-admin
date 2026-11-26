import type { Metadata } from "next";
import { BatchDetailView } from "@/components/warehouse/batch-detail-view";

export const metadata: Metadata = {
  title: "Batch Detail · Warehouse · BRUVI HQ",
  description: "Lot traceability, cold-chain temperature log, QC certificate, and recall readiness.",
};

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BatchDetailView batchId={id} />;
}
