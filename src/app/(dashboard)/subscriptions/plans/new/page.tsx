import type { Metadata } from "next";
import { PlanEditorPage } from "@/components/subscriptions/plan-editor-page";

export const metadata: Metadata = { title: "Create plan · Subscriptions · BRUVI HQ" };

/** Figma A111 Create plan. */
export default function NewPlanPage() {
  return <PlanEditorPage />;
}
