import type { Metadata } from "next";
import { CohortAnalysisView } from "@/components/analytics/cohort-analysis-view";

export const metadata: Metadata = {
  title: "Cohort Analysis · Analytics · BRUVI HQ",
  description: "Monthly customer and revenue retention heatmap and curves.",
};

export default function CohortAnalysisPage() {
  return <CohortAnalysisView />;
}
