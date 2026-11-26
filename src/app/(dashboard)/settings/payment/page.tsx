import type { Metadata } from "next";
import { SettingsPaymentView } from "@/components/settings/settings-payment-view";

export const metadata: Metadata = {
  title: "Payment Settings · BRUVI HQ",
  description: "Payment gateways, EDC terminals, settlement windows, and refund routing.",
};

export default function SettingsPaymentPage() {
  return <SettingsPaymentView />;
}
