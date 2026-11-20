"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchLabPerformance } from "@/store/slices/lab-slice";
import { LabHeader } from "@/components/lab/lab-header";
import { BatchesComparisonTable } from "@/components/lab/batches-comparison-table";
import { ConversionFunnelCard } from "@/components/lab/conversion-funnel-card";
import { GraduationDecisionCard } from "@/components/lab/graduation-decision-card";
import {
  PromoteToMenuModal,
  ExtendWindowDialog,
} from "@/components/lab/batch-actions-dialogs";
import { Download, Award, Loader2 } from "lucide-react";
import { LabBatchItem } from "@/types/lab";

/**
 * A093 Lab Performance Analytics Page (Figma 474:245363)
 * Cross-batch comparison, 4-stage conversion funnel, and graduation checklist.
 */
export default function LabPerformancePage() {
  const dispatch = useAppDispatch();
  const { performance, isLoading, error } = useAppSelector((state) => state.lab);

  const [isPromoteOpen, setIsPromoteOpen] = React.useState(false);
  const [isExtendOpen, setIsExtendOpen] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchLabPerformance());
  }, [dispatch]);

  const activeBatch: LabBatchItem = {
    id: "batch_07",
    batchNumber: "07",
    batchCode: "BATCH 07 · LIVE",
    name: "Yuzu Matcha Tonic",
    subtitle: "Ceremonial matcha, yuzu, chilled tonic",
    pricePaise: 26000,
    status: "LIVE",
    statusLabel: "Live",
    windowLabel: "26 Sep – 10 Oct",
    storesCount: 6,
    cupsSold: 2340,
    totalCups: 4000,
    rating: 4.5,
    ratingCount: 312,
    wouldBuyAgainPct: 61,
    marginPct: 71,
    imagePath: "assets/images/bruvi_lab_tonic.png",
  };

  const batches = performance?.batches || [];
  const funnel = performance?.conversionFunnel || [];
  const decision = performance?.decision;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-16">
      {/* 1. Header with Export CSV & Promote Actions */}
      <LabHeader
        backHref="/lab"
        overline="BRUVI LAB · SENSORY ANALYTICS"
        title="Lab Performance"
        description="Compare cross-batch performance, conversion funnels, and graduation readiness to permanent menu."
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                // Download CSV mock or alert
                const csvContent =
                  "data:text/csv;charset=utf-8,Batch,Stores,Cups Sold,Rating,Repeat %\nB05,8,1610,4.0,52%\nB06,8,1980,4.2,48%\nB07,6,2340,4.5,61%";
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "bruvi_lab_performance.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="h-9 px-4 rounded-[12px] border border-[#dce2ea] bg-white hover:bg-[#f5f7fa] text-label text-[#0F2340] flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="h-4 w-4 text-[#55647A]" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPromoteOpen(true)}
              className="h-9 px-4 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            >
              <Award className="h-4 w-4 text-white" />
              <span>Promote Batch 07</span>
            </button>
          </>
        }
      />

      {error && (
        <div className="p-4 rounded-[12px] bg-[#FEE2E2] border border-[#FCA5A5] text-body-s text-[#B91C1C]">
          {error}
        </div>
      )}

      {isLoading && !performance ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1C3A66] mb-3" />
          <p className="text-label text-[#55647A]">Loading cross-batch sensory analytics...</p>
        </div>
      ) : (
        <>
          {/* 2. Last 3 Batches Comparison Table (Figma 474:245380) */}
          <BatchesComparisonTable batches={batches} />

          {/* 3. 2-Column Funnel & Decision Checklist (Figma 474:245450) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            {/* Left Column (7 cols ~ 660px) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <ConversionFunnelCard stages={funnel} batchName="Batch 07" />
            </div>

            {/* Right Column (5 cols ~ 450px) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {decision && (
                <GraduationDecisionCard
                  decision={decision}
                  onPromoteClick={() => setIsPromoteOpen(true)}
                  onExtendClick={() => setIsExtendOpen(true)}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Action Modals */}
      <PromoteToMenuModal
        batch={activeBatch}
        isOpen={isPromoteOpen}
        onClose={() => setIsPromoteOpen(false)}
        onSuccess={() => dispatch(fetchLabPerformance())}
      />

      <ExtendWindowDialog
        batch={activeBatch}
        isOpen={isExtendOpen}
        onClose={() => setIsExtendOpen(false)}
        onSuccess={() => dispatch(fetchLabPerformance())}
      />
    </div>
  );
}

