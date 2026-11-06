"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { StoreEntity } from "@/store/slices/stores-slice";
import { fetchStoreHours } from "@/store/slices/store-hours-slice";
import { WeeklyHoursCard } from "./weekly-hours-card";
import { ChannelHoursCard } from "./channel-hours-card";
import { SpecialDatesCard } from "./special-dates-card";
import { CustomerPreviewCard } from "./customer-preview-card";
import { TimezoneCard } from "./timezone-card";
import { CopyToStoresModal } from "./copy-to-stores-modal";
import { AddSpecialDateModal } from "./add-special-date-modal";
import { AlertCircle } from "lucide-react";

interface StoreHoursTabProps {
  store: StoreEntity;
}

export function StoreHoursTab({ store }: StoreHoursTabProps) {
  const dispatch = useAppDispatch();
  const { currentStoreHours, isLoading, error, saveError } = useAppSelector(
    (state) => state.storeHours
  );

  React.useEffect(() => {
    if (store?.id || store?.code) {
      dispatch(fetchStoreHours(store.code || store.id));
    }
  }, [dispatch, store?.id, store?.code]);

  if (isLoading || !currentStoreHours) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full animate-pulse">
        <div className="w-full lg:w-[712px] flex flex-col gap-6 shrink-0">
          <div className="h-[504px] rounded-[16px] bg-surface border border-[#dce2ea]" />
          <div className="h-[300px] rounded-[16px] bg-surface border border-[#dce2ea]" />
          <div className="h-[220px] rounded-[16px] bg-surface border border-[#dce2ea]" />
        </div>
        <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
          <div className="h-[232px] rounded-[16px] bg-surface border border-[#dce2ea]" />
          <div className="h-[156px] rounded-[16px] bg-surface border border-[#dce2ea]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 rounded-[16px] bg-surface border border-[#dce2ea] text-center flex flex-col items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error-surface text-error mb-3">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h3 className="text-heading-s text-text">Failed to load hours</h3>
        <p className="text-body-s text-text-muted max-w-sm mt-1 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => dispatch(fetchStoreHours(store.code || store.id))}
          className="h-9 px-4 rounded-[12px] bg-primary text-white text-label font-bold hover:bg-navy-900 transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {saveError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-[12px] border border-error/30 bg-error-surface px-4 py-3 text-body-s text-error"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {saveError}
        </div>
      )}
      {!currentStoreHours.isConfigured && (
        <div className="rounded-[12px] border border-[#dce2ea] bg-[#fdf0d8] px-4 py-3 text-body-s text-[#9a5b00]">
          No opening hours are saved for this store yet. Set the weekly hours below and save.
        </div>
      )}
      {/* 2-Column Layout (Figma Node 225:87687: 712px Left, 400px Right, gap: 24px) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Left Column (Figma Node 225:87756: 712px) */}
        <div className="w-full lg:w-[712px] flex flex-col gap-6 shrink-0">
          {/* Weekly Hours Table Card (Figma Node 225:87757: 712x504) */}
          <WeeklyHoursCard weeklyHours={currentStoreHours.weeklyHours} />

          {/* Channel Cut-offs Card (Figma Node 225:87893: 712x300) */}
          <ChannelHoursCard channelHours={currentStoreHours.channelHours} />

          {/* Special Dates & Holidays Card (Figma Node 225:87917: 712x220) */}
          <SpecialDatesCard
            specialDates={currentStoreHours.specialDates}
            storeCode={store.code || store.id}
          />
        </div>

        {/* Right Column (Figma Node 225:87940: 400px) */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
          {/* Customer Preview Card (Figma Node 225:87941: 400x232) */}
          <CustomerPreviewCard preview={currentStoreHours.customerPreview} />

          {/* Timezone Card (Figma Node 225:87954: 400x156) */}
          <TimezoneCard
            timezone={currentStoreHours.timezone}
            timezoneLabel={currentStoreHours.timezoneLabel}
            currentTimeFormatted={currentStoreHours.currentTimeFormatted}
          />
        </div>
      </div>

      {/* Modal Dialogs */}
      <CopyToStoresModal currentStoreCode={store.code || store.id} />
      <AddSpecialDateModal currentStoreCode={store.code || store.id} />
    </div>
  );
}
