import type { Metadata } from "next";
import { FinancePaymentsView } from "@/components/finance/finance-payments-view";

export const metadata: Metadata = {
  title: "Payments · Finance · BRUVI HQ",
  description: "Omnichannel payment attempts, gateway fees, and failure rate telemetry.",
};

export default function FinancePaymentsPage() {
  return <FinancePaymentsView />;
}
