"use client";

import * as React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchProductById,
  fetchCatalogCategories,
} from "@/store/slices/catalog-slice";
import {
  ProductDetailHeader,
  ProductSummaryCard,
  ProductDietaryCard,
  ProductCustomisationCard,
  ProductPerformanceCard,
  ProductAvailabilityCard,
  ProductDetailSkeleton,
} from "@/components/catalog/detail";
import { PackageSearch, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Pixel-Perfect Product Detail Overview Page (Figma 225:90840)
 * Aligned with 1136px grid, 24px/32px canvas padding, Archivo/Manrope tokens.
 */
export default function ProductDetailPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const productId = unwrappedParams.id;

  const dispatch = useAppDispatch();
  const { selectedProduct, isLoading, error } = useAppSelector(
    (state) => state.catalog
  );

  const [activeTab, setActiveTab] = React.useState("overview");
  const [hasFetched, setHasFetched] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchProductById(productId)).unwrap(),
          dispatch(fetchCatalogCategories()),
        ]);
      } catch (e) {
        console.error("Failed to load product details", e);
      } finally {
        if (isMounted) {
          setHasFetched(true);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [dispatch, productId]);

  // Loading skeleton while resolving product data
  if (!hasFetched || (isLoading && !selectedProduct)) {
    return (
      <div className="w-full max-w-[1136px] mx-auto pb-12">
        <ProductDetailSkeleton />
      </div>
    );
  }

  // Empty state if product not found or failed to load
  if (!selectedProduct || selectedProduct.id !== productId) {
    return (
      <div className="w-full max-w-[1136px] mx-auto pb-12">
        {/* Simple back navigation */}
        <div className="mb-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-[14px] leading-5 font-bold text-[#1C3A66] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to products</span>
          </Link>
        </div>

        {/* Empty State Card */}
        <div className="w-full min-h-[420px] rounded-[16px] border border-[#DCE2EA] bg-white p-12 flex flex-col items-center justify-center text-center shadow-2xs">
          <div className="h-16 w-16 rounded-full bg-[#EBEFF4] flex items-center justify-center text-[#55647A] mb-4">
            <PackageSearch className="h-8 w-8" />
          </div>
          <h2 className="font-display font-black text-[22px] leading-7 text-[#0F2340]">
            Product Not Found
          </h2>
          <p className="max-w-[420px] text-[14px] leading-5 text-[#55647A] mt-2 mb-6">
            The product you are looking for ({productId}) does not exist, has
            been archived, or was recently moved from the catalog.
          </p>
          <Link
            href="/catalog"
            className="h-10 px-5 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-white text-[14px] leading-5 font-bold inline-flex items-center justify-center transition-colors shadow-xs"
          >
            Return to Products Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Resolved Product Page
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12 animate-in fade-in duration-150">
      {/* 1. Header with Breadcrumbs, SKU, Tags, Duplicate & Edit Buttons, and Tab Bar (Figma 225:90880) */}
      <ProductDetailHeader
        product={selectedProduct}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 2. Tab Content: Overview (Figma 225:90879 - 1136px container) */}
      {activeTab === "overview" && (
        <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
          {/* Left Column (712px width on desktop) */}
          <div className="flex flex-col gap-6 w-full lg:w-[712px] shrink-0">
            {/* Top: Product Summary Card (Figma 225:90911) */}
            <ProductSummaryCard product={selectedProduct} />

            {/* Bottom Row: Dietary & Allergens (320px) + Customisation (372px) (Figma 225:90937 & 225:90958) */}
            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-5 w-full items-start">
              <ProductDietaryCard product={selectedProduct} />
              <ProductCustomisationCard product={selectedProduct} />
            </div>
          </div>

          {/* Right Column (400px width on desktop) */}
          <div className="flex flex-col gap-6 w-full lg:w-[400px] shrink-0">
            {/* Top: Performance Metric & Bar Chart Card (Figma 225:90998) */}
            <ProductPerformanceCard product={selectedProduct} />

            {/* Bottom: Store Availability Card (Figma 225:91039) */}
            <ProductAvailabilityCard product={selectedProduct} />
          </div>
        </div>
      )}

      {/* Secondary Tab: Customisation */}
      {activeTab === "customisation" && (
        <div className="w-full">
          <ProductCustomisationCard product={selectedProduct} />
        </div>
      )}

      {/* Secondary Tab: Availability */}
      {activeTab === "availability" && (
        <div className="w-full max-w-[600px]">
          <ProductAvailabilityCard product={selectedProduct} />
        </div>
      )}

      {/* Secondary Tab: Performance */}
      {activeTab === "performance" && (
        <div className="w-full max-w-[600px]">
          <ProductPerformanceCard product={selectedProduct} />
        </div>
      )}

      {/* Secondary Tab: Recipe */}
      {activeTab === "recipe" && (
        <div className="w-full rounded-[16px] border border-[#DCE2EA] bg-white p-6 shadow-2xs">
          <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0F2340]">
            Standard Bar Recipe
          </h3>
          <p className="text-[14px] leading-5 text-[#55647A] mt-2">
            Preparation procedure and ingredient ratio guidelines configured for the {selectedProduct.prepStation} station.
          </p>
        </div>
      )}
    </div>
  );
}
