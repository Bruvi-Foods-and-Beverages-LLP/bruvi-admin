"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Check, X, Calendar, ChevronDown, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchLoyaltyRules,
  updateLoyaltyRule,
  createLoyaltyRule,
  setIsCreatingNewRule,
} from "@/store/slices/loyalty-slice";
import type { LoyaltyRule } from "@/types/loyalty";

export function LoyaltyRules() {
  const dispatch = useAppDispatch();
  const { earnRules, burnRules, isLoading, isCreatingNewRule } = useAppSelector((state) => state.loyalty);

  const rules = earnRules;

  // Selected rule for right-panel editing
  const [selectedRuleId, setSelectedRuleId] = useState<string>("");
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form state for right side panel
  const [formData, setFormData] = useState({
    name: "New earn rule",
    rateValue: 1.0,
    appliesTo: "All members · net spend",
    startsAt: "2026-09-26",
    endsAt: "2026-10-10",
    channels: ["App", "Counter", "Kiosk", "Dine-in QR"],
    stores: "All stores",
    storesSummary: "All Bruvi coffee stores nationwide",
    stackWithTier: true,
    isActive: true,
  });

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditingBurnRules, setIsEditingBurnRules] = useState(false);

  const burnRulesState = useMemo(() => {
    return {
      pointValue: burnRules ? `1 pt ≈ ₹${burnRules.pointValueInr.toFixed(2)}` : "1 pt ≈ ₹0.10",
      minRedeem: burnRules ? `${burnRules.minRedeemPoints} pts` : "120 pts",
      maxRewards: burnRules ? `Max ${burnRules.maxRewardsPerOrder}` : "Max 2",
      earnOnRedeemed: "No",
    };
  }, [burnRules]);

  useEffect(() => {
    dispatch(fetchLoyaltyRules());
  }, [dispatch]);

  const handleStartCreate = React.useCallback(() => {
    setIsCreatingNew(true);
    setSelectedRuleId("");
  }, []);

  // Handle header "New rule" trigger
  useEffect(() => {
    if (isCreatingNewRule) {
      handleStartCreate();
      dispatch(setIsCreatingNewRule(false));
    }
  }, [isCreatingNewRule, dispatch, handleStartCreate]);

  // Set initial selected rule when rules load
  useEffect(() => {
    if (rules.length > 0 && !selectedRuleId && !isCreatingNew) {
      const preferred = rules.find((r) => r.id === "rule_lab_promo") || rules[0];
      setSelectedRuleId(preferred.id);
    }
  }, [rules, selectedRuleId, isCreatingNew]);

  // Load selected rule into form
  useEffect(() => {
    if (isCreatingNew) {
      setFormData({
        name: "New earn rule",
        rateValue: 2.0,
        appliesTo: "LAB category",
        startsAt: "2026-10-01",
        endsAt: "2026-10-31",
        channels: ["App"],
        stores: "All stores",
        storesSummary: "All 12 Bruvi coffee stores nationwide",
        stackWithTier: false,
        isActive: true,
      });
      setIsDirty(false);
      return;
    }

    const current = rules.find((r) => r.id === selectedRuleId);
    if (current) {
      setFormData({
        name: current.name,
        rateValue: current.rate_value,
        appliesTo: current.conditions?.applies_to || "LAB category",
        startsAt: current.conditions?.starts_at || "2026-09-26",
        endsAt: current.conditions?.ends_at || "2026-10-10",
        channels: current.conditions?.channels || ["App", "Counter", "Kiosk", "Dine-in QR"],
        stores: current.conditions?.stores || "6 LAB stores",
        storesSummary:
          current.conditions?.stores_summary ||
          "Indiranagar, Koramangala, Bandra, Lower Parel, Cyber Hub, Connaught Place",
        stackWithTier: current.conditions?.stack_with_tier ?? true,
        isActive: current.is_active,
      });
      setIsDirty(false);
    }
  }, [selectedRuleId, isCreatingNew, rules]);

  const handleSelectRule = (rule: LoyaltyRule) => {
    setIsCreatingNew(false);
    setSelectedRuleId(rule.id);
  };

  const handleChannelToggle = (channelName: string) => {
    setFormData((prev) => {
      const exists = prev.channels.includes(channelName);
      const newChannels = exists
        ? prev.channels.filter((c) => c !== channelName)
        : [...prev.channels, channelName];
      return { ...prev, channels: newChannels };
    });
    setIsDirty(true);
  };

  const handleSaveRule = async () => {
    setIsSaving(true);
    try {
      const conditions = {
        applies_to: formData.appliesTo,
        starts_at: formData.startsAt,
        ends_at: formData.endsAt,
        channels: formData.channels,
        stores: formData.stores,
        stores_summary: formData.storesSummary,
        stack_with_tier: formData.stackWithTier,
        is_promo: formData.name.toLowerCase().includes("lab") || formData.name.toLowerCase().includes("promo"),
      };

      if (isCreatingNew) {
        const newId = `rule_${Date.now()}`;
        await dispatch(
          createLoyaltyRule({
            id: newId,
            name: formData.name,
            description: `${formData.rateValue}× multiplier on ${formData.appliesTo}`,
            rule_type: "CATEGORY_PROMO",
            category: "EARN",
            rate_value: formData.rateValue,
            is_active: formData.isActive,
            conditions,
          }),
        );
        setIsCreatingNew(false);
        setSelectedRuleId(newId);
      } else {
        await dispatch(
          updateLoyaltyRule({
            id: selectedRuleId,
            payload: {
              name: formData.name,
              rate_value: formData.rateValue,
              is_active: formData.isActive,
              conditions,
            },
          }),
        );
      }
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (isCreatingNew) {
      setIsCreatingNew(false);
      setSelectedRuleId("rule_lab_promo");
    } else {
      const current = rules.find((r) => r.id === selectedRuleId);
      if (current) {
        setFormData({
          name: current.name,
          rateValue: current.rate_value,
          appliesTo: current.conditions?.applies_to || "LAB category",
          startsAt: current.conditions?.starts_at || "2026-09-26",
          endsAt: current.conditions?.ends_at || "2026-10-10",
          channels: current.conditions?.channels || ["App", "Counter", "Kiosk", "Dine-in QR"],
          stores: current.conditions?.stores || "6 LAB stores",
          storesSummary:
            current.conditions?.stores_summary ||
            "Indiranagar, Koramangala, Bandra, Lower Parel, Cyber Hub, Connaught Place",
          stackWithTier: current.conditions?.stack_with_tier ?? true,
          isActive: current.is_active,
        });
      }
      setIsDirty(false);
    }
  };

  const allAvailableChannels = ["App", "Counter", "Kiosk", "Dine-in QR", "Delivery"];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 items-start justify-start">
      {/* ============================================================== */}
      {/* LEFT COLUMN: 720px width (Figma 474:246373)                     */}
      {/* ============================================================== */}
      <div className="w-full lg:w-[720px] flex flex-col gap-4 shrink-0">
        {/* 1. Earn Rules Table Card (Figma 474:246374, 720×392px) */}
        <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white overflow-hidden shadow-2xs">
          {/* Card Header (Figma 474:246375, height 66px) */}
          <div className="h-[66px] px-5 py-3 flex items-center justify-between border-b border-transparent">
            <div className="flex flex-col">
              <h2 className="text-[18px] font-extrabold leading-[26px] text-[#0f2340] font-manrope">
                Earn rules
              </h2>
              <p className="text-[12px] font-medium leading-[16px] text-[#3f4b5e] font-manrope">
                Tier multipliers apply to app orders only · counter & kiosk earn base
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartCreate}
              className="text-[14px] font-bold leading-[20px] text-[#1c3a66] hover:underline cursor-pointer font-manrope transition-colors"
            >
              + Add earn rule
            </button>
          </div>

          {/* Table Header Row (Figma 474:246380, height 36px, bg #f6f8fb) */}
          <div className="h-9 px-5 bg-[#f6f8fb] border-y border-[#dce2ea] flex items-center gap-4 text-[12px] font-bold uppercase tracking-wider text-[#3f4b5e] font-manrope">
            <div className="w-[278px] shrink-0 text-left">Rule</div>
            <div className="w-[96px] shrink-0 text-right">Earn</div>
            <div className="w-[160px] shrink-0 text-left">Applies to</div>
            <div className="w-[96px] shrink-0 text-left">Status</div>
          </div>

          {/* Table Rows (6 rows, each 48px, Figma 474:246385 - 474:246423) */}
          <div className="flex flex-col divide-y divide-[#dce2ea]">
            {rules.map((rule) => {
              const isSelected = !isCreatingNew && selectedRuleId === rule.id;
              const isPromo =
                rule.conditions?.is_promo ||
                rule.id === "rule_lab_promo" ||
                rule.name.toLowerCase().includes("promo");

              // Format earn column
              let earnDisplay = `${rule.rate_value}×`;
              if (rule.rule_type === "BASE_EARN" || rule.id === "rule_base_spend") {
                earnDisplay = "1 pt / ₹20";
              } else if (rule.rule_type === "BONUS_EVENT" || rule.category === "BONUS") {
                earnDisplay = `+${rule.rate_value} pts`;
              } else if (rule.rate_value % 1 === 0) {
                earnDisplay = `${rule.rate_value}×`;
              } else {
                earnDisplay = `${rule.rate_value}×`;
              }

              // Format applies to
              const appliesToDisplay =
                rule.conditions?.applies_to ||
                (rule.id === "rule_base_spend"
                  ? "All members · net spend"
                  : rule.id === "rule_tier_gold"
                  ? "Gold · app only"
                  : rule.id === "rule_tier_platinum"
                  ? "Platinum · app only"
                  : rule.id === "rule_lab_promo"
                  ? "LAB · 26 Sep – 10 Oct"
                  : rule.id === "rule_birthday"
                  ? "Birthday month · 1×/yr"
                  : rule.id === "rule_referral"
                  ? "Referrer · 1st order"
                  : "All orders");

              return (
                <div
                  key={rule.id}
                  onClick={() => handleSelectRule(rule)}
                  className={`h-12 flex items-center gap-4 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#e8f5fd] border-l-[3px] border-l-[#1c3a66] pl-[17px] pr-5"
                      : "hover:bg-[#f8fafc] px-5"
                  }`}
                >
                  {/* Column 1: Rule Name + optional Promo badge (w 278px) */}
                  <div className="w-[278px] shrink-0 flex items-center gap-2 overflow-hidden">
                    <span className="text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope truncate">
                      {rule.name}
                    </span>
                    {isPromo && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#ecf7ea] text-[#2b7a3a] text-[12px] font-bold leading-[16px] font-manrope shrink-0">
                        Promo
                      </span>
                    )}
                  </div>

                  {/* Column 2: Earn (w 96px, right aligned, Archivo ExtraBold) */}
                  <div className="w-[96px] shrink-0 text-right font-archivo font-extrabold text-[14px] leading-[20px] text-[#0f2340]">
                    {earnDisplay}
                  </div>

                  {/* Column 3: Applies to (w 160px, Manrope Regular) */}
                  <div className="w-[160px] shrink-0 text-left text-[14px] font-normal leading-[20px] text-[#3f4b5e] font-manrope truncate">
                    {appliesToDisplay}
                  </div>

                  {/* Column 4: Status (w 96px, pill badge) */}
                  <div className="w-[96px] shrink-0 flex items-center">
                    {isSelected ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#e4f0fa] text-[#22629e] text-[12px] font-bold leading-[16px] font-manrope">
                        Editing
                      </span>
                    ) : rule.is_active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#eaf8ef] text-[#1e7e34] text-[12px] font-bold leading-[16px] font-manrope">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-[12px] bg-[#f5f7fa] text-[#7f8ca0] text-[12px] font-bold leading-[16px] font-manrope">
                        Paused
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Bottom Row: Burn Rules & Expiry & Exclusions (Figma 474:246430, 720×253px) */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          {/* Card A: Burn rules (Figma 474:246431, 352×253px) */}
          <div className="w-full sm:w-[352px] h-[253px] rounded-[16px] border border-[#dce2ea] bg-white p-[21px] flex flex-col justify-between shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-extrabold leading-[26px] text-[#0f2340] font-manrope">
                Burn rules
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingBurnRules(!isEditingBurnRules)}
                className="text-[14px] font-bold leading-[20px] text-[#1c3a66] hover:underline cursor-pointer font-manrope transition-colors"
              >
                {isEditingBurnRules ? "Done" : "Edit"}
              </button>
            </div>

            {/* Key-Value Rows */}
            <div className="flex flex-col divide-y divide-[#dce2ea]">
              {/* Row 1 */}
              <div className="py-2 flex items-center justify-between text-[14px] font-manrope">
                <span className="text-[#3f4b5e] font-normal leading-[20px]">Point value</span>
                <span className="text-[#0f2340] font-bold leading-[20px]">
                  {burnRulesState.pointValue}
                </span>
              </div>
              {/* Row 2 */}
              <div className="py-2 flex items-center justify-between text-[14px] font-manrope">
                <span className="text-[#3f4b5e] font-normal leading-[20px]">
                  Minimum to redeem
                </span>
                <span className="text-[#0f2340] font-bold leading-[20px]">
                  {burnRulesState.minRedeem}
                </span>
              </div>
              {/* Row 3 */}
              <div className="py-2 flex items-center justify-between text-[14px] font-manrope">
                <span className="text-[#3f4b5e] font-normal leading-[20px]">
                  Rewards per order
                </span>
                <span className="text-[#0f2340] font-bold leading-[20px]">
                  {burnRulesState.maxRewards}
                </span>
              </div>
              {/* Row 4 */}
              <div className="pt-2 flex items-center justify-between text-[14px] font-manrope">
                <span className="text-[#3f4b5e] font-normal leading-[20px]">
                  Earn on redeemed items
                </span>
                <span className="text-[#0f2340] font-bold leading-[20px]">
                  {burnRulesState.earnOnRedeemed}
                </span>
              </div>
            </div>
          </div>

          {/* Card B: Expiry & exclusions (Figma 474:246448, 352×253px) */}
          <div className="w-full sm:w-[352px] h-[253px] rounded-[16px] border border-[#dce2ea] bg-white p-[21px] flex flex-col justify-between shadow-2xs">
            {/* Header */}
            <div>
              <h3 className="text-[18px] font-extrabold leading-[26px] text-[#0f2340] font-manrope">
                Expiry & exclusions
              </h3>
            </div>

            {/* Info Callout Box (Figma 474:246450, bg #f6f8fb, 16px radius) */}
            <div className="rounded-[16px] bg-[#f6f8fb] p-3 flex items-start gap-3">
              <div className="w-5 h-5 shrink-0 mt-0.5 text-[#3f4b5e] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#3f4b5e]" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope">
                  Points expire 12 months after earning
                </span>
                <span className="text-[12px] font-medium leading-[16px] text-[#3f4b5e] font-manrope mt-0.5">
                  Oldest points first · reminders 30 & 7 days before
                </span>
              </div>
            </div>

            {/* Exclusions Subheader + Pills (Figma 474:246460) */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#3f4b5e] font-manrope">
                No points earned on
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="h-6 px-[13px] py-[1px] rounded-[12px] border border-[#bcc6d3] text-[12px] font-bold text-[#0f2340] font-manrope bg-white flex items-center">
                  Taxes (GST)
                </span>
                <span className="h-6 px-[13px] py-[1px] rounded-[12px] border border-[#bcc6d3] text-[12px] font-bold text-[#0f2340] font-manrope bg-white flex items-center">
                  Wallet top-ups
                </span>
                <span className="h-6 px-[13px] py-[1px] rounded-[12px] border border-[#bcc6d3] text-[12px] font-bold text-[#0f2340] font-manrope bg-white flex items-center">
                  Gift cards
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: 400px width Rule Editor Panel (Figma 474:246468) */}
      {/* ============================================================== */}
      <div className="w-full lg:w-[400px] shrink-0 rounded-[16px] border border-[#dce2ea] bg-white shadow-[0_4px_12px_rgba(15,35,64,0.08),0_12px_32px_rgba(15,35,64,0.08)] flex flex-col overflow-hidden">
        {/* Panel Header (Figma 474:246469, padding 16px 20px 17px 20px, border-b) */}
        <div className="px-5 py-4 border-b border-[#dce2ea] flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-normal uppercase tracking-wider text-[#3f4b5e] font-serif">
              {isCreatingNew ? "New earn rule" : "Edit earn rule"}
            </span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                setIsDirty(true);
              }}
              className="text-[20px] font-extrabold leading-[28px] text-[#0f2340] font-manrope bg-transparent border-none p-0 focus:outline-none focus:ring-0 max-w-[310px]"
              placeholder="Rule Name"
            />
          </div>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="w-6 h-6 flex items-center justify-center text-[#3f4b5e] hover:text-[#0f2340] cursor-pointer transition-colors"
            title="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Form Body (Figma 474:246477, padding 20px, gap 16px) */}
        <div className="p-5 flex flex-col gap-4">
          {/* Row 1: Multiplier + Applies to (Figma 474:246478) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Multiplier */}
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope">
                Multiplier
              </label>
              <div className="h-12 px-4 rounded-[12px] border border-[#7f8ca0] bg-white flex items-center justify-between">
                <input
                  type="number"
                  step="0.05"
                  value={formData.rateValue}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      rateValue: parseFloat(e.target.value) || 0,
                    }));
                    setIsDirty(true);
                  }}
                  className="w-14 font-archivo font-extrabold text-[16px] text-[#0f2340] bg-transparent border-none p-0 focus:outline-none"
                />
                <span className="text-[12px] font-medium leading-[16px] text-[#7f8ca0] font-manrope select-none">
                  of base
                </span>
              </div>
            </div>

            {/* Applies to */}
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope">
                Applies to
              </label>
              <div className="relative h-12 rounded-[12px] border border-[#7f8ca0] bg-white flex items-center">
                <select
                  value={formData.appliesTo}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, appliesTo: e.target.value }));
                    setIsDirty(true);
                  }}
                  className="w-full h-full pl-3 pr-8 rounded-[12px] text-[14px] font-normal text-[#0f2340] font-manrope bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="LAB category">LAB category</option>
                  <option value="All items">All items</option>
                  <option value="Cold brew category">Cold brew category</option>
                  <option value="Hot coffee">Hot coffee</option>
                  <option value="Bakery & food">Bakery & food</option>
                  <option value="Coffee beans & merch">Coffee beans & merch</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#3f4b5e] absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Starts + Ends (Figma 474:246492) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Starts */}
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope">
                Starts
              </label>
              <div className="h-12 px-3.5 rounded-[12px] border border-[#7f8ca0] bg-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3f4b5e] shrink-0" />
                <input
                  type="date"
                  value={formData.startsAt}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, startsAt: e.target.value }));
                    setIsDirty(true);
                  }}
                  className="w-full text-[13px] font-normal text-[#0f2340] font-manrope bg-transparent border-none p-0 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Ends */}
            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope">
                Ends
              </label>
              <div className="h-12 px-3.5 rounded-[12px] border-2 border-[#2f5690] shadow-[0_0_0_2px_rgba(205,233,249,1)] bg-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1c3a66] shrink-0" />
                <input
                  type="date"
                  value={formData.endsAt}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, endsAt: e.target.value }));
                    setIsDirty(true);
                  }}
                  className="w-full text-[13px] font-normal text-[#0f2340] font-manrope bg-transparent border-none p-0 focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Channels (Figma 474:246513) */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope">
              Channels
            </label>
            <div className="flex flex-wrap gap-2">
              {allAvailableChannels.map((channel) => {
                const isSelected = formData.channels.includes(channel);
                return (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => handleChannelToggle(channel)}
                    className={`h-9 px-3 rounded-[18px] text-[14px] font-bold leading-[20px] font-manrope transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#1c3a66] text-white shadow-2xs"
                        : "border border-[#bcc6d3] text-[#3f4b5e] hover:bg-gray-50 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{channel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Stores (Figma 474:246536) */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope">
              Stores
            </label>
            <div className="relative h-12 rounded-[12px] border border-[#7f8ca0] bg-white flex items-center">
              <select
                value={formData.stores}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, stores: e.target.value }));
                  setIsDirty(true);
                }}
                className="w-full h-full pl-4 pr-10 rounded-[12px] text-[16px] font-normal text-[#0f2340] font-manrope bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
              >
                <option value="6 LAB stores">6 LAB stores</option>
                <option value="All stores">All 12 stores</option>
                <option value="Bengaluru stores">Bengaluru stores only</option>
                <option value="Mumbai stores">Mumbai stores only</option>
                <option value="Delhi NCR stores">Delhi NCR stores only</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#3f4b5e] absolute right-4 pointer-events-none" />
            </div>
            <p className="text-[12px] font-medium leading-[16px] text-[#3f4b5e] font-manrope mt-1">
              {formData.storesSummary}
            </p>
          </div>

          {/* Row 5: Stack with tier multiplier toggle (Figma 474:246543) */}
          <div className="border-t border-[#dce2ea] pt-3 flex items-center justify-between">
            <div className="flex flex-col max-w-[290px]">
              <span className="text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope">
                Stack with tier multiplier
              </span>
              <span className="text-[12px] font-medium leading-[16px] text-[#3f4b5e] font-manrope">
                App orders: Gold 2.5×, Platinum 3× on LAB
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, stackWithTier: !prev.stackWithTier }));
                setIsDirty(true);
              }}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.stackWithTier ? "bg-[#1c3a66]" : "bg-[#dce2ea]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.stackWithTier ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Panel Footer (Figma 474:246549, height 61px, bg #f6f8fb, border-t #dce2ea) */}
        <div className="h-[61px] px-5 py-3 bg-[#f6f8fb] border-t border-[#dce2ea] flex items-center justify-between">
          <div>
            {isDirty && (
              <span className="text-[12px] font-bold leading-[16px] text-[#d97706] font-manrope">
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-[14px] font-bold leading-[20px] text-[#0f2340] hover:bg-gray-50 transition-colors font-manrope cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveRule}
              disabled={isSaving}
              className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-[14px] font-bold leading-[20px] text-white shadow-2xs transition-colors font-manrope cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[95px]"
            >
              {isSaving ? "Saving..." : "Save rule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
