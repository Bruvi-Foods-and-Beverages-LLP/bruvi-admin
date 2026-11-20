"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Coffee,
  ChevronDown,
  Check,
  Smartphone,
  Store,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setIsCreateRewardOpen,
  setEditingReward,
  createLoyaltyReward,
  updateLoyaltyReward,
  fetchLoyaltyRewards,
} from "@/store/slices/loyalty-slice";
import { CatalogApi } from "@/lib/api/catalog";
import type { CatalogProduct } from "@/types/catalog";
import type {
  RewardCategoryColor,
  RewardIconType,
  RewardItemType,
  LoyaltyTier,
  RewardStatus,
} from "@/types/loyalty";

/**
 * A103 Create Reward Workspace (Figma Node 474:247072)
 *
 * Left Column (720px, 474:247129):
 *  - Reward details (name, linked item with menu price, points cost, cost to BRUVI, valid after redeem)
 *  - Eligibility & limits (Tiers pills, Channels pills, Redemption limit dropdown, Stores dropdown)
 *  - Footer action bar (autosave indicator, Save as draft, Publish reward, Cancel)
 *
 * Right Column (400px, 474:247230):
 *  - Customer App Live Preview Card (474:247231, #e8f5fd surface brand)
 *  - Unit Economics Calculator Card (474:247248, White card with liability & give-back metrics)
 */
export function CreateRewardWorkspace() {
  const dispatch = useAppDispatch();
  const { editingReward, isSubmitting } = useAppSelector((state) => state.loyalty);

  // Form states
  const [title, setTitle] = useState("Salted Cream Cold Brew");
  const [description, setDescription] = useState("");
  const [pointsCost, setPointsCost] = useState(450);
  const [costToBruvi, setCostToBruvi] = useState(48);
  const [validDays, setValidDays] = useState(14);
  const [selectedTiers, setSelectedTiers] = useState<string[]>(["GOLD", "PLATINUM"]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["APP", "COUNTER"]);
  const [redemptionLimit, setRedemptionLimit] = useState("1 per member per week");
  const [selectedStores, setSelectedStores] = useState("All 12 stores");
  const [linkedProductId, setLinkedProductId] = useState<string | null>(null);
  const [linkedProductName, setLinkedProductName] = useState("Salted Cream Cold Brew");
  const [linkedProductPrice, setLinkedProductPrice] = useState(260);

  // Live Catalog products for linked item dropdown
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [isLimitDropdownOpen, setIsLimitDropdownOpen] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isValidDaysDropdownOpen, setIsValidDaysDropdownOpen] = useState(false);

  // Load products dynamically from backend catalog API
  useEffect(() => {
    let mounted = true;
    CatalogApi.getProducts({ limit: 100 })
      .then((res) => {
        if (mounted && res?.products) {
          setCatalogProducts(res.products);
          // If no linked product selected, check if one matches default title
          if (!editingReward && res.products.length > 0) {
            const match = res.products.find((p) =>
              p.name.toLowerCase().includes("salted cream") || p.name.toLowerCase().includes("cold brew")
            ) || res.products[0];
            if (match) {
              setLinkedProductId(match.id);
              setLinkedProductName(match.name);
              setLinkedProductPrice(match.basePriceRupees || 260);
            }
          }
        }
      })
      .catch(() => {
        // Fallback gracefully
      });
    return () => {
      mounted = false;
    };
  }, [editingReward]);

  // Sync state if editing existing reward
  useEffect(() => {
    if (editingReward) {
      setTitle(editingReward.title);
      setDescription(editingReward.description || "");
      setPointsCost(editingReward.points_cost);
      setValidDays(editingReward.valid_days || 14);
      setCostToBruvi(editingReward.cost_to_bruvi ?? 48);
      if (editingReward.eligible_tiers && editingReward.eligible_tiers.length > 0) {
        setSelectedTiers(editingReward.eligible_tiers);
      } else {
        setSelectedTiers([editingReward.min_tier || "GOLD"]);
      }
      if (editingReward.channels && editingReward.channels.length > 0) {
        setSelectedChannels(editingReward.channels);
      }
      if (editingReward.redemption_limit) {
        setRedemptionLimit(editingReward.redemption_limit);
      }
      if (editingReward.stores) {
        setSelectedStores(editingReward.stores);
      }
      if (editingReward.linked_product_id) {
        setLinkedProductId(editingReward.linked_product_id);
      }
    }
  }, [editingReward]);

  // Handle tier toggle
  const toggleTier = (tier: string) => {
    if (selectedTiers.includes(tier)) {
      if (selectedTiers.length > 1) {
        setSelectedTiers(selectedTiers.filter((t) => t !== tier));
      }
    } else {
      setSelectedTiers([...selectedTiers, tier]);
    }
  };

  // Handle channel toggle
  const toggleChannel = (channel: string) => {
    if (selectedChannels.includes(channel)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== channel));
      }
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  // Calculate Unit Economics
  // 1 point = ₹0.10 in value
  const pointsLiabilityEliminated = pointsCost * 0.1;
  // Spend to earn at Gold tier app order rate: 1 pt per ₹16 spend (6.25 pts / ₹100)
  const spendToEarn = pointsCost * 16;
  const effectiveGiveBackPercent =
    spendToEarn > 0 ? Number(((costToBruvi / spendToEarn) * 100).toFixed(1)) : 0.9;

  // Filtered catalog products for dropdown
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return catalogProducts.slice(0, 8);
    const q = productSearch.toLowerCase();
    return catalogProducts
      .filter((p) => p.name.toLowerCase().includes(q) || p.categoryName?.toLowerCase().includes(q))
      .slice(0, 8);
  }, [catalogProducts, productSearch]);

  const handleSelectProduct = (product: CatalogProduct) => {
    setLinkedProductId(product.id);
    setLinkedProductName(product.name);
    setLinkedProductPrice(product.basePriceRupees || 240);
    // Auto-update reward title if user hasn't heavily customized it
    if (!editingReward) {
      setTitle(product.name);
    }
    setIsProductDropdownOpen(false);
  };

  // Save handler (draft or published)
  const handleSave = async (status: RewardStatus) => {
    if (!title.trim() || pointsCost <= 0) return;

    const payload = {
      title,
      description: description || `Drink · ${selectedTiers.join(", ")} · Regular size`,
      pointsCost,
      categoryColor: "coffee" as RewardCategoryColor,
      iconType: "cup" as RewardIconType,
      itemType: "DRINK" as RewardItemType,
      linkedProductId,
      status,
      validDays,
      minTier: (selectedTiers[0] as LoyaltyTier) || "GOLD",
      stockLimit: null,
      confirmationNote: `Added automatically to your next order. Valid for ${validDays} days at any BRUVI.`,
      costToBruvi,
      eligibleTiers: selectedTiers,
      channels: selectedChannels,
      redemptionLimit,
      stores: selectedStores,
    };

    if (editingReward) {
      await dispatch(
        updateLoyaltyReward({
          id: editingReward.id,
          payload,
        }),
      );
    } else {
      await dispatch(createLoyaltyReward(payload));
    }

    dispatch(fetchLoyaltyRewards());
    dispatch(setIsCreateRewardOpen(false));
    dispatch(setEditingReward(null));
  };

  const handleCancel = () => {
    dispatch(setIsCreateRewardOpen(false));
    dispatch(setEditingReward(null));
  };

  // Tier display text for preview
  const tierSummaryText = useMemo(() => {
    if (selectedTiers.includes("SILVER") && selectedTiers.includes("GOLD") && selectedTiers.includes("PLATINUM")) {
      return "All Members";
    }
    if (selectedTiers.includes("GOLD") && selectedTiers.includes("PLATINUM")) {
      return "Gold & Platinum";
    }
    return selectedTiers.map((t) => t.charAt(0) + t.slice(1).toLowerCase()).join(" & ");
  }, [selectedTiers]);

  return (
    <div className="w-full max-w-[1136px] mx-auto flex flex-col lg:flex-row gap-4 items-start pb-12">
      {/* ─────────────────────────────────────────────────────────────
          LEFT COLUMN: Form Details & Actions (Figma 474:247129, 720px)
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[720px] bg-white border border-[#dce2ea] rounded-2xl overflow-hidden shadow-2xs flex flex-col">
        {/* Content Section (Figma 474:247130) */}
        <div className="p-6 flex flex-col gap-5">
          {/* Section 1: Reward details (Figma 474:279059) */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h2 className="text-[18px] font-extrabold text-[#0f2340] font-sans leading-[26px]">
                Reward details
              </h2>
              <p className="text-[12px] font-medium text-[#55647a] leading-4">
                What the member gets and what it costs them
              </p>
            </div>

            {/* Row 1: Reward name (436px) & Linked item (218px) */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Reward name Input */}
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[14px] font-bold text-[#0f2340]">
                  Reward name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={40}
                    placeholder="e.g. Salted Cream Cold Brew"
                    className="w-full h-12 px-[18px] rounded-xl border-2 border-[#2f5690] shadow-[0_0_0_2px_rgba(205,233,249,1)] text-[16px] text-[#0f2340] font-medium focus:outline-none transition-all"
                  />
                </div>
                <span className="text-[12px] font-medium text-[#55647a]">
                  {title.length} / 40 characters · shown in app & on receipt
                </span>
              </div>

              {/* Linked item Dropdown */}
              <div className="w-full sm:w-[218px] flex flex-col gap-1 relative">
                <label className="text-[14px] font-bold text-[#0f2340]">
                  Linked item
                </label>
                <button
                  type="button"
                  onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                  className="w-full h-12 px-3 rounded-xl border border-[#7f8ca0] bg-white flex items-center justify-between text-left hover:border-[#0f2340] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Coffee className="h-4 w-4 text-[#1c3a66] shrink-0" />
                    <span className="text-[14px] text-[#0f2340] font-medium truncate">
                      {linkedProductName || "Select item"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-[#55647a] shrink-0" />
                </button>
                <span className="text-[12px] font-medium text-[#55647a]">
                  Menu price ₹{linkedProductPrice}
                </span>

                {/* Dropdown Menu */}
                {isProductDropdownOpen && (
                  <div className="absolute top-[76px] left-0 w-[280px] bg-white border border-[#dce2ea] rounded-xl shadow-lg z-50 p-2 flex flex-col gap-1 max-h-64 overflow-y-auto">
                    <div className="flex items-center gap-2 px-2 py-1.5 border-b border-[#dce2ea] mb-1">
                      <Search className="h-3.5 w-3.5 text-[#55647a]" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search menu..."
                        className="w-full text-xs text-[#0f2340] focus:outline-none"
                      />
                    </div>
                    {filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProduct(p)}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          linkedProductId === p.id ? "bg-slate-100 font-bold" : ""
                        }`}
                      >
                        <span className="truncate text-[#0f2340]">{p.name}</span>
                        <span className="text-[#55647a] shrink-0 font-sans">
                          ₹{p.basePriceRupees || 240}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Points cost (213px), Cost to BRUVI (213px), Valid after redeem (213px) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {/* Points cost */}
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-bold text-[#0f2340]">
                  Points cost
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={pointsCost}
                    onChange={(e) => setPointsCost(Math.max(1, Number(e.target.value)))}
                    className="w-full h-12 px-4 rounded-xl border border-[#7f8ca0] text-[16px] text-[#0f2340] font-bold focus:outline-none focus:border-[#2f5690] transition-colors pr-12"
                  />
                  <span className="absolute right-4 text-[14px] font-bold text-[#55647a]">
                    pts
                  </span>
                </div>
                <span className="text-[12px] font-medium text-[#55647a]">
                  Same as Any regular drink
                </span>
              </div>

              {/* Cost to BRUVI */}
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-bold text-[#0f2340]">
                  Cost to BRUVI
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-[16px] font-bold text-[#55647a]">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={costToBruvi}
                    onChange={(e) => setCostToBruvi(Math.max(0, Number(e.target.value)))}
                    className="w-full h-12 pl-8 pr-4 rounded-xl border border-[#7f8ca0] text-[16px] text-[#0f2340] font-bold focus:outline-none focus:border-[#2f5690] transition-colors"
                  />
                </div>
                <span className="text-[12px] font-medium text-[#55647a]">
                  From recipe cost · Regular
                </span>
              </div>

              {/* Valid after redeem */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-[14px] font-bold text-[#0f2340]">
                  Valid after redeem
                </label>
                <button
                  type="button"
                  onClick={() => setIsValidDaysDropdownOpen(!isValidDaysDropdownOpen)}
                  className="w-full h-12 px-4 rounded-xl border border-[#7f8ca0] bg-white flex items-center justify-between text-left hover:border-[#0f2340] transition-colors cursor-pointer"
                >
                  <span className="text-[16px] text-[#0f2340] font-medium">
                    {validDays} days
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#55647a]" />
                </button>
                <span className="text-[12px] font-medium text-[#55647a]">
                  Voucher expires after this
                </span>

                {isValidDaysDropdownOpen && (
                  <div className="absolute top-[76px] left-0 w-full bg-white border border-[#dce2ea] rounded-xl shadow-lg z-50 p-1 flex flex-col gap-0.5">
                    {[7, 14, 30, 60, 90].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => {
                          setValidDays(days);
                          setIsValidDaysDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-slate-50 transition-colors ${
                          validDays === days ? "font-bold text-[#1c3a66] bg-blue-50" : "text-[#0f2340]"
                        }`}
                      >
                        {days} days
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Divider */}
          <div className="border-t border-[#dce2ea] pt-5 flex flex-col gap-4">
            {/* Header: Eligibility & limits (Figma 474:279062) */}
            <div className="flex flex-col">
              <h2 className="text-[18px] font-extrabold text-[#0f2340] font-sans leading-[26px]">
                Eligibility & limits
              </h2>
              <p className="text-[12px] font-medium text-[#55647a] leading-4">
                Who can redeem, where, and how often
              </p>
            </div>

            {/* Row 1: Tiers (263px) & Channels (357px) */}
            <div className="flex flex-col sm:flex-row gap-6 w-full items-start">
              {/* Tiers Selector */}
              <div className="w-full sm:w-[263px] flex flex-col gap-2">
                <label className="text-[14px] font-bold text-[#0f2340]">
                  Tiers
                </label>
                <div className="flex items-center gap-2">
                  {/* Silver */}
                  <button
                    type="button"
                    onClick={() => toggleTier("SILVER")}
                    className={`h-9 px-3 rounded-full text-[14px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedTiers.includes("SILVER")
                        ? "bg-[#1c3a66] text-white shadow-2xs"
                        : "border border-[#bcc6d3] text-[#3f4b5e] hover:border-[#0f2340]"
                    }`}
                  >
                    {selectedTiers.includes("SILVER") && <Check className="h-3.5 w-3.5" />}
                    Silver
                  </button>

                  {/* Gold */}
                  <button
                    type="button"
                    onClick={() => toggleTier("GOLD")}
                    className={`h-9 px-3 rounded-full text-[14px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedTiers.includes("GOLD")
                        ? "bg-[#1c3a66] text-white shadow-2xs"
                        : "border border-[#bcc6d3] text-[#3f4b5e] hover:border-[#0f2340]"
                    }`}
                  >
                    {selectedTiers.includes("GOLD") && <Check className="h-3.5 w-3.5" />}
                    Gold
                  </button>

                  {/* Platinum */}
                  <button
                    type="button"
                    onClick={() => toggleTier("PLATINUM")}
                    className={`h-9 px-3 rounded-full text-[14px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedTiers.includes("PLATINUM")
                        ? "bg-[#1c3a66] text-white shadow-2xs"
                        : "border border-[#bcc6d3] text-[#3f4b5e] hover:border-[#0f2340]"
                    }`}
                  >
                    {selectedTiers.includes("PLATINUM") && <Check className="h-3.5 w-3.5" />}
                    Platinum
                  </button>
                </div>
                <span className="text-[12px] font-medium text-[#55647a]">
                  Gold+ · 25,400 eligible members
                </span>
              </div>

              {/* Channels Selector */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[14px] font-bold text-[#0f2340]">
                  Channels
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {/* App */}
                  <button
                    type="button"
                    onClick={() => toggleChannel("APP")}
                    className={`h-9 px-3 rounded-full text-[14px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedChannels.includes("APP")
                        ? "bg-[#1c3a66] text-white shadow-2xs"
                        : "border border-[#bcc6d3] text-[#3f4b5e] hover:border-[#0f2340]"
                    }`}
                  >
                    {selectedChannels.includes("APP") && <Check className="h-3.5 w-3.5" />}
                    App
                  </button>

                  {/* Counter */}
                  <button
                    type="button"
                    onClick={() => toggleChannel("COUNTER")}
                    className={`h-9 px-3 rounded-full text-[14px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedChannels.includes("COUNTER")
                        ? "bg-[#1c3a66] text-white shadow-2xs"
                        : "border border-[#bcc6d3] text-[#3f4b5e] hover:border-[#0f2340]"
                    }`}
                  >
                    {selectedChannels.includes("COUNTER") && <Check className="h-3.5 w-3.5" />}
                    Counter
                  </button>

                  {/* Kiosk */}
                  <button
                    type="button"
                    onClick={() => toggleChannel("KIOSK")}
                    className={`h-9 px-3 rounded-full text-[14px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedChannels.includes("KIOSK")
                        ? "bg-[#1c3a66] text-white shadow-2xs"
                        : "border border-[#bcc6d3] text-[#3f4b5e] hover:border-[#0f2340]"
                    }`}
                  >
                    {selectedChannels.includes("KIOSK") && <Check className="h-3.5 w-3.5" />}
                    Kiosk
                  </button>

                  {/* Dine-in QR */}
                  <button
                    type="button"
                    onClick={() => toggleChannel("DINE_IN")}
                    className={`h-9 px-3 rounded-full text-[14px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedChannels.includes("DINE_IN")
                        ? "bg-[#1c3a66] text-white shadow-2xs"
                        : "border border-[#bcc6d3] text-[#3f4b5e] hover:border-[#0f2340]"
                    }`}
                  >
                    {selectedChannels.includes("DINE_IN") && <Check className="h-3.5 w-3.5" />}
                    Dine-in QR
                  </button>
                </div>
                <span className="text-[12px] font-medium text-[#55647a]">
                  Counter redeems by scanning member QR
                </span>
              </div>
            </div>

            {/* Row 2: Redemption limit & Stores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Redemption limit */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-[14px] font-bold text-[#0f2340]">
                  Redemption limit
                </label>
                <button
                  type="button"
                  onClick={() => setIsLimitDropdownOpen(!isLimitDropdownOpen)}
                  className="w-full h-12 px-4 rounded-xl border border-[#7f8ca0] bg-white flex items-center justify-between text-left hover:border-[#0f2340] transition-colors cursor-pointer"
                >
                  <span className="text-[16px] text-[#0f2340] font-medium">
                    {redemptionLimit}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#55647a]" />
                </button>

                {isLimitDropdownOpen && (
                  <div className="absolute top-[76px] left-0 w-full bg-white border border-[#dce2ea] rounded-xl shadow-lg z-50 p-1 flex flex-col gap-0.5">
                    {[
                      "1 per member per week",
                      "1 per member per month",
                      "1 per member total",
                      "1 per order",
                      "Unlimited",
                    ].map((limit) => (
                      <button
                        key={limit}
                        type="button"
                        onClick={() => {
                          setRedemptionLimit(limit);
                          setIsLimitDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-slate-50 transition-colors ${
                          redemptionLimit === limit ? "font-bold text-[#1c3a66] bg-blue-50" : "text-[#0f2340]"
                        }`}
                      >
                        {limit}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stores */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-[14px] font-bold text-[#0f2340]">
                  Stores
                </label>
                <button
                  type="button"
                  onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                  className="w-full h-12 px-4 rounded-xl border border-[#7f8ca0] bg-white flex items-center justify-between text-left hover:border-[#0f2340] transition-colors cursor-pointer"
                >
                  <span className="text-[16px] text-[#0f2340] font-medium">
                    {selectedStores}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#55647a]" />
                </button>

                {isStoreDropdownOpen && (
                  <div className="absolute top-[76px] left-0 w-full bg-white border border-[#dce2ea] rounded-xl shadow-lg z-50 p-1 flex flex-col gap-0.5">
                    {[
                      "All 12 stores",
                      "Indiranagar LAB only",
                      "Bangalore stores (8)",
                      "Mumbai stores (4)",
                    ].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setSelectedStores(st);
                          setIsStoreDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-slate-50 transition-colors ${
                          selectedStores === st ? "font-bold text-[#1c3a66] bg-blue-50" : "text-[#0f2340]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Bar (Figma 474:247221, 718×61px, bg-[#f6f8fb]) */}
        <div className="w-full h-[61px] bg-[#f6f8fb] border-t border-[#dce2ea] px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[14px] text-[#3f4b5e] font-normal font-sans">
              Unsaved changes · draft autosaved just now
            </span>
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs font-semibold text-[#55647a] hover:text-[#0f2340] ml-3 cursor-pointer underline transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave("DRAFT")}
              className="h-9 px-4 rounded-xl bg-white border-[1.5px] border-[#bcc6d3] text-[14px] font-bold text-[#0f2340] hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              Save as draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave("LIVE")}
              className="h-9 px-4 rounded-xl bg-[#1c3a66] hover:bg-[#0f2340] text-[14px] font-bold text-white transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              {editingReward ? "Update reward" : "Publish reward"}
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT COLUMN: Live Preview & Unit Economics (Figma 474:247230, 400px)
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        {/* Top Card: Customer App Preview (Figma 474:247231, #e8f5fd surface) */}
        <div className="w-full bg-[#e8f5fd] rounded-2xl p-5 flex flex-col gap-3">
          {/* Header Row */}
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-normal uppercase tracking-wider text-[#3f4b5e] font-serif">
              Preview · BRUVI app
            </span>
            <span className="text-[12px] font-bold text-[#1c3a66]">
              Gold member view
            </span>
          </div>

          {/* White Card Preview */}
          <div className="w-full bg-white rounded-2xl shadow-[0_1px_2px_rgba(15,35,64,0.06),0_2px_8px_rgba(15,35,64,0.06)] overflow-hidden flex flex-col">
            {/* Drink Illustration Banner */}
            <div className="w-full h-[160px] bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb] relative flex items-center justify-center p-4">
              {/* Category / Tier Pill */}
              <div className="absolute top-3 left-3 bg-[#dcfce7] text-[#15803d] px-2.5 py-0.5 rounded-full text-[12px] font-bold">
                {tierSummaryText}
              </div>

              {/* Decorative Coffee Graphic */}
              <div className="flex flex-col items-center justify-center gap-1.5 opacity-80">
                <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center text-[#1c3a66]">
                  <Coffee className="h-7 w-7" />
                </div>
                <span className="text-[11px] font-bold text-[#55647a] uppercase tracking-wider">
                  {linkedProductName || "Specialty Brew"}
                </span>
              </div>
            </div>

            {/* Card Content Area */}
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[18px] font-extrabold text-[#0f2340] font-sans truncate">
                  {title || "Reward Title"}
                </h3>
                <p className="text-[12px] font-medium text-[#3f4b5e]">
                  Regular · use within {validDays} days · {redemptionLimit}
                </p>
              </div>

              {/* Points & Redeem Row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[18px] font-black text-[#0f2340] font-mono">
                  {pointsCost} pts
                </span>
                <button
                  type="button"
                  className="h-9 px-4 rounded-xl bg-[#1c3a66] text-white text-[14px] font-bold shadow-2xs hover:bg-[#0f2340] transition-colors cursor-pointer"
                >
                  Redeem
                </button>
              </div>

              {/* Member points balance after note */}
              <p className="text-[12px] font-medium text-[#55647a]">
                Saisubbireddy has 1,240 pts · {Math.max(0, 1240 - pointsCost).toLocaleString("en-IN")} left after
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Card: Unit Economics Calculator (Figma 474:247248, White card) */}
        <div className="w-full bg-white border border-[#dce2ea] rounded-2xl p-5 flex flex-col gap-2 shadow-2xs">
          <h3 className="text-[18px] font-extrabold text-[#0f2340] font-sans">
            Reward economics
          </h3>

          <div className="flex items-center justify-between text-[14px] pt-1">
            <span className="text-[#3f4b5e] font-normal">
              Points value ({pointsCost} × ₹0.10)
            </span>
            <span className="text-[#0f2340] font-bold font-sans">
              ₹{pointsLiabilityEliminated.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[14px]">
            <span className="text-[#3f4b5e] font-normal">
              Cost to BRUVI
            </span>
            <span className="text-[#0f2340] font-bold font-sans">
              ₹{Number(costToBruvi).toFixed(2)}
            </span>
          </div>

          <div className="border-t border-[#dce2ea] pt-2.5 mt-1 flex items-center justify-between text-[14px]">
            <span className="text-[#0f2340] font-bold">
              Spend to earn it (Gold, app)
            </span>
            <span className="text-[#0f2340] font-black font-mono">
              ₹{spendToEarn.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="text-[12px] font-bold text-emerald-700 pt-1">
            Effective give-back {effectiveGiveBackPercent}% of spend · within 1.5% target
          </p>
        </div>
      </div>
    </div>
  );
}
