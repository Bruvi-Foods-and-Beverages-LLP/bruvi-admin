import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance & Settlements · BRUVI HQ",
  description: "Daily register reconciliation, payment gateway settlements, taxes, and margins.",
};

export default function FinancePage() {
  return (
    <ComingSoonModule
      title="Finance & Settlements"
      category="Business"
      iconName="card"
      description="Omnichannel financial clearinghouse: daily cash drawer closings, Razorpay UPI/Card gateway reconciliations, 5% F&B vs 18% Merchandise GST reports, and payout audits."
      features={[
        "Automated 3-way reconciliation (POS tenders vs payment gateway vs bank deposit)",
        "GSTIN multi-state tax breakdown (CGST, SGST, IGST)",
        "Daily shift cash float variance audits & store closing slips",
        "COGS analysis with real-time gross margin tracking",
      ]}
    />
  );
}

