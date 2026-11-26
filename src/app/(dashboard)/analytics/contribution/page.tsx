import type { Metadata } from "next";
import { ProductContributionView } from "@/components/analytics/product-contribution-view";

export const metadata: Metadata = {
  title: "Product Contribution · Analytics · BRUVI HQ",
  description: "Contribution margin by SKU and 4-quadrant menu engineering matrix.",
};

export default function ProductContributionPage() {
  return <ProductContributionView />;
}
