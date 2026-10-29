import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HQ Settings & Policies · BRUVI HQ",
  description: "Global corporate configuration, tax rules, hardware peripherals, and security.",
};

export default function SettingsPage() {
  return (
    <ComingSoonModule
      title="HQ Settings & Policies"
      category="Business"
      iconName="sun"
      description="Corporate system preferences: multi-entity GSTIN numbers, currency formats, thermal kitchen printer ESC/POS configurations, and cryptographic security."
      features={[
        "Global company profile & FSSAI / legal tax entity management",
        "Peripheral hardware drivers (Thermal receipt printers, Bluetooth scales)",
        "Enterprise RBAC permission matrix & API key provisioning",
        "Audit trail logs for all recipe price and catalog mutations",
      ]}
    />
  );
}

