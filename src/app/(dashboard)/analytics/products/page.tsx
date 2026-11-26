import type { Metadata } from "next";
import { ProductAnalyticsView } from "@/components/analytics/product-analytics-view";

export const metadata: Metadata = {
  title: "Product Analytics · Analytics · BRUVI HQ",
  description: "Drink mix, add-on attach rates, modifier choices, and SKU velocity.",
};

export default function ProductAnalyticsPage() {
  return <ProductAnalyticsView />;
}
