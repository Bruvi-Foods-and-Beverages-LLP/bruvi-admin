import type { Metadata } from "next";
import { PlanEditorPage } from "@/components/subscriptions/plan-editor-page";

export const metadata: Metadata = { title: "Edit plan · Subscriptions · BRUVI HQ" };

/** Figma A111 in edit mode. */
export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanEditorPage planId={id} />;
}
