import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions & Recurring Delivery · BRUVI HQ",
  description: "Recurring whole-bean roast shipments, corporate office subscriptions, and renewals.",
};

export default function SubscriptionsPage() {
  return (
    <ComingSoonModule
      title="Subscriptions"
      category="Growth"
      iconName="refresh"
      description="Manage automated recurring fresh roast deliveries for retail subscribers and enterprise corporate pantry contracts. Automated billing, roast schedule dispatch, and pauses."
      features={[
        "Bi-weekly and monthly whole-bean roast delivery schedules",
        "Automated UPI Autopay and credit card recurring mandate settlement",
        "Grind profile customization (Whole Bean, Aeropress, Espresso, Phin)",
        "Corporate office coffee bean supply contracts and multi-site billing",
      ]}
    />
  );
}

