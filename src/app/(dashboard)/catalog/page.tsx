"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCatalogProducts,
  fetchCatalogCategories,
} from "@/store/slices/catalog-slice";
import { CatalogPageHeader } from "@/components/catalog/catalog-page-header";
import { CatalogFilterBar } from "@/components/catalog/catalog-filter-bar";
import { CatalogBulkActionBar } from "@/components/catalog/catalog-bulk-action-bar";
import { CatalogProductTable } from "@/components/catalog/catalog-product-table";

/**
 * Catalog Products Management Page (Figma 225:90240 / 225:90279)
 * Aligned with the 1136px design grid, gap-6 spacing, and token system
 */
export default function CatalogPage() {
  const dispatch = useAppDispatch();
  const { total } = useAppSelector((state) => state.catalog);

  React.useEffect(() => {
    dispatch(fetchCatalogProducts());
    dispatch(fetchCatalogCategories());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      {/* 1. Header & Subnavigation Bar (Figma 225:90280) */}
      <CatalogPageHeader totalProductsCount={total} />

      {/* 2. Standalone Filter Bar with Search, Category Pills & Dropdowns (Figma 225:90303) */}
      <CatalogFilterBar />

      {/* 3. Product Table Card (Figma 225:90341) */}
      <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
        {/* Bulk Selection Action Bar when items selected (Figma 225:90342) */}
        <CatalogBulkActionBar />

        {/* High-Density Product Table with Header, Rows and Pagination Footer */}
        <CatalogProductTable />
      </div>
    </div>
  );
}
