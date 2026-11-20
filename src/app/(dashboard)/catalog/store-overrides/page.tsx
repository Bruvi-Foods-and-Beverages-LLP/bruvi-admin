"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchStoreOverrides,
  setDrawerOpen,
} from "@/store/slices/store-overrides-slice";
import { CatalogPageHeader } from "@/components/catalog/catalog-page-header";
import { StoreOverridesTable } from "@/components/catalog/store-overrides/store-overrides-table";
import { AddOverrideDrawer } from "@/components/catalog/store-overrides/add-override-drawer";
import { Download, Plus } from "lucide-react";

export default function StoreOverridesPage() {
  const dispatch = useAppDispatch();
  const { overrides } = useAppSelector((state) => state.storeOverrides);

  React.useEffect(() => {
    dispatch(fetchStoreOverrides());
  }, [dispatch]);

  const handleExportCSV = () => {
    let csv = "Product,Store,City,Type,OverridePrice,Available,Reason,Expires\n";
    overrides.forEach((o) => {
      const prod = o.products?.name || "Product";
      const store = o.outlets?.name || "";
      const city = o.outlets?.city || "";
      const isPrice = o.overridePricePaise !== null && o.overridePricePaise !== undefined;
      const type = isPrice ? "PRICE" : "AVAILABILITY";
      const price = isPrice ? `₹${Math.round(o.overridePricePaise! / 100)}` : "";
      const avail = o.isAvailable ? "YES" : "NO";
      const reason = o.autoHiddenDetail || o.autoHiddenReason || "";
      const expires = o.effectiveTo || "Permanent";
      csv += `"${prod}","${store}","${city}","${type}","${price}","${avail}","${reason}","${expires}"\n`;
    });

    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csv}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bruvi-store-overrides-${Date.now()}.csv`);
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
        onClick={() => dispatch(setDrawerOpen(true))}
        className="h-10 px-4 rounded-xl bg-[#0f2340] text-xs font-bold text-white hover:bg-[#1c3a66] transition-colors flex items-center gap-2 shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5" />
        Add override
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-24">
      {/* 1. Header (Figma 474:229196) */}
      <CatalogPageHeader
        activeNavTab="Store overrides"
        breadcrumb="Catalog / Store overrides"
        title="Store overrides"
        actions={headerActions}
      />

      {/* 2. Store Overrides Filter Tabs & Table (Figma 474:229196) */}
      <StoreOverridesTable />

      {/* 3. Add Override Slide-Over Drawer (Figma 474:229375) */}
      <AddOverrideDrawer />
    </div>
  );
}

