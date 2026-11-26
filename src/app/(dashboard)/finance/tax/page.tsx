import type { Metadata } from "next";
import { TaxReportsView } from "@/components/finance/tax-reports-view";

export const metadata: Metadata = {
  title: "Tax Reports · Finance · BRUVI HQ",
  description: "State GSTIN breakdown, SAC Table 12, GSTR-1/3B tracker, and NIC IRP e-invoicing.",
};

export default function FinanceTaxPage() {
  return <TaxReportsView />;
}
