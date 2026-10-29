import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Inventory · BRUVI HQ",
  description: "Store-level stock counts, reorder thresholds, and depletion tracking.",
};

export default function InventoryPage() {
  return (
    <ComingSoonModule
      title="Store Inventory"
      category="Supply"
      iconName="parcel"
      description="Real-time multi-store ingredient stock balances, depletion telemetry from POS transactions, batch expiries, and automated reorder alerts."
      features={[
        "Sub-milligram and milliliter real-time stock ledger",
        "Automated reorder point (ROP) calculation based on sales velocity",
        "Biometric daily opening and closing count audits",
        "Ingredient batch traceability & expiry quarantine alerts",
      ]}
    />
  );
}

