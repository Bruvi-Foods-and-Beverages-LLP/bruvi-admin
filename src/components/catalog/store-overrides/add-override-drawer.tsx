"use client";

import * as React from "react";
import { X, Plus, Sparkles, Loader2, Store as StoreIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setDrawerOpen, createStoreOverride } from "@/store/slices/store-overrides-slice";
import { fetchStores } from "@/store/slices/stores-slice";
import { fetchCatalogProducts } from "@/store/slices/catalog-slice";
import { AutoHiddenReason } from "@/types/catalog";

export function AddOverrideDrawer() {
  const dispatch = useAppDispatch();
  const { isDrawerOpen, isSubmitting } = useAppSelector((state) => state.storeOverrides);
  const { stores } = useAppSelector((state) => state.stores);
  const { products } = useAppSelector((state) => state.catalog);

  const [overrideType, setOverrideType] = React.useState<"PRICE" | "AVAILABILITY">("PRICE");
  const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");
  const [overridePrice, setOverridePrice] = React.useState<string>("");
  const [isAvailable, setIsAvailable] = React.useState<boolean>(false);
  const [autoHiddenReason, setAutoHiddenReason] = React.useState<AutoHiddenReason>("STOCKOUT");
  const [reasonText, setReasonText] = React.useState<string>("Local promo");
  const [endDate, setEndDate] = React.useState<string>("");
  const [isPermanent, setIsPermanent] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (isDrawerOpen) {
      if (stores.length === 0) dispatch(fetchStores());
      if (products.length === 0) dispatch(fetchCatalogProducts());
    }
  }, [isDrawerOpen, dispatch, stores.length, products.length]);

  // Set default product when products load
  React.useEffect(() => {
    if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
      const base = products[0].basePriceRupees || Math.round(products[0].basePricePaise / 100);
      setOverridePrice(String(Math.max(1, base - 20)));
    }
  }, [products, selectedProductId]);

  // Set initial selected stores (e.g. first two stores)
  React.useEffect(() => {
    if (stores.length > 0 && selectedStoreIds.length === 0) {
      setSelectedStoreIds([stores[0].id]);
    }
  }, [stores, selectedStoreIds.length]);

  if (!isDrawerOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const baseRupees = currentProduct
    ? currentProduct.basePriceRupees || Math.round(currentProduct.basePricePaise / 100)
    : 230;

  const numericOverridePrice = parseInt(overridePrice.replace(/[^0-9]/g, ""), 10) || baseRupees;
  const priceDelta = numericOverridePrice - baseRupees;

  // Margin calculation
  const costRupees = currentProduct
    ? (currentProduct.estimatedCostPaise || Math.round(baseRupees * 22)) / 100
    : 54;
  const marginPercent = (
    ((numericOverridePrice - costRupees) / numericOverridePrice) *
    100
  ).toFixed(1);

  // Selected store names
  const selectedStores = stores.filter((s) => selectedStoreIds.includes(s.id));
  const storeNamesText =
    selectedStores.map((s) => s.name).join(" and ") || "selected stores";

  const toggleStore = (storeId: string) => {
    if (selectedStoreIds.includes(storeId)) {
      if (selectedStoreIds.length > 1) {
        setSelectedStoreIds(selectedStoreIds.filter((id) => id !== storeId));
      }
    } else {
      setSelectedStoreIds([...selectedStoreIds, storeId]);
    }
  };

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      const base = prod.basePriceRupees || Math.round(prod.basePricePaise / 100);
      setOverridePrice(String(Math.max(1, base - 20)));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct || selectedStoreIds.length === 0) return;

    await dispatch(
      createStoreOverride({
        outletIds: selectedStoreIds,
        productId: currentProduct.id,
        overridePricePaise: overrideType === "PRICE" ? numericOverridePrice * 100 : null,
        isAvailable: overrideType === "PRICE" ? true : isAvailable,
        autoHiddenReason: overrideType === "AVAILABILITY" && !isAvailable ? autoHiddenReason : null,
        autoHiddenDetail: reasonText,
        effectiveFrom: new Date().toISOString(),
        effectiveTo: !isPermanent && endDate ? new Date(endDate).toISOString() : null,
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-[420px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 border-l border-[#dce2ea]">
        {/* Top Header */}
        <div className="p-6 border-b border-[#dce2ea] flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0f2340] tracking-tight">Add override</h2>
            <button
              onClick={() => dispatch(setDrawerOpen(false))}
              className="p-1 rounded-lg text-[#55647a] hover:bg-[#f5f7fa] hover:text-[#0f2340] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-[#55647a]">
            Change price or availability for specific stores.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 p-6 flex flex-col gap-5">
          {/* 1. Override Type Segmented Control */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
              Override type
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#f5f7fa] rounded-xl border border-[#dce2ea]">
              <button
                type="button"
                onClick={() => setOverrideType("PRICE")}
                className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                  overrideType === "PRICE"
                    ? "bg-[#0f2340] text-white shadow-2xs"
                    : "text-[#55647a] hover:text-[#0f2340]"
                }`}
              >
                Price
              </button>
              <button
                type="button"
                onClick={() => setOverrideType("AVAILABILITY")}
                className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                  overrideType === "AVAILABILITY"
                    ? "bg-[#0f2340] text-white shadow-2xs"
                    : "text-[#55647a] hover:text-[#0f2340]"
                }`}
              >
                Availability
              </button>
            </div>
          </div>

          {/* 2. Stores Picker (Tags + Dropdown) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
              Stores
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-[#dce2ea] bg-[#f5f7fa] min-h-[44px]">
              {selectedStores.map((store) => (
                <span
                  key={store.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#dce2ea] text-xs font-bold text-[#0f2340] shadow-2xs"
                >
                  <StoreIcon className="w-3 h-3 text-[#55647a]" />
                  {store.name}
                  <button
                    type="button"
                    onClick={() => toggleStore(store.id)}
                    className="hover:text-red-600 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Select dropdown to add other stores */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  toggleStore(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="h-9 px-3 rounded-xl border border-[#7f8ca0] bg-white text-xs text-[#55647a] font-medium"
            >
              <option value="" disabled>
                Add store…
              </option>
              {stores
                .filter((s) => !selectedStoreIds.includes(s.id))
                .map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} ({store.city})
                  </option>
                ))}
            </select>
          </div>

          {/* 3. Product Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
              Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#7f8ca0] bg-white text-sm text-[#0f2340] font-semibold"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) · Base ₹{p.basePriceRupees || Math.round(p.basePricePaise / 100)}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Type Specific Fields */}
          {overrideType === "PRICE" ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
                  Override price
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#55647a]">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={overridePrice}
                      onChange={(e) => setOverridePrice(e.target.value)}
                      className="w-full h-10 pl-7 pr-3 rounded-xl border border-[#7f8ca0] text-sm font-bold text-[#0f2340] font-mono focus:ring-2 focus:ring-[#0f2340]/20"
                    />
                  </div>
                  <div
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold font-mono ${
                      priceDelta < 0
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : priceDelta > 0
                        ? "bg-[#ffedd5] text-[#b45309]"
                        : "bg-[#f1f5f9] text-[#55647a]"
                    }`}
                  >
                    {priceDelta === 0 ? "= base" : `${priceDelta > 0 ? "+" : ""}${priceDelta} vs base`}
                  </div>
                </div>
                <span className="text-[11px] text-[#55647a]">
                  Base ₹{baseRupees} · margin at ₹{numericOverridePrice}:{" "}
                  <strong className="text-[#0f2340]">{marginPercent}%</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
                  Availability status
                </label>
                <select
                  value={isAvailable ? "available" : "hidden"}
                  onChange={(e) => setIsAvailable(e.target.value === "available")}
                  className="w-full h-10 px-3 rounded-xl border border-[#7f8ca0] bg-white text-xs font-bold text-[#0f2340]"
                >
                  <option value="hidden">Hidden / Sold out</option>
                  <option value="available">Force available</option>
                </select>
              </div>

              {!isAvailable && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
                    Reason category
                  </label>
                  <select
                    value={autoHiddenReason}
                    onChange={(e) => setAutoHiddenReason(e.target.value as AutoHiddenReason)}
                    className="w-full h-10 px-3 rounded-xl border border-[#7f8ca0] bg-white text-xs text-[#0f2340]"
                  >
                    <option value="STOCKOUT">Ingredient stockout</option>
                    <option value="EQUIPMENT_FAILURE">Equipment failure</option>
                    <option value="MANUAL_STAFF">Staff manual decision</option>
                    <option value="SCHEDULED_OFF">Scheduled maintenance</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* 5. Reason Text Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
              Reason note
            </label>
            <input
              type="text"
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="e.g. Local promo or Equipment repair"
              className="w-full h-10 px-3 rounded-xl border border-[#7f8ca0] text-xs font-medium text-[#0f2340]"
            />
          </div>

          {/* 6. Expiry / Ends */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
              Ends
            </label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-[#0f2340] cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={isPermanent}
                  onChange={(e) => setIsPermanent(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0f2340]"
                />
                Permanent (No end date)
              </label>
            </div>
            {!isPermanent && (
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#7f8ca0] text-xs text-[#0f2340]"
              />
            )}
          </div>

          {/* 7. Natural Language Summary Box (Figma 474:229375) */}
          <div className="rounded-xl bg-[#f0f9ff] border border-[#bae6fd] p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0369a1]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Override Summary</span>
            </div>
            <p className="text-xs text-[#0c4a6e] leading-relaxed">
              {currentProduct?.name || "Product"} will be{" "}
              {overrideType === "PRICE"
                ? `₹${numericOverridePrice} at ${storeNamesText}`
                : isAvailable
                ? `available at ${storeNamesText}`
                : `hidden at ${storeNamesText}`}{" "}
              on all channels {isPermanent ? "permanently" : `until ${endDate || "scheduled date"}`},{" "}
              then return to {overrideType === "PRICE" ? `₹${baseRupees}` : "normal menu availability"}.
            </p>
          </div>

          {/* Footer CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#dce2ea] mt-auto">
            <button
              type="button"
              onClick={() => dispatch(setDrawerOpen(false))}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#55647a] hover:bg-[#f5f7fa] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0f2340] text-white hover:bg-[#1c3a66] transition-colors shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Create override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

