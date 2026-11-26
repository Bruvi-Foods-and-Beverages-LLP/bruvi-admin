import type { Metadata } from "next";
import { CreatePoView } from "@/components/warehouse/create-po-view";

export const metadata: Metadata = {
  title: "New Purchase Order · Warehouse · BRUVI HQ",
  description: "Create a purchase order from reorder suggestions with GST calculation.",
};

export default function CreatePurchaseOrderPage() {
  return <CreatePoView />;
}
