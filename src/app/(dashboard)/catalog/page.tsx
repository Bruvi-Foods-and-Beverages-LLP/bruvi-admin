import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Catalog · BRUVI HQ",
  description: "Category hierarchies, modifier groups, and dynamic pricing rules.",
};

export default function CatalogPage() {
  return (
    <ComingSoonModule
      title="Catalog"
      category="Menu"
      iconName="coffee"
      description="Central menu master catalog: beverage recipes, temperature variants, syrup and milk modifiers, GST slabs, and multi-store pricing differentials."
      features={[
        "Multi-tier category and modifier group architecture",
        "Dynamic outlet-specific pricing and promotional happy hour rules",
        "Beverage temperature variants (Hot vs Iced vs Cold Foam)",
        "Instant digital menu board synchronization across all stores",
      ]}
    />
  );
}
