import type { Metadata } from "next";
import { Suspense } from "react";
import { SubscriptionsScreen } from "@/components/subscriptions/subscriptions-screen";

export const metadata: Metadata = {
  title: "Subscriptions · BRUVI HQ",
  description: "BRUVI Club plans, subscribers, renewals and dunning.",
};

/** BRUVI Club (Figma A110 Plans · A113 Subscribers). */
export default function SubscriptionsPage() {
  return (
    <Suspense>
      <SubscriptionsScreen />
    </Suspense>
  );
}
