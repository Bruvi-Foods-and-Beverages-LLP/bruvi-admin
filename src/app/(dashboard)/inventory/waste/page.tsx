import type { Metadata } from "next";
import { WasteEntryView } from "@/components/inventory/waste-entry-view";

export const metadata: Metadata = {
  title: "Waste Log · Inventory · BRUVI HQ",
  description: "Network-wide waste log and costed waste entry.",
};

export default function WasteEntryPage() {
  return <WasteEntryView />;
}
