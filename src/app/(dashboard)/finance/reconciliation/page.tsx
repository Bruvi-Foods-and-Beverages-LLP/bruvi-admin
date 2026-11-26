import type { Metadata } from "next";
import { FinanceReconciliationView } from "@/components/finance/finance-reconciliation-view";

export const metadata: Metadata = {
  title: "Reconciliation · Finance · BRUVI HQ",
  description: "T+1 expected vs settled provider matching and variance trace.",
};

export default function FinanceReconciliationPage() {
  return <FinanceReconciliationView />;
}
