"use client";

import * as React from "react";
import { SpecialDateItem } from "@/types/store-hours";
import { useAppDispatch } from "@/store";
import { setAddSpecialDateModalOpen } from "@/store/slices/store-hours-slice";

interface SpecialDatesCardProps {
  specialDates: SpecialDateItem[];
}

export function SpecialDatesCard({ specialDates }: SpecialDatesCardProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full rounded-[16px] bg-surface border border-[#dce2ea] overflow-hidden shadow-2xs">
      {/* Header (Figma Node 225:87918: 710x74, padding: 16px 20px, border-b: #dce2ea) */}
      <div className="px-5 py-4 border-b border-[#dce2ea] flex items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">
            Special dates
          </h2>
          <p className="font-sans font-medium text-[12px] leading-[16px] text-[#3f4b5e] mt-0.5">
            Holidays and one-off changes override weekly hours
          </p>
        </div>

        {/* Add date button (Figma Node 225:87922: 96x36, border-[1.5px] #bcc6d3, Manrope Bold 14px) */}
        <button
          type="button"
          onClick={() => dispatch(setAddSpecialDateModalOpen(true))}
          className="h-9 px-4 rounded-[12px] border-[1.5px] border-[#bcc6d3] bg-surface font-sans font-bold text-[14px] leading-[20px] text-[#0f2340] hover:bg-[#f5f7fa] hover:border-[#7f8ca0] transition-colors cursor-pointer shrink-0"
        >
          Add date
        </button>
      </div>

      {/* Special Date Rows (Figma Node 225:87924: 710x72 each, padding: 1px 20px 0px 20px, gap: 16px, border-b: #dce2ea) */}
      <div className="divide-y divide-[#dce2ea]">
        {specialDates.map((item) => (
          <div
            key={item.id}
            className="h-[72px] px-5 flex items-center justify-between gap-4 hover:bg-[#f5f7fa]/60 transition-colors"
          >
            {/* Left: Date Badge + Title/Subtitle (gap: 16px) */}
            <div className="flex items-center gap-4">
              {/* Date Badge (Figma Node 225:87925: 40x40, rounded-[8px]) */}
              <div
                className={`w-10 h-10 rounded-[8px] flex flex-col items-center justify-center shrink-0 select-none ${
                  item.isShortDay ? "bg-[#fdf0d8]" : "bg-[#f5f7fa]"
                }`}
              >
                {/* Month: Manrope Bold 11px / 14px */}
                <span
                  className={`font-sans font-bold text-[11px] leading-[14px] ${
                    item.isShortDay ? "text-[#9a5b00]" : "text-[#3f4b5e]"
                  }`}
                >
                  {item.month}
                </span>
                {/* Day number: Archivo ExtraBold 16px / 24px */}
                <span className="font-display font-extrabold text-[16px] leading-[24px] text-[#0f2340]">
                  {item.day}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h4 className="font-sans font-bold text-[14px] leading-[20px] text-[#0f2340]">
                  {item.title}
                </h4>
                <p className="font-sans font-medium text-[12px] leading-[16px] text-[#3f4b5e] mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>

            {/* Right: Hours Override (Manrope Regular 14px / 20px) */}
            <div className="shrink-0 text-right">
              {item.isShortDay ? (
                <span className="font-sans font-normal text-[14px] leading-[20px] text-[#9a5b00]">
                  {item.hours}
                </span>
              ) : (
                <span className="font-sans font-normal text-[14px] leading-[20px] text-[#0f2340]">
                  {item.hours}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
