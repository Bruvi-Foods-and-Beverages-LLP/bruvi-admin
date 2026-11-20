"use client";

import * as React from "react";
import { Check, AlertCircle, Clock, Award, Calendar } from "lucide-react";
import { LabDecisionData } from "@/types/lab";

interface GraduationDecisionCardProps {
  decision: LabDecisionData;
  onPromoteClick: () => void;
  onExtendClick: () => void;
}

export function GraduationDecisionCard({
  decision,
  onPromoteClick,
  onExtendClick,
}: GraduationDecisionCardProps) {
  return (
    <div className="rounded-[16px] border border-[#dce2ea] bg-white p-5 shadow-2xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1.5 pb-3 border-b border-[#dce2ea]">
        <div className="flex items-center justify-between">
          <span className="text-overline tracking-[1.54px] text-[#55647A] uppercase font-bold">
            GRADUATION DECISION
          </span>
          <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3E2] text-[#B45309] border border-[#FDE68A]">
            {decision.criteriaMet} of {decision.criteriaTotal} criteria met
          </span>
        </div>
        <h3 className="text-title text-[#0F2340] leading-snug">
          {decision.title}
        </h3>
        <span className="text-[12px] text-[#55647A]">
          Due: {decision.dueDate} · End of 15-day pilot
        </span>
      </div>

      {/* Recommendation Box */}
      <div className="p-3.5 rounded-[12px] bg-[#EBF1DE] border border-[#C6D8A8] text-[#566F2C] flex flex-col gap-1">
        <span className="text-[11px] font-bold uppercase tracking-wider">
          HQ R&amp;D RECOMMENDATION
        </span>
        <p className="text-caption-bold text-[#0F2340] leading-relaxed">
          {decision.recommendation}
        </p>
      </div>

      {/* Sensory Observation Note */}
      <div className="p-3 rounded-[12px] bg-[#F5F7FA] border border-[#EBEFF4] flex flex-col gap-1">
        <span className="text-[11px] font-bold text-[#55647A] uppercase tracking-wider">
          RECIPE ADJUSTMENT NOTE
        </span>
        <p className="text-[12px] text-[#3F4B5E] leading-relaxed">
          {decision.conditions}
        </p>
      </div>

      {/* 6 Criteria Checklist */}
      <div className="flex flex-col gap-2">
        <span className="text-caption-bold text-[#55647A] uppercase tracking-wider">
          GRADUATION CHECKLIST
        </span>
        <div className="flex flex-col divide-y divide-[#EBEFF4] border border-[#EBEFF4] rounded-[12px] overflow-hidden">
          {decision.checklist.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 flex items-center justify-between bg-white text-caption"
            >
              <div className="flex items-center gap-2">
                {item.passed ? (
                  <div className="h-4 w-4 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full bg-[#FEF3E2] text-[#B45309] flex items-center justify-center shrink-0">
                    <Clock className="h-2.5 w-2.5" />
                  </div>
                )}
                <span className="text-[#0F2340] text-[12px] leading-tight">
                  {item.label}
                </span>
              </div>
              <span
                className={`text-[11px] font-bold shrink-0 ml-2 ${
                  item.passed ? "text-[#15803D]" : "text-[#B45309]"
                }`}
              >
                {item.current}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={onPromoteClick}
          className="w-full sm:flex-1 h-9 px-4 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <Award className="h-4 w-4" />
          <span>Promote from 1 Nov</span>
        </button>
        <button
          type="button"
          onClick={onExtendClick}
          className="w-full sm:w-auto h-9 px-4 rounded-[12px] border border-[#dce2ea] bg-white hover:bg-[#f5f7fa] text-label text-[#0F2340] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <Calendar className="h-3.5 w-3.5 text-[#55647A]" />
          <span>Extend pilot</span>
        </button>
      </div>
    </div>
  );
}

