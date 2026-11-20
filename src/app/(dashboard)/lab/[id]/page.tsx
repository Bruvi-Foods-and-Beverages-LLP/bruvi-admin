"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchBatchDetail } from "@/store/slices/lab-slice";
import { LabHeader } from "@/components/lab/lab-header";
import { LabDetailKpiRow } from "@/components/lab/lab-detail-kpi-row";
import { DailySalesChart } from "@/components/lab/daily-sales-chart";
import { RatingsFeedbackCard } from "@/components/lab/ratings-feedback-card";
import { StoreBreakdownCard } from "@/components/lab/store-breakdown-card";
import { BatchIngredientsCard } from "@/components/lab/batch-ingredients-card";
import {
  EndEarlyDialog,
  ExtendWindowDialog,
  PromoteToMenuModal,
} from "@/components/lab/batch-actions-dialogs";
import { Loader2, Award, Calendar, AlertTriangle } from "lucide-react";

/**
 * A092 Lab Product Detail Page (Figma 474:244942)
 * Comprehensive telemetry for a single pilot batch: daily sales vs previous, sentiment, stores, BOM.
 */
export default function LabProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "batch_07";
  const dispatch = useAppDispatch();
  const { selectedBatchDetail, isLoading, error } = useAppSelector((state) => state.lab);

  const [isEndEarlyOpen, setIsEndEarlyOpen] = React.useState(false);
  const [isExtendOpen, setIsExtendOpen] = React.useState(false);
  const [isPromoteOpen, setIsPromoteOpen] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBatchDetail(id as string));
    }
  }, [dispatch, id]);

  const batch = selectedBatchDetail?.batch;
  const isLive = batch?.status === "LIVE";

  if (isLoading && !selectedBatchDetail) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1C3A66] mb-3" />
        <p className="text-label text-[#55647A]">Loading batch metrics & sensory telemetry...</p>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="py-16 max-w-xl mx-auto flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-heading-s text-[#0F2340]">Failed to load batch</h2>
        <p className="text-body-s text-[#55647A] mt-1 mb-6">
          {error || `Batch ${id} could not be found or retrieved.`}
        </p>
        <button
          onClick={() => dispatch(fetchBatchDetail(id as string))}
          className="h-9 px-4 rounded-[12px] bg-[#1C3A66] text-label text-white cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-16">
      {/* 1. Header with Status Badge & Actions */}
      <LabHeader
        backHref="/lab"
        overline={`BRUVI LAB · ${batch.batchCode}`}
        title={batch.name}
        description={`${batch.subtitle}. Pilot window: ${batch.windowLabel} across ${batch.storesCount} stores.`}
        badge={
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              isLive
                ? "bg-[#DCFCE7] text-[#15803D]"
                : batch.status === "PROMOTED"
                ? "bg-[#E8F5FD] text-[#1C3A66]"
                : "bg-[#EBEFF4] text-[#55647A]"
            }`}
          >
            {batch.statusLabel}
          </span>
        }
        actions={
          <>
            {isLive && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEndEarlyOpen(true)}
                  className="h-9 px-3.5 rounded-[12px] border border-[#dce2ea] bg-white hover:bg-[#FEE2E2]/40 text-label text-[#C0352B] transition-colors cursor-pointer shadow-2xs text-xs"
                >
                  <span>End early</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExtendOpen(true)}
                  className="h-9 px-3.5 rounded-[12px] border border-[#dce2ea] bg-white hover:bg-[#f5f7fa] text-label text-[#0F2340] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs text-xs"
                >
                  <Calendar className="h-3.5 w-3.5 text-[#55647A]" />
                  <span>Extend window</span>
                </button>
              </>
            )}

            {batch.status !== "PROMOTED" && (
              <button
                type="button"
                onClick={() => setIsPromoteOpen(true)}
                className="h-9 px-4 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <Award className="h-4 w-4 text-white" />
                <span>Promote to menu</span>
              </button>
            )}
          </>
        }
      />

      {/* 2. Top 5 KPI Summary Row */}
      <LabDetailKpiRow batch={batch} />

      {/* 3. 2-Column Telemetry Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left Column (8 cols ~ 720px) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <DailySalesChart
            data={selectedBatchDetail.dailySales}
            currentBatchLabel={batch.batchCode}
          />

          <RatingsFeedbackCard
            distribution={selectedBatchDetail.ratingsDistribution}
            sweetnessSentiment={selectedBatchDetail.sweetnessSentiment}
            quotes={selectedBatchDetail.customerQuotes}
          />
        </div>

        {/* Right Column (4 cols ~ 400px) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <StoreBreakdownCard stores={selectedBatchDetail.storeMetrics} />

          <BatchIngredientsCard ingredients={selectedBatchDetail.ingredients} />
        </div>
      </div>

      {/* Action Dialogs */}
      <EndEarlyDialog
        batch={batch}
        isOpen={isEndEarlyOpen}
        onClose={() => setIsEndEarlyOpen(false)}
        onSuccess={() => dispatch(fetchBatchDetail(id as string))}
      />

      <ExtendWindowDialog
        batch={batch}
        isOpen={isExtendOpen}
        onClose={() => setIsExtendOpen(false)}
        onSuccess={() => dispatch(fetchBatchDetail(id as string))}
      />

      <PromoteToMenuModal
        batch={batch}
        isOpen={isPromoteOpen}
        onClose={() => setIsPromoteOpen(false)}
        onSuccess={() => dispatch(fetchBatchDetail(id as string))}
      />
    </div>
  );
}

