import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers & CRM · BRUVI HQ",
  description: "Omnichannel customer profiles, beverage preferences, and purchase histories.",
};

export default function CustomersPage() {
  return (
    <ComingSoonModule
      title="Customers & CRM"
      category="Growth"
      iconName="users"
      description="360-degree customer intelligence across mobile app, in-store kiosk, and counter POS. Favorite roasts, milk substitutions, lifetime value, and visit frequency."
      features={[
        "Unified customer profile with cross-channel order history",
        "Beverage customization preferences (sweetness, ice, alternative milks)",
        "Customer Lifetime Value (LTV) and churn risk scoring",
        "Direct-to-guest support ticketing and feedback resolution",
      ]}
    />
  );
}

