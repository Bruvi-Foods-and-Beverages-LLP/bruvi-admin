"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchLabOverview } from "@/store/slices/lab-slice";
import { LabOverviewHeader } from "@/components/lab/lab-header";
import { LabOverviewKpiRow } from "@/components/lab/lab-overview-kpi-row";
import { LabPipelineKanban } from "@/components/lab/lab-pipeline-kanban";
import { LabBatchesTable } from "@/components/lab/lab-batches-table";
import { PromoteToMenuModal } from "@/components/lab/batch-actions-dialogs";
import { LabBatchItem } from "@/types/lab";
import { LabOverviewSkeleton } from "@/components/lab/lab-overview-skeleton";

/**
 * A090 Lab Products Overview Page (Figma 474:244225 / 474:244361)
 * Displays active batch telemetry, KPI cards, ideas pipeline Kanban, and batches table.
 */
export default function LabProductsPage() {
  const dispatch = useAppDispatch();
  const { overview, isLoading, error } = useAppSelector((state) => state.lab);
  const [selectedPromoteBatch, setSelectedPromoteBatch] = React.useState<LabBatchItem | null>(null);

  React.useEffect(() => {
    dispatch(fetchLabOverview());
  }, [dispatch]);

  const batches = overview?.batches || [];
  const pipeline = overview?.pipeline || [];
  const stats = overview?.stats;
  const liveBatch = overview?.liveBatch || batches.find((b) => b.status === "LIVE") || null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-16">
      {/* 1. Header (Figma 474:244362) */}
      <LabOverviewHeader />

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-[12px] bg-[#FEE2E2] border border-[#FCA5A5] text-body-s text-[#B91C1C]">
          {error}
        </div>
      )}

      {/* Loading state skeleton */}
      {isLoading && !overview ? (
        <LabOverviewSkeleton />
      ) : (
        <>
          {/* 2. Top Summary KPI Row (Figma 474:244380) */}
          <LabOverviewKpiRow stats={stats} liveBatch={liveBatch} />

          {/* 3. Ideas & Pipeline Kanban (Figma 474:244420) */}
          <LabPipelineKanban columns={pipeline} />

          {/* 4. Batches Table (Figma 474:244490) */}
          <LabBatchesTable
            batches={batches}
            onPromoteClick={(batch) => setSelectedPromoteBatch(batch)}
          />
        </>
      )}

      {/* Promote to Menu Dialog */}
      {selectedPromoteBatch && (
        <PromoteToMenuModal
          batch={selectedPromoteBatch}
          isOpen={!!selectedPromoteBatch}
          onClose={() => setSelectedPromoteBatch(null)}
          onSuccess={() => {
            dispatch(fetchLabOverview());
          }}
        />
      )}
    </div>
  );
}
