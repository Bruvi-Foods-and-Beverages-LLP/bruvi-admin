"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Download } from "lucide-react";

interface CampaignDetailHeaderProps {
  campaignName: string;
  campaignCode: string;
  onSaveDraft?: () => void;
  onContinue?: () => void;
}

/**
 * Campaign Detail Header (Figma 474:242157, 1136x115px)
 * - Breadcrumb: Marketing / Campaigns / [Campaign Name]
 * - Title: Campaign Name (e.g. Diwali Gift Cards)
 * - Actions: "Save draft" and "Continue to Offer"
 * - 5 Tabs: Overview, Campaigns, Audiences, Coupons, Push
 */
export function CampaignDetailHeader({
  campaignName,
  campaignCode,
  onSaveDraft,
  onContinue,
}: CampaignDetailHeaderProps) {
  const router = useRouter();

  const tabs = [
    { key: "overview", label: "Overview", href: "/marketing" },
    { key: "campaigns", label: "Campaigns", href: "/marketing" },
    { key: "audiences", label: "Audiences", href: "/marketing" },
    { key: "coupons", label: "Coupons", href: "/marketing" },
    { key: "push", label: "Push", href: "/marketing" },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Top Section: Breadcrumb, Title & Action Buttons (Figma 474:242158, 1136x62px) */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        {/* Left: Overline Breadcrumb + Title */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[14px] leading-[20px] font-normal text-[#3f4b5e] font-manrope">
            <Link href="/marketing" className="hover:text-[#0f2340] hover:underline transition-colors">
              Marketing
            </Link>
            <span>/</span>
            <Link href="/marketing" className="hover:text-[#0f2340] hover:underline transition-colors">
              Campaigns
            </Link>
            <span>/</span>
            <span className="text-[#0f2340] font-medium">{campaignName || "New"}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-display-s text-[#0f2340] font-archivo font-black tracking-[-1.05px]">
              {campaignName}
            </h1>
            {campaignCode && (
              <span className="h-6 px-2 rounded-[8px] bg-[#f5f7fa] border border-[#dce2ea] text-[12px] font-bold text-[#55647a] font-manrope flex items-center">
                {campaignCode}
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions (Figma 474:242162, 263x36px) */}
        <div className="flex items-center gap-2">
          {/* Save Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
            className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] bg-white text-[14px] leading-[20px] font-bold text-[#0f2340] hover:bg-gray-50 flex items-center justify-center transition-colors shadow-2xs cursor-pointer font-manrope"
          >
            Save draft
          </button>

          {/* Continue to Offer */}
          <button
            type="button"
            onClick={onContinue}
            className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-white text-[14px] leading-[20px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer font-manrope"
          >
            <span>Continue to Offer</span>
          </button>
        </div>
      </div>

      {/* 2. Tabs Row (Figma 474:289154, 1136x37px, gap: 24px) */}
      <div className="w-full h-9 border-b border-[#dce2ea] flex items-center gap-6">
        {tabs.map((tab) => {
          const isActive = tab.key === "campaigns";
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`h-full pb-0.5 flex items-center text-[14px] font-manrope transition-colors cursor-pointer ${
                isActive
                  ? "border-b-2 border-[#1c3a66] font-bold text-[#0f2340]"
                  : "font-semibold text-[#55647a] hover:text-[#0f2340]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

