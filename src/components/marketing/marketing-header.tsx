"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setActiveTab, setIsCreateCampaignOpen } from "@/store/slices/marketing-slice";
import { MarketingTab } from "@/types/marketing";
import { Plus, Download } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Marketing Page Header (Figma 474:241312, 1136x115px)
 * Dynamic overline, title, primary/secondary action buttons, and 5 navigation tabs.
 */
export function MarketingHeader() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { activeTab, selectedMonth } = useAppSelector((state) => state.marketing);

  const tabs: { key: MarketingTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "campaigns", label: "Campaigns" },
    { key: "audiences", label: "Audiences" },
    { key: "coupons", label: "Coupons" },
    { key: "push", label: "Push" },
  ];

  const getHeaderInfo = () => {
    switch (activeTab) {
      case "campaigns":
        return {
          overline: "Marketing / Campaigns",
          title: "All campaigns",
        };
      case "audiences":
        return {
          overline: "Growth / Marketing · Segments",
          title: "Audience builder",
        };
      case "coupons":
        return {
          overline: "Growth / Marketing · Promotions",
          title: "Coupons",
        };
      case "push":
        return {
          overline: "Growth / Marketing · Channels",
          title: "Push dispatch",
        };
      case "overview":
      default:
        return {
          overline: `Growth / Marketing · ${selectedMonth}`,
          title: "Campaigns overview",
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Top Section: Overline, Title, and Actions (Figma 474:241313, 1136x62px) */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        {/* Left: Overline & Title */}
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-normal text-[#3f4b5e] font-manrope">
            {headerInfo.overline}
          </span>
          <h1 className="text-display-s text-[#0f2340] font-archivo font-black tracking-[-1.05px]">
            {headerInfo.title}
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Export Report */}
          {activeTab !== "coupons" && (
          <button
            type="button"
            onClick={() => {
              // Trigger CSV / report export
              const blob = new Blob(["Campaign,Channel,Status,Revenue\nMonsoon Matcha,Push + in-app,Live,286900\nCome back to Phin,WhatsApp,Live,264300"], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `marketing-report-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
            }}
            className="h-9 px-[17.5px] rounded-[12px] border border-[#bcc6d3] bg-white text-[14px] font-bold text-[#0f2340] hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#55647a]" />
            <span>Export</span>
          </button>
          )}

          {/* New Campaign */}
          <button
            type="button"
            onClick={() =>
              activeTab === "coupons"
                ? router.push("/marketing/coupons/new")
                : dispatch(setIsCreateCampaignOpen(true))
            }
            className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-white text-[14px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
            <span>{activeTab === "coupons" ? "New coupon" : "New campaign"}</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs (Figma 474:241322, 1136x37px) */}
      <div className="w-full h-[37px] border-b border-[#dce2ea] flex items-center gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => dispatch(setActiveTab(tab.key))}
              className={`h-[36px] flex items-center text-[14px] font-bold font-manrope transition-colors cursor-pointer relative ${
                isActive
                  ? "text-[#0f2340] border-b-2 border-[#1c3a66]"
                  : "text-[#3f4b5e] hover:text-[#0f2340]"
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

