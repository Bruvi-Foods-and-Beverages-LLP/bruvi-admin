"use client";

import { Pagination, usePagination } from "@/components/ui/pagination";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setSearchQuery,
  setSelectedCategory,
  updateCellPrice,
  fetchPricingData,
} from "@/store/slices/pricing-slice";
import { ProductImage } from "@/components/catalog/product-image";
import { Search, AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PricingTableProps {
  onOpenBulkAdjust: () => void;
}

export function PricingTable({ onOpenBulkAdjust }: PricingTableProps) {
  const dispatch = useAppDispatch();
  const {
    products,
    cityRules,
    overrides,
    categories,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    changedCells,
  } = useAppSelector((state) => state.pricing);

  // Find Mumbai rule delta (e.g. 1000 paise = ₹10)
  const mumbaiRule = cityRules.find(
    (r) =>
      r.cities?.code === "BOM" ||
      r.cities?.name.toLowerCase() === "mumbai" ||
      r.name.toLowerCase().includes("mumbai")
  );
  const mumbaiDeltaRupees = mumbaiRule ? Math.round((mumbaiRule.deltaPricePaise || 0) / 100) : 10;

  // Filter products by search and category
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "all" ||
        p.categorySlug === selectedCategory ||
        p.categoryId === selectedCategory ||
        p.categoryName?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);
  const pager = usePagination(filteredProducts, 10, "products");
  const resetPager = pager.reset;
  React.useEffect(() => {
    resetPager();
  }, [searchQuery, selectedCategory, resetPager]);

  if (isLoading && products.length === 0) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="h-10 w-full flex justify-between items-center">
          <Skeleton className="h-9 w-44 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
        <div className="w-full rounded-2xl border border-[#dce2ea] bg-white p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-[#fee2e2] bg-[#fef2f2] p-8 text-center flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-8 h-8 text-[#ef4444]" />
        <h3 className="text-base font-bold text-[#991b1b]">Unable to load pricing matrix</h3>
        <p className="text-xs text-[#b91c1c] max-w-md">{error}</p>
        <button
          onClick={() => dispatch(fetchPricingData())}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f2340] text-white text-xs font-bold hover:bg-[#1c3a66] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Filter Bar & Legend Row (Figma 474:228824) */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative w-44">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#55647a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Filter products"
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-[#7f8ca0] bg-[#f5f7fa] text-xs text-[#0f2340] placeholder:text-[#55647a] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0f2340]"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
            className="h-9 px-3 rounded-xl border border-[#7f8ca0] bg-white text-xs text-[#0f2340] font-medium focus:outline-hidden"
          >
            <option value="all">Category: All</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>

          {/* Legend Items */}
          <div className="flex items-center gap-3 pl-2 text-[#55647a]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              Changed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
              Rule-derived
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              Editable
            </span>
          </div>
        </div>

        {/* Right Info */}
        <span className="text-xs text-[#55647a] self-end sm:self-auto font-medium">
          Prices include GST
        </span>
      </div>

      {/* 2. Pricing Matrix Table (Figma 474:228854) */}
      <div className="w-full rounded-2xl border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="h-12 bg-[#f5f7fa] border-b border-[#dce2ea] text-xs font-semibold text-[#55647a]">
                <th className="py-2 px-4 min-w-[240px]">Product</th>
                <th className="py-2 px-3 min-w-[95px]">
                  <div>Base</div>
                  <div className="text-[10px] text-[#7f8ca0] font-normal">12 stores</div>
                </th>
                <th className="py-2 px-3 min-w-[95px]">
                  <div>Bengaluru</div>
                  <div className="text-[10px] text-[#7f8ca0] font-normal">= base</div>
                </th>
                <th className="py-2 px-3 min-w-[95px]">
                  <div>Mumbai</div>
                  <div className="text-[10px] text-[#0284c7] font-medium">+₹{mumbaiDeltaRupees} drinks</div>
                </th>
                <th className="py-2 px-3 min-w-[95px]">
                  <div>Delhi NCR</div>
                  <div className="text-[10px] text-[#7f8ca0] font-normal">= base</div>
                </th>
                <th className="py-2 px-3 min-w-[90px]">
                  <div>Kiosk</div>
                  <div className="text-[10px] text-[#7f8ca0] font-normal">channel</div>
                </th>
                <th className="py-2 px-3 min-w-[90px]">
                  <div>App</div>
                  <div className="text-[10px] text-[#7f8ca0] font-normal">channel</div>
                </th>
                <th className="py-2 px-4 min-w-[85px] text-right">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce2ea]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-[#55647a]">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                pager.pageItems.map((product) => {
                  const baseRupees =
                    product.basePriceRupees || Math.round(product.basePricePaise / 100);

                  const isBite =
                    product.categoryName?.toLowerCase().includes("bite") ||
                    product.categoryName?.toLowerCase().includes("food");
                  const isDrink = !isBite;

                  // Mumbai default price: +10 if drink rule applies
                  const defaultMumbai = isDrink ? baseRupees + mumbaiDeltaRupees : baseRupees;

                  // Estimated Cost
                  const costPaise =
                    product.estimatedCostPaise ||
                    product.margin?.estimatedCostPaise ||
                    Math.round(baseRupees * 22);
                  const costRupees = (costPaise / 100).toFixed(2);

                  // Changed cells map keys
                  const baseKey = `${product.id}:base`;
                  const blrKey = `${product.id}:bengaluru`;
                  const bomKey = `${product.id}:mumbai`;
                  const delKey = `${product.id}:delhi`;
                  const kioskKey = `${product.id}:kiosk`;
                  const appKey = `${product.id}:app`;

                  const currentBase = changedCells[baseKey] ?? baseRupees;
                  const currentBlr = changedCells[blrKey] ?? currentBase;
                  const currentBom = changedCells[bomKey] ?? (isDrink ? currentBase + mumbaiDeltaRupees : currentBase);
                  const currentDel = changedCells[delKey] ?? currentBase;
                  const currentKiosk = changedCells[kioskKey] ?? currentBase;
                  const currentApp = changedCells[appKey] ?? currentBase;

                  // Dynamic margin % calculated on base
                  const grossMargin = (
                    ((currentBase - parseFloat(costRupees)) / currentBase) *
                    100
                  ).toFixed(1);

                  return (
                    <tr
                      key={product.id}
                      className="h-14 hover:bg-[#f8fafc] transition-colors text-xs"
                    >
                      {/* Product identity */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <ProductImage
                            src={product.imageUrl || product.thumbnailUrl}
                            alt={product.name}
                            className="w-9 h-9 rounded-xl object-cover shrink-0 border border-[#dce2ea]"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[#0f2340] truncate text-sm">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-[#55647a] truncate">
                              {product.sku} · cost ₹{costRupees}
                              {product.scheduledPriceRupees ? ` · sched ₹${product.scheduledPriceRupees}` : ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Base Price Cell */}
                      <td className="py-2 px-3">
                        <PriceCell
                          value={currentBase}
                          isChanged={changedCells[baseKey] !== undefined}
                          onChange={(newVal) =>
                            dispatch(
                              updateCellPrice({
                                productId: product.id,
                                columnKey: "base",
                                originalPriceRupees: baseRupees,
                                newPriceRupees: newVal,
                              })
                            )
                          }
                        />
                      </td>

                      {/* Bengaluru Cell */}
                      <td className="py-2 px-3">
                        <PriceCell
                          value={currentBlr}
                          isChanged={changedCells[blrKey] !== undefined}
                          onChange={(newVal) =>
                            dispatch(
                              updateCellPrice({
                                productId: product.id,
                                columnKey: "bengaluru",
                                originalPriceRupees: baseRupees,
                                newPriceRupees: newVal,
                              })
                            )
                          }
                        />
                      </td>

                      {/* Mumbai Cell */}
                      <td className="py-2 px-3">
                        <PriceCell
                          value={currentBom}
                          isRuleDerived={changedCells[bomKey] === undefined && isDrink}
                          isChanged={changedCells[bomKey] !== undefined}
                          onChange={(newVal) =>
                            dispatch(
                              updateCellPrice({
                                productId: product.id,
                                columnKey: "mumbai",
                                originalPriceRupees: defaultMumbai,
                                newPriceRupees: newVal,
                              })
                            )
                          }
                        />
                      </td>

                      {/* Delhi NCR Cell */}
                      <td className="py-2 px-3">
                        <PriceCell
                          value={currentDel}
                          isChanged={changedCells[delKey] !== undefined}
                          onChange={(newVal) =>
                            dispatch(
                              updateCellPrice({
                                productId: product.id,
                                columnKey: "delhi",
                                originalPriceRupees: baseRupees,
                                newPriceRupees: newVal,
                              })
                            )
                          }
                        />
                      </td>

                      {/* Kiosk Cell */}
                      <td className="py-2 px-3">
                        <PriceCell
                          value={currentKiosk}
                          isChanged={changedCells[kioskKey] !== undefined}
                          onChange={(newVal) =>
                            dispatch(
                              updateCellPrice({
                                productId: product.id,
                                columnKey: "kiosk",
                                originalPriceRupees: baseRupees,
                                newPriceRupees: newVal,
                              })
                            )
                          }
                        />
                      </td>

                      {/* App Cell */}
                      <td className="py-2 px-3">
                        <PriceCell
                          value={currentApp}
                          isChanged={changedCells[appKey] !== undefined}
                          onChange={(newVal) =>
                            dispatch(
                              updateCellPrice({
                                productId: product.id,
                                columnKey: "app",
                                originalPriceRupees: baseRupees,
                                newPriceRupees: newVal,
                              })
                            )
                          }
                        />
                      </td>

                      {/* Margin % */}
                      <td className="py-2 px-4 text-right">
                        <span className="font-mono font-bold text-xs text-[#0f2340]">
                          {grossMargin}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filteredProducts.length > 0 && <Pagination {...pager.paginationProps} />}
      </div>
    </div>
  );
}

interface PriceCellProps {
  value: number;
  isChanged?: boolean;
  isRuleDerived?: boolean;
  onChange: (val: number) => void;
}

function PriceCell({ value, isChanged, isRuleDerived, onChange }: PriceCellProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempVal, setTempVal] = React.useState(String(value));

  React.useEffect(() => {
    setTempVal(String(value));
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(tempVal.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(parsed) && parsed > 0 && parsed !== value) {
      onChange(parsed);
    } else {
      setTempVal(String(value));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTempVal(String(value));
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center h-8 px-2 rounded-lg bg-white border-2 border-[#0f2340] shadow-xs">
        <span className="text-xs text-[#55647a] mr-1">₹</span>
        <input
          type="text"
          value={tempVal}
          onChange={(e) => setTempVal(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-12 text-xs font-bold text-[#0f2340] focus:outline-hidden font-mono"
        />
      </div>
    );
  }

  let bgClass = "bg-transparent text-[#0f2340]";
  if (isChanged) {
    bgClass = "bg-[#fff7ed] text-[#b45309] font-extrabold border border-[#fed7aa]";
  } else if (isRuleDerived) {
    bgClass = "text-[#0284c7] font-semibold";
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      title="Click to edit price"
      className={`h-8 px-2 rounded-lg font-mono text-xs flex items-center justify-start gap-0.5 hover:ring-1 hover:ring-[#7f8ca0] transition-all cursor-pointer ${bgClass}`}
    >
      <span>₹</span>
      <span className="tabular-nums font-bold">{value}</span>
    </button>
  );
}

