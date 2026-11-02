"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useAppDispatch } from "@/store";
import { updateTimezone } from "@/store/slices/store-hours-slice";

interface TimezoneCardProps {
  timezone: string;
  timezoneLabel: string;
  currentTimeFormatted: string;
}

const TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata", label: "IST · Asia/Kolkata (UTC+5:30)" },
  { value: "Asia/Dubai", label: "GST · Asia/Dubai (UTC+4:00)" },
  { value: "Asia/Singapore", label: "SGT · Asia/Singapore (UTC+8:00)" },
  { value: "Europe/London", label: "BST · Europe/London (UTC+1:00)" },
];

export function TimezoneCard({
  timezone,
  currentTimeFormatted,
}: TimezoneCardProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full rounded-[16px] bg-surface border border-[#dce2ea] p-[21px] flex flex-col gap-3 shadow-2xs">
      {/* Header (Figma Node 225:87955: Manrope ExtraBold 18px / 26px) */}
      <h2 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">
        Timezone
      </h2>

      {/* Timezone Select (Figma Node 225:87956: 358x48, border: #7f8ca0, rounded-[12px], padding: 1px 17px) */}
      <div className="relative">
        <select
          value={timezone}
          onChange={(e) => {
            const selected = TIMEZONE_OPTIONS.find((t) => t.value === e.target.value);
            if (selected) {
              dispatch(
                updateTimezone({
                  timezone: selected.value,
                  label: selected.label,
                })
              );
            }
          }}
          className="w-full h-12 rounded-[12px] border border-[#7f8ca0] bg-surface px-[17px] pr-10 font-sans font-normal text-[16px] leading-[24px] text-[#0f2340] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1c3a66]/20 shadow-2xs"
        >
          {TIMEZONE_OPTIONS.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3f4b5e] pointer-events-none" />
      </div>

      {/* Current Store Time (Figma Node 225:87962: Manrope Medium 12px / 16px, color: #3f4b5e) */}
      <p className="font-sans font-medium text-[12px] leading-[16px] text-[#3f4b5e]">
        Store time now: {currentTimeFormatted}
      </p>
    </div>
  );
}
