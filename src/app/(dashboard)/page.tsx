"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDashboardFeed } from "@/store/slices/dashboard-slice";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KpiMetricCards } from "@/components/dashboard/kpi-metric-cards";
import { StoresTodayTable } from "@/components/dashboard/stores-today-table";
import { NeedsAttentionCard } from "@/components/dashboard/needs-attention-card";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { feed, isLoading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardFeed());
  }, [dispatch]);

  const handleExport = () => {
    if (!feed) return;
    const blob = new Blob([JSON.stringify(feed, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bruvi-hq-dashboard-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenReport = () => {
    alert("Daily Operations Report is generated.");
  };

  if (isLoading && !feed) {
    return (
      <div className="max-w-[1136px] mx-auto w-full flex flex-col gap-6 animate-pulse py-2">
        {/* Header Skeleton */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="h-3 w-32 bg-[#e2e8f0] rounded" />
            <div className="h-9 w-64 bg-[#cbd5e1] rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-[#e2e8f0] rounded-xl" />
            <div className="h-9 w-36 bg-[#e2e8f0] rounded-xl" />
          </div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="h-[160px] bg-[#1e293b] rounded-[16px]" />
          <div className="h-[160px] bg-[#f1f5f9] border border-[#dce2ea] rounded-[16px]" />
          <div className="h-[160px] bg-[#f1f5f9] border border-[#dce2ea] rounded-[16px]" />
          <div className="h-[160px] bg-[#f1f5f9] border border-[#dce2ea] rounded-[16px]" />
          <div className="h-[160px] bg-[#f1f5f9] border border-[#dce2ea] rounded-[16px]" />
        </div>

        {/* Bottom Section Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="h-[522px] flex-1 bg-[#f8fafc] border border-[#dce2ea] rounded-[16px]" />
          <div className="h-[522px] w-full lg:w-[400px] bg-[#f8fafc] border border-[#dce2ea] rounded-[16px]" />
        </div>
      </div>
    );
  }

  if (error && !feed) {
    return (
      <div className="max-w-[1136px] mx-auto w-full py-16 text-center space-y-4">
        <div className="text-red-600 font-sans font-bold text-lg">
          Failed to load HQ Dashboard: {error}
        </div>
        <button
          onClick={() => dispatch(fetchDashboardFeed())}
          className="px-4 py-2 bg-[#1c3a66] text-white rounded-lg font-sans font-semibold text-sm hover:bg-[#152e52]"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1136px] mx-auto w-full flex flex-col gap-6 py-2">
      {/* 1. Header with greeting and actions */}
      <DashboardHeader
        greeting={feed?.greeting}
        updatedAtFormatted={feed?.updatedAtFormatted}
        onExport={handleExport}
        onOpenReport={handleOpenReport}
      />

      {/* 2. Top 5 KPI Metrics Row */}
      {feed?.kpi && <KpiMetricCards kpi={feed.kpi} />}

      {/* 3. Bottom Section: Stores today (720px) + Needs attention (400px) */}
      <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
        <StoresTodayTable
          totalStores={feed?.storesToday.totalStores}
          topStores={feed?.storesToday.topStores}
        />
        <NeedsAttentionCard
          count={feed?.needsAttention.count}
          items={feed?.needsAttention.items}
        />
      </div>
    </div>
  );
}
