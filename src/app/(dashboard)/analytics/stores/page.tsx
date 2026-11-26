import type { Metadata } from "next";
import { StoreAnalyticsView } from "@/components/analytics/store-analytics-view";

export const metadata: Metadata = {
  title: "Store Analytics · Analytics · BRUVI HQ",
  description: "12-store ranking, hourly sales velocity, and top products per store.",
};

export default function StoreAnalyticsPage() {
  return <StoreAnalyticsView />;
}
