import type { Metadata } from "next";
import { CustomerAnalyticsView } from "@/components/analytics/customer-analytics-view";

export const metadata: Metadata = {
  title: "Customer Analytics · Analytics · BRUVI HQ",
  description: "Active customer growth, order frequency, LTV:CAC, and RFM segments.",
};

export default function CustomerAnalyticsPage() {
  return <CustomerAnalyticsView />;
}
