"use client";

import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setActiveTab } from "@/store/slices/marketing-slice";
import { TimelineEvent, ColorTheme } from "@/types/marketing";

/**
 * Interactive Campaign Calendar Timeline (Figma 474:241350, 1136x199px)
 * - The Day Line is rendered strictly ON TOP of all ribbons and markers (z-30) without visual cuts.
 * - Dynamically pins to the real current date (day, weekday, month, and year).
 * - Responsive 28-31 day track spanning with mathematically exact column centering.
 */
export function CampaignCalendarTimeline() {
  const dispatch = useAppDispatch();
  const {
    timelineEvents,
    selectedMonth: storeSelectedMonth,
  } = useAppSelector((state) => state.marketing);

  // Dynamic real-time date context
  const dateInfo = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();
    const monthLong = now.toLocaleString("en-US", { month: "long" });
    const monthShort = now.toLocaleString("en-US", { month: "short" });
    const weekday = now.toLocaleString("en-US", { weekday: "short" });
    const totalDays = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

    return {
      currentDay,
      totalDays,
      monthLong,
      monthShort,
      weekday,
      currentYear,
      monthYear: `${monthLong} ${currentYear}`,
      formattedToday: `Today ${weekday} ${currentDay} ${monthShort}`,
    };
  }, []);

  const currentDay = dateInfo.currentDay;
  const totalDaysInMonth = dateInfo.totalDays;
  const displayMonth = storeSelectedMonth || dateInfo.monthYear;

  // Generate days array (1..totalDaysInMonth)
  const days = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  // Theme helper for ribbon styles
  const getRibbonClasses = (theme: ColorTheme) => {
    switch (theme) {
      case "matcha":
        return "bg-[#ebf1de] border border-[#566f2c] text-[#0f2340]";
      case "sky":
        return "bg-[#e0f2fe] border border-[#0284c7] text-[#0f2340]";
      case "coffee":
        return "bg-[#f3e8df] border border-[#6b4430] text-[#0f2340]";
      case "purple":
        return "bg-[#ede9fe] border border-[#7c3aed] text-[#0f2340]";
      case "amber":
        return "bg-[#fef3c7] border border-[#d97706] text-[#0f2340]";
      case "navy":
      default:
        return "bg-[#e8f5fd] border border-[#1c3a66] text-[#0f2340]";
    }
  };

  const getMarkerBg = (theme: ColorTheme) => {
    switch (theme) {
      case "matcha":
        return "bg-[#566f2c]";
      case "sky":
        return "bg-[#a9d8f3]";
      case "coffee":
        return "bg-[#6b4430]";
      case "purple":
        return "bg-[#7c3aed]";
      case "amber":
        return "bg-[#d97706]";
      case "navy":
      default:
        return "bg-[#1c3a66]";
    }
  };

  // Exact horizontal center position of current day column (0% to 100%)
  const todayPercent = ((currentDay - 0.5) / totalDaysInMonth) * 100;

  return (
    <div className="w-full min-h-[199px] bg-white border border-[#dce2ea] rounded-[16px] p-[21px] flex flex-col gap-3 shadow-2xs overflow-hidden">
      {/* 1. Header Row (Figma 474:241351, 1094x26px) */}
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left: Dynamic Month Title + Real-time Subtitle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-2 sm:gap-3">
          <h2 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340] font-manrope">
            {displayMonth} calendar
          </h2>
          <span className="text-[12px] leading-[16px] font-medium text-[#3f4b5e] font-manrope">
            {dateInfo.formattedToday} · Come back to Phin runs always-on (WhatsApp)
          </span>
        </div>

        {/* Right: Open Calendar Link */}
        <button
          type="button"
          onClick={() => dispatch(setActiveTab("campaigns"))}
          className="text-[14px] leading-[20px] font-bold text-[#1c3a66] hover:underline cursor-pointer font-manrope shrink-0"
        >
          Open calendar →
        </button>
      </div>

      {/* 2. Days Number Bar (Figma 474:241356, height 19px) */}
      <div className="w-full h-[19px] border-b border-[#dce2ea] pb-[5px] flex items-center relative">
        {days.map((day) => {
          const isToday = day === currentDay;
          return (
            <div
              key={day}
              className={`flex-1 text-center text-[11px] leading-[14px] font-manrope tracking-[0.44px] transition-colors select-none ${
                isToday
                  ? "text-[#1c3a66] font-black"
                  : "text-[#55647a] font-bold"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* 3. Timeline Tracks Area (Figma 474:241388, height 88px) */}
      <div className="w-full min-h-[88px] relative flex flex-col justify-between py-1">
        {/* Track Rows */}
        {timelineEvents.map((event) => {
          const totalDays = totalDaysInMonth;
          const isRibbon = event.type === "ribbon" || event.startDay !== event.endDay;

          if (isRibbon) {
            // Span across days
            const leftPercent = ((event.startDay - 1) / totalDays) * 100;
            const widthPercent = ((event.endDay - event.startDay + 1) / totalDays) * 100;

            return (
              <div key={event.id} className="w-full h-6 relative flex items-center z-0">
                <div
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                  className={`absolute h-6 rounded-[4px] px-2.5 flex items-center shadow-2xs transition-all ${getRibbonClasses(
                    event.colorTheme,
                  )}`}
                  title={`${event.title} (${event.note || ""})`}
                >
                  <span className="text-[12px] leading-[16px] font-bold font-manrope truncate">
                    {event.title}
                  </span>
                </div>
              </div>
            );
          }

          // Single-Day Event Marker (Figma 474:241392 / 474:241396)
          const markerLeftPercent = ((event.startDay - 1) / totalDays) * 100;
          const markerWidthPercent = (1 / totalDays) * 100;

          return (
            <div key={event.id} className="w-full h-6 relative flex items-center z-0">
              {/* Marker Tile on specific day */}
              <div
                style={{
                  left: `${markerLeftPercent}%`,
                  width: `${markerWidthPercent}%`,
                }}
                className={`absolute h-6 rounded-[4px] shadow-2xs ${getMarkerBg(
                  event.colorTheme,
                )}`}
              />

              {/* Text label immediately to the right */}
              <div
                style={{
                  left: `calc(${markerLeftPercent}% + ${markerWidthPercent}% + 8px)`,
                }}
                className="absolute flex items-center whitespace-nowrap"
                title={`${event.title} (${event.note || ""})`}
              >
                <span className="text-[12px] leading-[16px] font-bold text-[#0f2340] font-manrope">
                  {event.title}
                </span>
              </div>
            </div>
          );
        })}

        {/* 
          CRITICAL: Today Vertical Navy Indicator Line & Pin (Figma 474:241400)
          - Rendered strictly ON TOP of all tracks & ribbons with zIndex: 50.
          - Reaches from the top day number divider (-top-[13px]) down through all tracks (bottom-0).
          - Features a top pin head dot placed above the green ribbon.
          - Centered dynamically on the current date: calc(todayPercent - 1px).
        */}
        <div
          style={{ left: `calc(${todayPercent}% - 1px)`, zIndex: 50 }}
          className="absolute -top-[13px] bottom-0 w-[2px] bg-[#1c3a66] pointer-events-none transition-all duration-300"
          title={`Today: ${dateInfo.formattedToday}`}
        >
          {/* Top connecting pin head at the date row border */}
          <div className="w-2.5 h-2.5 -ml-[4px] -mt-[4px] rounded-full bg-[#1c3a66] ring-2 ring-white shadow-xs" />
        </div>
      </div>
    </div>
  );
}
