"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setActiveTab,
  setIsAdjustPointsOpen,
  setIsCreateRewardOpen,
  setIsCreatingNewRule,
  setIsPreviewMemberViewOpen,
  triggerSaveTierSettings,
  LoyaltyTab,
} from "@/store/slices/loyalty-slice";

/**
 * Loyalty Operations Header & Tabs (Figma 474:245791, 474:246175, 474:246584, 474:247280, 474:247625)
 * Matches 1136px width, Archivo Black 32px title, Libre Caslon 12px overline,
 * Manrope 14px buttons & 5 segmented navigation tabs with bottom border #dce2ea.
 */
export function LoyaltyHeader() {
  const dispatch = useAppDispatch();
  const { activeTab, isCreateRewardOpen, editingReward, isSubmitting } = useAppSelector(
    (state) => state.loyalty,
  );

  const tabs: { key: LoyaltyTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "rules", label: "Rules" },
    { key: "rewards", label: "Rewards" },
    { key: "tiers", label: "Tiers" },
    { key: "transactions", label: "Transactions" },
  ];

  const handleExportReport = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.open(`${baseUrl}/v1/admin/loyalty/export.csv?token=${token || ""}`, "_blank");
  };

  const isCreatingOrEditingReward = activeTab === "rewards" && isCreateRewardOpen;

  // Dynamic overline & title strictly matching Figma specs:
  // Overview (A100): Growth · BRUVI Rewards / Loyalty
  // Rules (A101): Loyalty / Rules / Earn & burn rules
  // Rewards (A102): Loyalty / Rewards / Rewards catalogue
  // Tiers (A104): Loyalty / Tiers / Customer tiers
  // Transactions (A105): Loyalty / Transactions / Points transactions
  const getHeaderTitles = () => {
    if (activeTab === "rules") {
      return {
        overline: "Loyalty / Rules",
        title: "Earn & burn rules",
      };
    }
    if (activeTab === "rewards") {
      if (isCreatingOrEditingReward) {
        return {
          overline: `Loyalty / Rewards / ${editingReward ? "Edit" : "New"}`,
          title: editingReward ? "Edit reward" : "Create reward",
        };
      }
      return {
        overline: "Loyalty / Rewards",
        title: "Rewards catalogue",
      };
    }
    if (activeTab === "tiers") {
      return {
        overline: "Loyalty / Tiers",
        title: "Customer tiers",
      };
    }
    if (activeTab === "transactions") {
      return {
        overline: "Loyalty / Transactions",
        title: "Points transactions",
      };
    }
    return {
      overline: "Growth · BRUVI Rewards",
      title: "Loyalty",
    };
  };

  const { overline, title } = getHeaderTitles();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. Top Row: Overline, Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
        {/* Title Block */}
        <div className="flex flex-col gap-1">
          <span className="text-overline-l text-[#3f4b5e] uppercase tracking-[1.68px]">
            {overline}
          </span>
          <h1 className="text-display-s text-[#0f2340]">
            {title}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isCreatingOrEditingReward ? (
            <button
              type="button"
              onClick={() => {
                dispatch(setIsCreateRewardOpen(false));
              }}
              className="h-9 px-4 rounded-[12px] bg-white border border-[#bcc6d3] text-label text-[#0f2340] hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs whitespace-nowrap"
            >
              ← Back to catalogue
            </button>
          ) : activeTab === "rules" ? (
            <>
              <button
                type="button"
                onClick={handleExportReport}
                className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs whitespace-nowrap"
              >
                View change log
              </button>
              <button
                type="button"
                onClick={() => dispatch(setIsCreatingNewRule(true))}
                className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-label text-white shadow-2xs transition-colors flex items-center justify-center cursor-pointer whitespace-nowrap"
              >
                New rule
              </button>
            </>
          ) : activeTab === "rewards" ? (
            <>
              <button
                type="button"
                onClick={handleExportReport}
                className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs whitespace-nowrap"
              >
                Export
              </button>
              <button
                type="button"
                onClick={() => dispatch(setIsCreateRewardOpen(true))}
                className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-label text-white shadow-2xs transition-colors flex items-center justify-center cursor-pointer whitespace-nowrap"
              >
                Create reward
              </button>
            </>
          ) : activeTab === "tiers" ? (
            <>
              <button
                type="button"
                onClick={() => dispatch(setIsPreviewMemberViewOpen(true))}
                className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs whitespace-nowrap"
              >
                Preview member view
              </button>
              <button
                type="button"
                onClick={() => dispatch(setIsAdjustPointsOpen(true))}
                className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-label text-white shadow-2xs transition-colors flex items-center justify-center cursor-pointer whitespace-nowrap"
              >
                Adjust points
              </button>
            </>
          ) : activeTab === "transactions" ? (
            <>
              <button
                type="button"
                onClick={handleExportReport}
                className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs whitespace-nowrap"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => dispatch(setIsAdjustPointsOpen(true))}
                className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-label text-white shadow-2xs transition-colors flex items-center justify-center cursor-pointer whitespace-nowrap"
              >
                Manual adjustment
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleExportReport}
                className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs whitespace-nowrap"
              >
                Export report
              </button>
              <button
                type="button"
                onClick={() => dispatch(setIsAdjustPointsOpen(true))}
                className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-label text-white shadow-2xs transition-colors flex items-center justify-center cursor-pointer whitespace-nowrap"
              >
                Adjust points
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Navigation Tabs (Figma 474:245977, 474:246361, 474:246770, 474:247466, 474:247811) */}
      <div className="flex flex-row gap-6 w-full h-[37px] border-b border-[#dce2ea] overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                dispatch(setActiveTab(tab.key));
                if (tab.key !== "rewards") {
                  dispatch(setIsCreateRewardOpen(false));
                }
              }}
              className={`h-[36px] flex items-center transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-b-2 border-[#1c3a66] text-label text-[#0f2340] pb-[2px] -mb-[1px]"
                  : "text-label-semi text-[#3f4b5e] hover:text-[#0f2340] pb-[2px]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
