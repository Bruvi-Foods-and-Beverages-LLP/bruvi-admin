"use client";

import * as React from "react";
import { ChannelHoursItem } from "@/types/store-hours";
import { useAppDispatch } from "@/store";
import { updateChannelCutoff } from "@/store/slices/store-hours-slice";

const CUTOFF_OPTIONS = [0, 10, 15, 20, 30, 45, 60];

interface ChannelHoursCardProps {
  channelHours: ChannelHoursItem[];
}

export function ChannelHoursCard({ channelHours }: ChannelHoursCardProps) {
  const dispatch = useAppDispatch();
  return (
    <div className="w-full rounded-[16px] bg-surface border border-[#dce2ea] overflow-hidden shadow-2xs">
      {/* Header (Figma Node 225:154437: 710x74, padding: 16px 20px, border-b: #dce2ea) */}
      <div className="px-5 py-4 border-b border-[#dce2ea]">
        <h2 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">
          Channel hours
        </h2>
        <p className="font-sans font-medium text-[12px] leading-[16px] text-[#3f4b5e] mt-0.5">
          Cut-offs so the bar can clear orders before close
        </p>
      </div>

      {/* Channel Rows (Figma Node 225:87897: 710x56 each, padding: 1px 20px 0px 20px, gap: 16px, border-b: #dce2ea) */}
      <div className="divide-y divide-[#dce2ea]">
        {channelHours.map((channel) => (
          <div
            key={channel.channelId}
            className="h-14 px-5 flex items-center gap-4 hover:bg-[#f5f7fa]/60 transition-colors"
          >
            {/* Channel Name (w: 120px, Manrope Bold 14px, #0f2340) */}
            <div className="w-[120px] sm:w-[160px] shrink-0 font-sans font-bold text-[14px] leading-[20px] text-[#0f2340]">
              {channel.channelName}
            </div>

            {/* Middle Badge / Type (flex-1 text-left) */}
            <div className="flex-1 flex items-center justify-start">
              <label className="relative inline-flex items-center">
                <span className="sr-only">Cut-off before closing for {channel.channelName}</span>
                <select
                  value={channel.cutoffMinutesBeforeClose}
                  onChange={(e) =>
                    dispatch(
                      updateChannelCutoff({
                        channelId: channel.channelId,
                        minutes: Number(e.target.value),
                      })
                    )
                  }
                  className={
                    channel.badge
                      ? "appearance-none cursor-pointer px-2 py-1 rounded-[12px] bg-[#e8f5fd] text-[#22629e] font-sans font-bold text-[12px] leading-[16px] focus:outline-none focus:ring-2 focus:ring-[#1c3a66]/20"
                      : "appearance-none cursor-pointer bg-transparent font-sans font-normal text-[14px] leading-[20px] text-[#3f4b5e] focus:outline-none focus:ring-2 focus:ring-[#1c3a66]/20 rounded-[8px]"
                  }
                >
                  {(CUTOFF_OPTIONS.includes(channel.cutoffMinutesBeforeClose)
                    ? CUTOFF_OPTIONS
                    : [...CUTOFF_OPTIONS, channel.cutoffMinutesBeforeClose].sort((a, b) => a - b)
                  ).map((m) => (
                    <option key={m} value={m}>
                      {m === 0 ? "Same as store" : `${m} min cut-off`}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Time Range (w: 180px, align: right, Manrope Regular 14px, #0f2340) */}
            <div className="w-[180px] shrink-0 text-right font-sans font-normal text-[14px] leading-[20px] text-[#0f2340]">
              {channel.timeRange}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
