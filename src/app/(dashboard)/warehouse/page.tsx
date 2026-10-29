import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warehouse & Logistics · BRUVI HQ",
  description: "Central roastery depot logistics, GRN, and transfer orders.",
};

export default function WarehousePage() {
  return (
    <ComingSoonModule
      title="Warehouse & Logistics"
      category="Supply"
      iconName="warehouse"
      description="Central roastery depot inventory management, Goods Received Notes (GRN), vendor purchase orders (PO), and cold-chain dispatch to retail outlets."
      features={[
        "Goods Received Notes (GRN) with QA inspection checklists",
        "Inter-store stock transfer manifests & cold-chain transit tracking",
        "Green bean lot intake, moisture analysis, and roast batching",
        "Automated vendor procurement & PO workflow approvals",
      ]}
    />
  );
}

