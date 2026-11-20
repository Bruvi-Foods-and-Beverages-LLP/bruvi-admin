"use client";

import * as React from "react";
import { Check } from "lucide-react";

export interface PilotChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  warning?: boolean;
}

interface PilotChecklistCardProps {
  items?: PilotChecklistItem[];
  onToggleItem?: (id: string) => void;
}

const DEFAULT_PILOT_ITEMS: PilotChecklistItem[] = [
  { id: "1", label: "Recipe v3 approved · costed", completed: true },
  { id: "2", label: "Price, dates & pilot stores set", completed: true },
  { id: "3", label: "Feedback questions configured", completed: true },
  { id: "4", label: "Pandan syrup PO to Monin India", completed: true },
  { id: "5", label: "Final hero photo (shoot 6 Oct)", completed: false, warning: true },
  { id: "6", label: "Barista training at both stores", completed: false },
];

/**
 * PilotChecklistCard - A091 Ready to Pilot Checklist
 * Exact match to Figma Node #474:244870
 */
export function PilotChecklistCard({
  items = DEFAULT_PILOT_ITEMS,
  onToggleItem,
}: PilotChecklistCardProps) {
  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="rounded-[16px] border border-[#DCE2EA] bg-white p-[21px] flex flex-col gap-3">
      {/* Header Row (#474:244871) */}
      <div className="h-[26px] flex items-center justify-between">
        <h3 className="text-[18px] leading-[26px] font-extrabold text-[#0F2340] font-sans">
          Ready to pilot
        </h3>
        <span className="text-[14px] font-bold text-[#3F4B5E] font-sans">
          {completedCount} of {totalCount}
        </span>
      </div>

      {/* Checklist Rows (#474:244874) */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItem?.(item.id)}
            className="flex items-center gap-2 group cursor-pointer select-none"
          >
            {/* Status Indicator Icon */}
            {item.completed ? (
              <div className="w-5 h-5 rounded-full bg-[#1F7A4D] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </div>
            ) : item.warning ? (
              <div className="w-5 h-5 rounded-full border-[1.5px] border-[#9A5B00] shrink-0 group-hover:bg-[#FEF3E2] transition-colors" />
            ) : (
              <div className="w-5 h-5 rounded-full border-[1.5px] border-[#7F8CA0] shrink-0 group-hover:bg-[#F5F7FA] transition-colors" />
            )}

            {/* Item Label Text */}
            <span
              className={`text-[14px] leading-[20px] font-sans ${
                item.completed
                  ? "text-[#0F2340]"
                  : item.warning
                  ? "text-[#0F2340]"
                  : "text-[#3F4B5E]"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
