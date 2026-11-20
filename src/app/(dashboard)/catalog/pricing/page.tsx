"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchPricingData, setBulkAdjustOpen } from "@/store/slices/pricing-slice";
import { CatalogPageHeader } from "@/components/catalog/catalog-page-header";
import { PricingTable } from "@/components/catalog/pricing/pricing-table";
import { BulkAdjustModal } from "@/components/catalog/pricing/bulk-adjust-modal";
import { PricingBottomBar } from "@/components/catalog/pricing/pricing-bottom-bar";
import { Download, SlidersHorizontal } from "lucide-react";

export default function PricingPage() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.pricing);

  React.useEffect(() => {
    dispatch(fetchPricingData());
  }, [dispatch]);

  const handleExportCSV = () => {
    let csv = "SKU,Product,Category,BasePrice,Mumbai,Bengaluru,Margin\n";
    products.forEach((p) => {
      const base = p.basePriceRupees || Math.round(p.basePricePaise / 100);
      const isDrink = !p.categoryName?.toLowerCase().includes("bite");
      const mumbai = isDrink ? base + 10 : base;
      const margin = p.grossMarginPercent || 78;
      csv += `"${p.sku}","${p.name}","${p.categoryName || ""}",${base},${mumbai},${base},${margin}%\n`;
    });

    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csv}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bruvi-pricing-matrix-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleExportCSV}
        className="h-10 px-4 rounded-xl border border-[#dce2ea] bg-white text-xs font-bold text-[#0f2340] hover:bg-[#f5f7fa] transition-colors flex items-center gap-2 shadow-2xs"
      >
        <Download className="w-3.5 h-3.5 text-[#55647a]" />
        Export
      </button>

      <button
        type="button"
        onClick={() => dispatch(setBulkAdjustOpen(true))}
        className="h-10 px-4 rounded-xl bg-[#0f2340] text-xs font-bold text-white hover:bg-[#1c3a66] transition-colors flex items-center gap-2 shadow-2xs"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Bulk adjust
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-24">
      {/* 1. Header (Figma 474:228805) */}
      <CatalogPageHeader
        activeNavTab="Pricing"
        breadcrumb="Catalog / Pricing"
        title="Pricing"
        actions={headerActions}
      />

      {/* 2. Pricing Matrix Table Card with Inline Editing & Filters */}
      <PricingTable onOpenBulkAdjust={() => dispatch(setBulkAdjustOpen(true))} />

      {/* 3. Bulk Adjust Modal (Figma 474:229009) */}
      <BulkAdjustModal />

      {/* 4. Sticky Floating Changes Bar (Figma 474:229044) */}
      <PricingBottomBar />
    </div>
  );
}
