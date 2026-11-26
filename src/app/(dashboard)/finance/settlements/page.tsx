import type { Metadata } from "next";
import { StoreSettlementView } from "@/components/finance/store-settlement-view";

export const metadata: Metadata = {
  title: "Store Settlements · Finance · BRUVI HQ",
  description: "Per-store daily close, expandable shift cash drawer audits, and network totals.",
};

export default function FinanceSettlementsPage() {
  return <StoreSettlementView />;
}
