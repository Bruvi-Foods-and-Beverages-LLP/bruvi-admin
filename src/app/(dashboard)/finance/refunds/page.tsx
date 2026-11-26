import type { Metadata } from "next";
import { FinanceRefundsView } from "@/components/finance/finance-refunds-view";

export const metadata: Metadata = {
  title: "Refunds · Finance · BRUVI HQ",
  description: "Refund SLA tracking and high-value Finance approval queue.",
};

export default function FinanceRefundsPage() {
  return <FinanceRefundsView />;
}
