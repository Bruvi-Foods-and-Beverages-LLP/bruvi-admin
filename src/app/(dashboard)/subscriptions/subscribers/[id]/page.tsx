import type { Metadata } from "next";
import { SubscriptionDetail } from "@/components/subscriptions/subscription-detail";

export const metadata: Metadata = { title: "Subscriber · Subscriptions · BRUVI HQ" };

/** Figma A114 Subscription detail. */
export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubscriptionDetail id={id} />;
}
