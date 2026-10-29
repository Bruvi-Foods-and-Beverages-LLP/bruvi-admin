import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics & BI · BRUVI HQ",
  description: "Executive business intelligence, hourly sales velocity, and peak heatmaps.",
};

export default function AnalyticsPage() {
  return (
    <ComingSoonModule
      title="Analytics & BI"
      category="Business"
      iconName="chart"
      description="Deep operational and financial business intelligence: hourly transactions per labor hour (SPLH), milk-to-coffee cost ratios, drink make times, and heatmaps."
      features={[
        "Hourly sales velocity & barista productivity telemetry",
        "Beverage mix distribution (Phin vs Espresso vs Cold Foam vs Food)",
        "Peak rush hour footfall analysis and staffing recommendations",
        "Live gross margin contribution per SKU across 12 outlets",
      ]}
    />
  );
}

