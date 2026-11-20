"use client";

import React from "react";
import { useAppSelector } from "@/store";
import { LoyaltyHeader } from "@/components/loyalty/loyalty-header";
import { LoyaltyOverview } from "@/components/loyalty/loyalty-overview";
import { LoyaltyRules } from "@/components/loyalty/loyalty-rules";
import { RewardsCatalogue } from "@/components/loyalty/rewards-catalogue";
import { CreateRewardWorkspace } from "@/components/loyalty/create-reward-workspace";
import { CustomerTiers } from "@/components/loyalty/customer-tiers";
import { PointsTransactions } from "@/components/loyalty/points-transactions";
import { AdjustPointsModal } from "@/components/loyalty/adjust-points-modal";
import { PreviewTierModal } from "@/components/loyalty/preview-tier-modal";

/**
 * Omnichannel Loyalty & Rewards Operations Center (Figma Node 474:245927 & 474:247072 & 474:247416)
 * Conforms strictly to 1136px design grid, 4px spacing units, Archivo/Manrope/Caslon typography tokens.
 */
export default function LoyaltyPage() {
  const { activeTab, isCreateRewardOpen } = useAppSelector((state) => state.loyalty);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
      {/* 1. Header with Overline, Title, Action Buttons and 5 Navigation Tabs (Figma 474:245967, 474:247113 & 474:247457) */}
      <LoyaltyHeader />

      {/* 2. Main Tab View Content */}
      <main className="w-full flex flex-col gap-6">
        {activeTab === "overview" && <LoyaltyOverview />}
        {activeTab === "rules" && <LoyaltyRules />}
        {activeTab === "rewards" && (
          isCreateRewardOpen ? <CreateRewardWorkspace /> : <RewardsCatalogue />
        )}
        {activeTab === "tiers" && <CustomerTiers />}
        {activeTab === "transactions" && <PointsTransactions />}
      </main>

      {/* 3. A105 Manual Adjust Points Modal */}
      <AdjustPointsModal />

      {/* 4. A104 Preview Member View Modal */}
      <PreviewTierModal />
    </div>
  );
}
