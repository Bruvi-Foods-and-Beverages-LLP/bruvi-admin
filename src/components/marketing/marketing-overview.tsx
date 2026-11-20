"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { fetchMarketingOverview } from "@/store/slices/marketing-slice";
import { MarketingKpiGrid } from "./marketing-kpi-grid";
import { CampaignCalendarTimeline } from "./campaign-calendar-timeline";
import { LiveCampaignsSection } from "./live-campaigns-section";
import { ChannelPerformanceCard } from "./channel-performance-card";

/**
 * Marketing Dashboard Overview Tab (Figma 474:241272)
 * Orchestrates KPI stats cards, calendar timeline, live campaigns, and channel performance.
 */
export function MarketingOverview() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMarketingOverview());
  }, [dispatch]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. KPI Stats Cards (Figma 474:241333, 1136x124px) */}
      <MarketingKpiGrid />

      {/* 2. Interactive Calendar Timeline (Figma 474:241350, 1136x199px) */}
      <CampaignCalendarTimeline />

      {/* 3. Lower Section: Live Now (720px) + Channel Performance (400px) (Figma 474:241401, 1136x278px) */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-4">
        {/* Left Column (720px) */}
        <div className="w-full lg:flex-1 min-w-0">
          <LiveCampaignsSection />
        </div>

        {/* Right Column (400px) */}
        <ChannelPerformanceCard />
      </div>
    </div>
  );
}

