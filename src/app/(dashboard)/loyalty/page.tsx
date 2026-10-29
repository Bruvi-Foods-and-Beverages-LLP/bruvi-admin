import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loyalty & Rewards · BRUVI HQ",
  description: "Tiered rewards program rules, stamp card redemption, and points engine.",
};

export default function LoyaltyPage() {
  return (
    <ComingSoonModule
      title="Loyalty & Rewards"
      category="Growth"
      iconName="star"
      description="Bruvi Beans & Stamps loyalty program engine. Configure earn rates (e.g. 10 beans per ₹100 spent), reward tier thresholds, and free drink vouchers."
      features={[
        "Custom reward tier configurations (Classic, Gold, Connoisseur)",
        "Automated digital stamp card rules (Buy 7 cups, get 8th complimentary)",
        "Points ledger with fraud anomaly detection and manual point adjustments",
        "Exclusive subscriber perks & priority mobile pickup lanes",
      ]}
    />
  );
}

