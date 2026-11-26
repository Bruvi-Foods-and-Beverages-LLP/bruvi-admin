import type { Metadata } from "next";
import { StoreProfitabilityView } from "@/components/analytics/store-profitability-view";

export const metadata: Metadata = {
  title: "Store Profitability · Analytics · BRUVI HQ",
  description: "Per-store P&L-lite, revenue-to-EBITDA waterfall, and underperformer actions.",
};

export default function StoreProfitabilityPage() {
  return <StoreProfitabilityView />;
}
