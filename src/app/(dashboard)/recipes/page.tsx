import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipes & BOM · BRUVI HQ",
  description: "Standard Operating Procedures (SOP), bill of materials, and barista prep steps.",
};

export default function RecipesPage() {
  return (
    <ComingSoonModule
      title="Recipes & BOM"
      category="Menu"
      iconName="file"
      description="Standard Operating Procedures (SOP), yield tracking, ingredient grammage precision, and barista beverage preparation protocols across bar stations."
      features={[
        "Beverage Bill of Materials (BOM) with gram-level precision",
        "Barista preparation workflow guides & station timers",
        "Sub-recipe nesting (cold foams, syrups, and condensed bases)",
        "Automated yield loss and waste variance tracking",
      ]}
    />
  );
}

