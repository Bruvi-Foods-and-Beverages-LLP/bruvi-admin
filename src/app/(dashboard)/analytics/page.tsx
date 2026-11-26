import type { Metadata } from "next";
import { BusinessAnalyticsView } from "@/components/analytics/business-analytics-view";

export const metadata: Metadata = {
  title: "Business Analytics · BRUVI HQ",
  description:
    "Daily net sales comparison, channel mix, and operational insights across 12 stores.",
};

export default function AnalyticsPage() {
  return <BusinessAnalyticsView />;
}
