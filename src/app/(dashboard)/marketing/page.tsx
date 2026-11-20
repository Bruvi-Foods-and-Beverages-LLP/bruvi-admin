"use client";

import React from "react";
import { useAppSelector } from "@/store";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingOverview } from "@/components/marketing/marketing-overview";
import { CampaignsListView } from "@/components/marketing/campaigns-list-view";
import { CreateCampaignModal } from "@/components/marketing/create-campaign-modal";
import { CouponsOverview } from "@/components/marketing/coupons/coupons-overview";

/**
 * Marketing & Campaigns Operations Center (Figma Node 474:241272 - A080 Campaign Dashboard)
 * Conforms strictly to 1136px design grid, 4px spacing units, Archivo & Manrope typography tokens.
 */
export default function MarketingPage() {
  const { activeTab } = useAppSelector((state) => state.marketing);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
      {/* 1. Header with Dynamic Overline, Title, Action Buttons and 5 Navigation Tabs (Figma 474:241312) */}
      <MarketingHeader />

      {/* 2. Main Tab View Content */}
      <main className="w-full flex flex-col gap-6">
        {activeTab === "overview" && <MarketingOverview />}
        {activeTab === "campaigns" && <CampaignsListView />}
        {activeTab === "audiences" && (
          <div className="w-full bg-white border border-[#dce2ea] rounded-[16px] p-8 text-center flex flex-col items-center justify-center gap-2 shadow-2xs font-manrope">
            <h3 className="text-heading-s text-[#0f2340]">Audience Builder (A084)</h3>
            <p className="text-body-s text-[#55647a] max-w-md">
              Segment and manage customer cohorts by LTV, recency, beverage preferences, and outlet visit frequency.
            </p>
          </div>
        )}
        {activeTab === "coupons" && <CouponsOverview />}
        {activeTab === "push" && (
          <div className="w-full bg-white border border-[#dce2ea] rounded-[16px] p-8 text-center flex flex-col items-center justify-center gap-2 shadow-2xs font-manrope">
            <h3 className="text-heading-s text-[#0f2340]">Push Dispatch (A085)</h3>
            <p className="text-body-s text-[#55647a] max-w-md">
              Targeted mobile notifications with rich media thumbnails, deep-links, and geo-fenced store triggers.
            </p>
          </div>
        )}
      </main>

      {/* 3. A082 Create Campaign Modal */}
      <CreateCampaignModal />
    </div>
  );
}
