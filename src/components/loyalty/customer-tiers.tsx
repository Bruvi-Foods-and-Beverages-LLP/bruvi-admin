"use client";

import React, { useEffect, useState, useRef } from "react";
import { Check, AlertTriangle, Plus, Trash2, Edit3, X, Save } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchLoyaltyTiers,
  updateLoyaltyTierSettings,
  setIsPreviewMemberViewOpen,
} from "@/store/slices/loyalty-slice";
import type { TierBenefitRow, TierQualificationSettings } from "@/types/loyalty";

/**
 * Customer Loyalty Tiers & Benefits Management (Figma Node 474:247416 / A104)
 * Strictly matches 1136px grid, Archivo & Manrope tokens, 4px spacing increments,
 * live qualification rules and full benefits matrix.
 */
export function CustomerTiers() {
  const dispatch = useAppDispatch();
  const { tiersData, isLoading, saveTierSettingsTrigger } = useAppSelector(
    (state) => state.loyalty,
  );

  // Local editable state for qualification settings
  const [qualification, setQualification] = useState<TierQualificationSettings>({
    windowMonths: 12,
    windowType: "12 months, rolling",
    gracePeriodDays: 30,
    downgradeGracePeriodDays: 30,
    instantUpgrade: true,
    membersInGrace: 412,
    graceDeadline: "1 Nov",
  });

  // Local editable state for benefits matrix
  const [benefits, setBenefits] = useState<TierBenefitRow[]>([]);
  const [isAddingBenefit, setIsAddingBenefit] = useState(false);
  const [newBenefitTitle, setNewBenefitTitle] = useState("");
  const [newSilverVal, setNewSilverVal] = useState("—");
  const [newGoldVal, setNewGoldVal] = useState("1 / month");
  const [newPlatVal, setNewPlatVal] = useState("4 / month");

  // Editing existing benefit
  const [editingBenefitId, setEditingBenefitId] = useState<string | null>(null);
  const [editBenefitTitle, setEditBenefitTitle] = useState("");
  const [editSilverVal, setEditSilverVal] = useState("");
  const [editGoldVal, setEditGoldVal] = useState("");
  const [editPlatVal, setEditPlatVal] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const prevTriggerRef = useRef(saveTierSettingsTrigger);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSaveSettings = async () => {
    try {
      await dispatch(
        updateLoyaltyTierSettings({
          qualificationSettings: qualification,
          benefitsMatrix: benefits,
        }),
      ).unwrap();
      showToast("Tier settings & benefits matrix saved successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save tier settings";
      showToast(msg);
    }
  };

  useEffect(() => {
    dispatch(fetchLoyaltyTiers());
  }, [dispatch]);

  // Sync state when tiersData loads
  useEffect(() => {
    if (tiersData) {
      if (tiersData.qualificationSettings) {
        setQualification(tiersData.qualificationSettings);
      }
      if (tiersData.benefitsMatrix && tiersData.benefitsMatrix.length > 0) {
        setBenefits(tiersData.benefitsMatrix);
      }
    }
  }, [tiersData]);

  // Handle Save changes triggered from Header
  useEffect(() => {
    if (saveTierSettingsTrigger > prevTriggerRef.current) {
      prevTriggerRef.current = saveTierSettingsTrigger;
      handleSaveSettings();
    }
  }, [saveTierSettingsTrigger, qualification, benefits]);

  const handleAddBenefit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenefitTitle.trim()) return;

    const newRow: TierBenefitRow = {
      id: `custom_${Date.now()}`,
      benefit: newBenefitTitle.trim(),
      silver: newSilverVal.trim() || "—",
      gold: newGoldVal.trim() || "—",
      platinum: newPlatVal.trim() || "—",
    };

    setBenefits([...benefits, newRow]);
    setNewBenefitTitle("");
    setNewSilverVal("—");
    setNewGoldVal("1 / month");
    setNewPlatVal("4 / month");
    setIsAddingBenefit(false);
    showToast("Benefit added to matrix. Click 'Save changes' to commit.");
  };

  const handleDeleteBenefit = (id: string) => {
    setBenefits(benefits.filter((b) => b.id !== id));
    showToast("Benefit removed. Click 'Save changes' to commit.");
  };

  const startEditBenefit = (item: TierBenefitRow) => {
    setEditingBenefitId(item.id);
    setEditBenefitTitle(item.benefit);
    setEditSilverVal(item.silver);
    setEditGoldVal(item.gold);
    setEditPlatVal(item.platinum);
  };

  const saveEditBenefit = (id: string) => {
    setBenefits(
      benefits.map((b) =>
        b.id === id
          ? {
              ...b,
              benefit: editBenefitTitle,
              silver: editSilverVal,
              gold: editGoldVal,
              platinum: editPlatVal,
            }
          : b,
      ),
    );
    setEditingBenefitId(null);
    showToast("Benefit updated. Click 'Save changes' to commit.");
  };

  // Helper to render cell value: Checkmark, Dash, or Text
  const renderCellValue = (val: string) => {
    const trimmed = (val || "").trim();
    if (trimmed === "✓" || trimmed.toLowerCase() === "true" || trimmed.toLowerCase() === "check") {
      return (
        <div className="flex items-center text-[#1f7a4d]">
          <Check className="h-4 w-4 stroke-[2.5]" />
        </div>
      );
    }
    if (trimmed === "—" || trimmed === "-" || !trimmed) {
      return <span className="text-[#55647a]">—</span>;
    }
    return <span className="text-[#0f2340] font-normal">{trimmed}</span>;
  };

  const tiers = tiersData?.tiers || [];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-[12px] bg-[#0f2340] px-4 py-2.5 text-white text-sm font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Row: 3 Tier Metric Cards (Figma 474:247477, 368px each, gap 16px) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {isLoading && tiers.length === 0 && (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-[179px] rounded-[16px] border border-[#dce2ea] bg-[#f5f7fa] animate-pulse"
              />
            ))}
          </>
        )}
        {tiers.map((tier) => {
          const isSilver = tier.code === "SILVER";
          const isGold = tier.code === "GOLD";
          const isPlat = tier.code === "PLATINUM";

          const dotColor = isSilver ? "#94a3b8" : isGold ? "#f59e0b" : "#1c3a66";
          const thresholdText = tier.maxPoints
            ? `${tier.minPoints.toLocaleString()}–${tier.maxPoints.toLocaleString()}`
            : `${tier.minPoints.toLocaleString()}+`;

          return (
            <div
              key={tier.id || tier.code}
              className="w-full bg-white border border-[#dce2ea] rounded-[16px] p-[21px] flex flex-col justify-between min-h-[179px] shadow-2xs"
            >
              {/* Card Header: Dot + Title + Tag (Figma 474:247479) */}
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: dotColor }}
                />
                <h3 className="text-[18px] font-extrabold text-[#0f2340] font-manrope">
                  {tier.name}
                </h3>
                <span className="text-[12px] font-medium text-[#3f4b5e] bg-[#f5f7fa] px-2 py-0.5 rounded-[6px] border border-[#dce2ea]/50">
                  {tier.tag || (isSilver ? "Entry tier" : isGold ? "Mid tier" : "Top tier")}
                </span>
              </div>

              {/* Card Middle: Big Census Numbers (Figma 474:247483) */}
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-[32px] font-black font-archivo text-[#0f2340] tracking-tight leading-none">
                  {tier.censusMembers || tier.memberCount.toLocaleString()}
                </span>
                <span className="text-[14px] font-normal text-[#3f4b5e] font-manrope">
                  members · {tier.censusShare || (isSilver ? "80%" : isGold ? "16%" : "4%")}
                </span>
              </div>

              {/* Card Footer: 3 Stats (Figma 474:247486) */}
              <div className="pt-[13px] border-t border-[#dce2ea] grid grid-cols-3 gap-2 items-start">
                <div>
                  <div className="text-[12px] font-medium text-[#3f4b5e]">Threshold · pts</div>
                  <div className="text-[14px] font-bold text-[#0f2340] mt-0.5">
                    {thresholdText}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] font-medium text-[#3f4b5e]">Earn</div>
                  <div className="text-[14px] font-bold text-[#0f2340] mt-0.5">
                    {tier.earnMultiplierText}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] font-medium text-[#3f4b5e]">30-day change</div>
                  <div className="text-[14px] font-bold text-[#1f7a4d] mt-0.5">
                    {tier.change30d || (isSilver ? "+3,120" : isGold ? "+640" : "+210")}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Bottom Row: Left Benefits Table (720px) & Right Qualification (400px) (Figma 474:247532) */}
      <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
        {/* Left Column: Benefits by tier (Figma 474:247533, 720px) */}
        <div className="w-full lg:w-[720px] shrink-0 bg-white border border-[#dce2ea] rounded-[16px] overflow-hidden shadow-2xs flex flex-col min-h-[466px]">
          {/* Header (Figma 474:247534) */}
          <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#dce2ea]/40">
            <div>
              <h3 className="text-[18px] font-extrabold text-[#0f2340] font-manrope">
                Benefits by tier
              </h3>
              <p className="text-[12px] font-medium text-[#3f4b5e] font-manrope mt-0.5">
                “Order in the app to earn faster” · counter & kiosk earn 1 pt/₹20 for all tiers
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingBenefit(true)}
              className="text-[14px] font-bold text-[#1c3a66] hover:text-[#0f2340] transition-colors cursor-pointer flex items-center gap-1"
            >
              + Add benefit
            </button>
          </div>

          {/* Add Benefit Inline Form */}
          {isAddingBenefit && (
            <form
              onSubmit={handleAddBenefit}
              className="p-4 bg-[#f8fafc] border-b border-[#dce2ea] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#0f2340] uppercase tracking-wider">
                  New Benefit Row
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingBenefit(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Benefit Title (e.g. Free delivery)"
                  value={newBenefitTitle}
                  onChange={(e) => setNewBenefitTitle(e.target.value)}
                  className="sm:col-span-1 h-9 px-3 rounded-lg border border-[#bcc6d3] text-sm bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Silver value (e.g. —)"
                  value={newSilverVal}
                  onChange={(e) => setNewSilverVal(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-[#bcc6d3] text-sm bg-white"
                />
                <input
                  type="text"
                  placeholder="Gold value (e.g. 1 / mo)"
                  value={newGoldVal}
                  onChange={(e) => setNewGoldVal(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-[#bcc6d3] text-sm bg-white"
                />
                <input
                  type="text"
                  placeholder="Platinum value (e.g. ✓)"
                  value={newPlatVal}
                  onChange={(e) => setNewPlatVal(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-[#bcc6d3] text-sm bg-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBenefit(false)}
                  className="h-8 px-3 rounded-lg border border-[#dce2ea] text-xs font-semibold text-gray-600 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-3 rounded-lg bg-[#1c3a66] text-white text-xs font-bold"
                >
                  Add to table
                </button>
              </div>
            </form>
          )}

          {/* Table Header (Figma 474:247539, height 36px, bg-[#f5f7fa]) */}
          <div className="h-9 px-5 bg-[#f5f7fa] border-y border-[#dce2ea] flex items-center text-[12px] font-bold text-[#3f4b5e]">
            <div className="w-[270px] shrink-0">Benefit</div>
            <div className="w-[120px] shrink-0">Silver</div>
            <div className="w-[120px] shrink-0">Gold</div>
            <div className="w-[120px] shrink-0">Platinum</div>
          </div>

          {/* Table Rows (Figma 474:247544...474:247582, height 48px each) */}
          <div className="flex-1 divide-y divide-[#dce2ea] flex flex-col">
            {benefits.map((row) => {
              const isEditing = editingBenefitId === row.id;

              if (isEditing) {
                return (
                  <div
                    key={row.id}
                    className="min-h-[48px] px-5 py-2 flex items-center bg-[#f1f5f9] gap-2"
                  >
                    <input
                      type="text"
                      value={editBenefitTitle}
                      onChange={(e) => setEditBenefitTitle(e.target.value)}
                      className="w-[270px] shrink-0 h-8 px-2 rounded border border-[#bcc6d3] text-xs bg-white font-bold"
                    />
                    <input
                      type="text"
                      value={editSilverVal}
                      onChange={(e) => setEditSilverVal(e.target.value)}
                      className="w-[110px] shrink-0 h-8 px-2 rounded border border-[#bcc6d3] text-xs bg-white"
                    />
                    <input
                      type="text"
                      value={editGoldVal}
                      onChange={(e) => setEditGoldVal(e.target.value)}
                      className="w-[110px] shrink-0 h-8 px-2 rounded border border-[#bcc6d3] text-xs bg-white"
                    />
                    <input
                      type="text"
                      value={editPlatVal}
                      onChange={(e) => setEditPlatVal(e.target.value)}
                      className="w-[110px] shrink-0 h-8 px-2 rounded border border-[#bcc6d3] text-xs bg-white"
                    />
                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        type="button"
                        onClick={() => saveEditBenefit(row.id)}
                        className="p-1 rounded bg-[#1c3a66] text-white hover:bg-[#0f2340]"
                        title="Save edit"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBenefitId(null)}
                        className="p-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={row.id}
                  className="min-h-[48px] px-5 flex items-center text-[14px] hover:bg-[#f8fafc]/90 transition-colors group"
                >
                  <div className="w-[270px] shrink-0 font-bold text-[#0f2340] pr-3 flex items-center justify-between">
                    <span>{row.benefit}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        type="button"
                        onClick={() => startEditBenefit(row)}
                        className="text-gray-400 hover:text-[#1c3a66] p-0.5"
                        title="Edit perk"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBenefit(row.id)}
                        className="text-gray-400 hover:text-red-500 p-0.5"
                        title="Delete perk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="w-[120px] shrink-0">{renderCellValue(row.silver)}</div>
                  <div className="w-[120px] shrink-0">{renderCellValue(row.gold)}</div>
                  <div className="w-[120px] shrink-0">{renderCellValue(row.platinum)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Qualification Settings (Figma 474:247589, 400px) */}
        <div className="w-full lg:w-[400px] shrink-0 bg-white border border-[#dce2ea] rounded-[16px] p-[21px] shadow-2xs flex flex-col gap-4 min-h-[466px]">
          {/* Card Header (Figma 474:279065) */}
          <div>
            <h3 className="text-[18px] font-extrabold text-[#0f2340] font-manrope">
              Qualification
            </h3>
            <p className="text-[12px] font-medium text-[#3f4b5e] font-manrope mt-0.5">
              How members move between tiers
            </p>
          </div>

          {/* Row 1: Qualification Window (Figma 474:247593) */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-bold text-[#0f2340] font-manrope">
              Qualification window
            </label>
            <select
              value={qualification.windowType}
              onChange={(e) =>
                setQualification({
                  ...qualification,
                  windowType: e.target.value,
                  windowMonths: e.target.value.includes("6") ? 6 : 12,
                })
              }
              className="w-full h-[40px] px-3.5 bg-white border border-[#bcc6d3] rounded-[12px] text-[16px] text-[#0f2340] font-manrope focus:outline-none focus:border-[#1c3a66] cursor-pointer"
            >
              <option value="12 months, rolling">12 months, rolling</option>
              <option value="Calendar year (Jan–Dec)">Calendar year (Jan–Dec)</option>
              <option value="6 months, rolling">6 months, rolling</option>
            </select>
            <span className="text-[12px] font-medium text-[#55647a] mt-0.5">
              Based on points earned, not current balance
            </span>
          </div>

          {/* Row 2: Downgrade Grace Period (Figma 474:247602) */}
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-bold text-[#0f2340] font-manrope">
              Downgrade grace period
            </label>
            <div className="w-full h-[40px] px-3.5 bg-white border border-[#bcc6d3] rounded-[12px] flex items-center justify-between">
              <input
                type="number"
                min="0"
                max="180"
                value={qualification.downgradeGracePeriodDays ?? qualification.gracePeriodDays ?? 30}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setQualification({
                    ...qualification,
                    gracePeriodDays: val,
                    downgradeGracePeriodDays: val,
                  });
                }}
                className="w-24 text-[16px] font-archivo font-extrabold text-[#0f2340] outline-none bg-transparent"
              />
              <span className="text-[12px] font-medium text-[#55647a]">days</span>
            </div>
          </div>

          {/* Row 3: Upgrade Instantly (Figma 474:284621) */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#0f2340] font-manrope">
                Upgrade instantly
              </span>
              <span className="text-[12px] font-medium text-[#3f4b5e] font-manrope mt-0.5">
                Push &quot;You&apos;re Gold now&quot; on crossing threshold
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={qualification.instantUpgrade}
              onClick={() =>
                setQualification({
                  ...qualification,
                  instantUpgrade: !qualification.instantUpgrade,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                qualification.instantUpgrade ? "bg-[#1c3a66]" : "bg-[#cbd5e1]"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md block transform transition-transform ${
                  qualification.instantUpgrade ? "translate-x-5.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Row 4: Grace Warning Callout (Figma 474:247613) */}
          <div className="p-3 rounded-[12px] bg-[#fef3c7] flex items-start gap-3 mt-1">
            <AlertTriangle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
            <div>
              <div className="text-[14px] font-bold text-[#0f2340] font-manrope">
                {qualification.membersInGrace} Gold members in grace
              </div>
              <div className="text-[12px] font-medium text-[#3f4b5e] font-manrope mt-0.5">
                Drop to Silver by {qualification.graceDeadline} unless they re-qualify
              </div>
            </div>
          </div>

          {/* Inline Action for quick mobile preview or instant commit */}
          <div className="mt-auto pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => dispatch(setIsPreviewMemberViewOpen(true))}
              className="w-full h-9 rounded-[12px] bg-white border border-[#bcc6d3] text-label text-[#0f2340] hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs font-bold"
            >
              Preview member view
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
