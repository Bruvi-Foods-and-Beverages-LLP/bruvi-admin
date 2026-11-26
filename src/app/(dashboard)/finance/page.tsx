import type { Metadata } from "next";
import { FinanceOverviewView } from "@/components/finance/finance-overview-view";

export const metadata: Metadata = {
  title: "Finance & Settlements · BRUVI HQ",
  description:
    "Daily gross-to-net sales bridge, payment mix, T+1 settlements, and attention queue.",
};

export default function FinancePage() {
  return <FinanceOverviewView />;
}
