"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { useAppDispatch } from "@/store";
import { DayHours } from "@/types/store-hours";
import {
  toggleDayOpen,
  updateDayHours,
  applyMondayToAllDays,
} from "@/store/slices/store-hours-slice";
import { cn } from "@/lib/utils/cn";

interface WeeklyHoursCardProps {
  weeklyHours: DayHours[];
}

/** Every half hour of the day, "12:00 am" … "11:30 pm". */
const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h24 = Math.floor(i / 2);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${i % 2 === 0 ? "00" : "30"} ${h24 >= 12 ? "pm" : "am"}`;
});

/** The list plus the stored value when it sits off the half-hour grid (e.g. 6:45 am). */
function optionsWith(value: string): string[] {
  return TIME_OPTIONS.includes(value) ? TIME_OPTIONS : [value, ...TIME_OPTIONS];
}

export function WeeklyHoursCard({ weeklyHours }: WeeklyHoursCardProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full rounded-[16px] bg-surface border border-[#dce2ea] overflow-hidden shadow-2xs">
      {/* Header (Figma Node 225:87758: 710x74, padding: 16px 20px) */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">
            Weekly hours
          </h2>
          <p className="font-sans font-medium text-[12px] leading-[16px] text-[#3f4b5e] mt-0.5">
            Store opening hours · all channels follow these unless overridden below
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(applyMondayToAllDays())}
          className="font-sans font-bold text-[14px] leading-[20px] text-[#1c3a66] hover:underline cursor-pointer text-left sm:text-right shrink-0"
        >
          Apply Mon to all days
        </button>
      </div>

      {/* Table Header (Figma Node 225:87763: 710x36, padding: 1px 20px, gap: 16px, border: #dce2ea) */}
      <div className="h-9 px-5 bg-[#f5f7fa] border-y border-[#dce2ea] flex items-center gap-4 text-[12px] font-bold text-[#3f4b5e] leading-[16px] font-sans select-none">
        <div className="w-[120px] shrink-0">Day</div>
        <div className="w-[64px] shrink-0">Open</div>
        <div className="w-[120px] shrink-0">Opens</div>
        <div className="w-[120px] shrink-0">Closes</div>
        <div className="w-[182px] flex-1 text-right">Total</div>
      </div>

      {/* Day Rows (Figma Node 225:87769: 710x56 each, padding: 0px 20px 1px 20px, gap: 16px, border-b: #dce2ea) */}
      <div className="divide-y divide-[#dce2ea]">
        {weeklyHours.map((day) => (
          <div
            key={day.day}
            className={cn(
              "h-14 px-5 flex items-center gap-4 transition-colors",
              day.isToday ? "bg-[#f5f7fa]" : "bg-surface hover:bg-[#f5f7fa]/60"
            )}
          >
            {/* DAY NAME + TODAY BADGE (Figma Node 225:87770) */}
            <div className="w-[120px] shrink-0 flex items-center gap-2">
              <span className="font-sans font-bold text-[14px] leading-[20px] text-[#0f2340]">
                {day.day}
              </span>
              {day.isToday && (
                <span className="h-5 px-2 rounded-[4px] bg-[#e8f5fd] text-[#22629e] font-sans font-bold text-[11px] leading-[14px] flex items-center shrink-0">
                  Today
                </span>
              )}
            </div>

            {/* OPEN TOGGLE SWITCH (Figma Node 225:87772: 40x24 container, 20x20 knob, fill: #1c3a66) */}
            <div className="w-[64px] shrink-0 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={day.isOpen}
                onClick={() => dispatch(toggleDayOpen(day.day))}
                className={cn(
                  "w-10 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 focus:outline-none focus:ring-2 focus:ring-[#1c3a66]/20",
                  day.isOpen ? "bg-[#1c3a66]" : "bg-[#bcc6d3]"
                )}
              >
                <span
                  className={cn(
                    "block w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200",
                    day.isOpen ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* OPENS PILL (Figma Node 225:87775: 120x36, border: #7f8ca0, padding: 1px 13px, text left, clock right) */}
            <div className="w-[120px] shrink-0">
              <div
                className={cn(
                  "relative w-[120px] h-9 rounded-[12px] border border-[#7f8ca0] bg-surface px-3 flex items-center justify-between transition-opacity",
                  !day.isOpen && "opacity-40 pointer-events-none bg-[#f5f7fa] border-[#dce2ea]"
                )}
              >
                <select
                  value={day.opens}
                  disabled={!day.isOpen}
                  onChange={(e) =>
                    dispatch(
                      updateDayHours({
                        day: day.day,
                        opens: e.target.value,
                      })
                    )
                  }
                  className="w-full bg-transparent font-sans font-normal text-[14px] leading-[20px] text-[#0f2340] focus:outline-none cursor-pointer appearance-none pr-4"
                >
                  {optionsWith(day.opens).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <Clock className="w-4 h-4 text-[#55647a] shrink-0 pointer-events-none absolute right-3" />
              </div>
            </div>

            {/* CLOSES PILL (Figma Node 225:87783: 120x36, border: #7f8ca0, padding: 1px 13px, text left, clock right) */}
            <div className="w-[120px] shrink-0">
              <div
                className={cn(
                  "relative w-[120px] h-9 rounded-[12px] border border-[#7f8ca0] bg-surface px-3 flex items-center justify-between transition-opacity",
                  !day.isOpen && "opacity-40 pointer-events-none bg-[#f5f7fa] border-[#dce2ea]"
                )}
              >
                <select
                  value={day.closes}
                  disabled={!day.isOpen}
                  onChange={(e) =>
                    dispatch(
                      updateDayHours({
                        day: day.day,
                        closes: e.target.value,
                      })
                    )
                  }
                  className="w-full bg-transparent font-sans font-normal text-[14px] leading-[20px] text-[#0f2340] focus:outline-none cursor-pointer appearance-none pr-4"
                >
                  {optionsWith(day.closes).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <Clock className="w-4 h-4 text-[#55647a] shrink-0 pointer-events-none absolute right-3" />
              </div>
            </div>

            {/* TOTAL (Figma Node 225:87788: 182x20, align: right, Manrope SemiBold 14px, color: #3f4b5e) */}
            <div className="w-[182px] flex-1 text-right">
              {day.isOpen ? (
                <span className="font-sans font-semibold text-[14px] leading-[20px] text-[#3f4b5e]">
                  {day.totalFormatted}
                </span>
              ) : (
                <span className="font-sans italic text-[14px] leading-[20px] text-[#7f8ca0]">
                  Closed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
