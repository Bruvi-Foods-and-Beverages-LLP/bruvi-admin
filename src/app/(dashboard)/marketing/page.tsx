import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketing & Campaigns · BRUVI HQ",
  description: "Promotional campaigns, push notification dispatch, and discount rules.",
};

export default function MarketingPage() {
  return (
    <ComingSoonModule
      title="Marketing & Campaigns"
      category="Growth"
      iconName="volume"
      description="Omnichannel marketing engine: geo-fenced push notifications, automated birthday rewards, seasonal drink launches, and coupon redemption analytics."
      features={[
        "Geo-fenced mobile push notifications for nearby store locations",
        "Dynamic coupon generation with minimum basket value conditions",
        "Seasonal drop announcement scheduler & banner manager",
        "A/B testing for promotions and digital menu boards",
      ]}
    />
  );
}

