import type { Metadata } from "next";
import { PlanDetail } from "@/components/subscriptions/plan-detail";

export const metadata: Metadata = { title: "Plan · Subscriptions · BRUVI HQ" };

/** Figma A112 Plan detail. */
export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanDetail planId={id} />;
}
