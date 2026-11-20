"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { LabPipelineColumn, LabPipelineItem } from "@/types/lab";

interface LabPipelineKanbanProps {
  columns?: LabPipelineColumn[];
}

export function LabPipelineKanban({ columns }: LabPipelineKanbanProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full">
      {/* 1 · Idea (Figma 474:244430) */}
      <div className="flex-1 min-w-0 rounded-[16px] border border-[#DCE2EA] bg-white p-[13px] flex flex-col gap-2 min-h-[254px] shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-caption-bold uppercase tracking-wider text-[#3F4B5E]">
            1 · Idea
          </span>
          <span className="text-caption font-bold text-[#55647A]">2</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-[16px] bg-[#F5F7FA] p-3 flex flex-col gap-0.5">
            <span className="text-body-s font-bold text-[#0F2340] truncate">
              Kokum Cold Brew Soda
            </span>
            <span className="text-caption font-medium text-[#3F4B5E] truncate">
              Proposed by Arjun S. · 14 votes
            </span>
          </div>
          <div className="rounded-[16px] bg-[#F5F7FA] p-3 flex flex-col gap-0.5">
            <span className="text-body-s font-bold text-[#0F2340] truncate">
              Filter Coffee Tonic
            </span>
            <span className="text-caption font-medium text-[#3F4B5E] truncate">
              From app suggestions · 9 votes
            </span>
          </div>
        </div>
      </div>

      {/* 2 · R&D (Figma 474:244440) */}
      <div className="flex-1 min-w-0 rounded-[16px] border border-[#DCE2EA] bg-white p-[13px] flex flex-col gap-2 min-h-[254px] shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-caption-bold uppercase tracking-wider text-[#3F4B5E]">
            2 · R&D
          </span>
          <span className="text-caption font-bold text-[#55647A]">1</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-[16px] bg-[#F5F7FA] p-3 flex flex-col gap-0.5">
            <span className="text-body-s font-bold text-[#0F2340] truncate">
              Tamarind Phin Spritz
            </span>
            <span className="text-caption font-medium text-[#3F4B5E] truncate">
              Recipe v2 · cost ₹61 · tasting 8 Oct
            </span>
          </div>
        </div>
      </div>

      {/* 3 · Pilot (Figma 474:244447) */}
      <div className="flex-1 min-w-0 rounded-[16px] border border-[#DCE2EA] bg-white p-[13px] flex flex-col gap-2 min-h-[254px] shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-caption-bold uppercase tracking-wider text-[#3F4B5E]">
            3 · Pilot
          </span>
          <span className="text-caption font-bold text-[#55647A]">1</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-[16px] bg-[#F5F7FA] p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-[8px] overflow-hidden bg-white/70 shrink-0 border border-[#DCE2EA] flex items-center justify-center">
                <Image
                  src="/images/menu/matcha_latte.jpg"
                  alt="Batch 08"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-caption font-bold text-[#566F2C]">
                  Batch 08
                </span>
                <span className="text-body-s font-bold text-[#0F2340] truncate">
                  Pandan Coconut Cold Brew
                </span>
              </div>
            </div>
            <span className="text-caption font-medium text-[#3F4B5E] truncate">
              Pilot 12–26 Oct · Indiranagar, Bandra
            </span>
          </div>
        </div>
      </div>

      {/* 4 · Live (Figma 474:244458 - Highlighted 262px) */}
      <div className="w-full lg:w-[262px] shrink-0 rounded-[16px] border-[1.5px] border-[#566F2C] bg-white p-[13.5px] flex flex-col gap-2 min-h-[254px] shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-caption-bold uppercase tracking-wider text-[#566F2C]">
            4 · Live
          </span>
          <span className="text-caption font-bold text-[#55647A]">1</span>
        </div>
        <div className="rounded-[16px] bg-[#EBF1DE] p-3 flex flex-col gap-2">
          <Link href="/lab/batch_07" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-[8px] overflow-hidden bg-white/80 shrink-0 border border-[#566F2C]/30 flex items-center justify-center">
              <Image
                src="/images/bruvi_lab_tonic.png"
                alt="Batch 07"
                width={40}
                height={40}
                className="object-contain w-full h-full p-0.5"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/menu/matcha_latte.jpg";
                }}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-caption font-bold text-[#566F2C]">
                Batch 07 · ₹260
              </span>
              <span className="text-body-s font-bold text-[#0F2340] group-hover:text-[#1C3A66] transition-colors truncate">
                Yuzu Matcha Tonic
              </span>
            </div>
          </Link>

          {/* Progress bar */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-caption">
              <span className="font-medium text-[#3F4B5E] whitespace-nowrap">2,340 of 4,000 cups</span>
              <span className="font-bold text-[#0F2340] whitespace-nowrap">8 days left</span>
            </div>
            <div className="w-full h-2 rounded-[4px] bg-[#0F2340]/12 overflow-hidden">
              <div
                className="h-full bg-[#566F2C] rounded-[4px]"
                style={{ width: "58.5%" }}
              />
            </div>
          </div>

          <span className="text-caption font-medium text-[#3F4B5E] truncate">
            6 stores · BLR 3 · BOM 2 · GGN 1
          </span>
        </div>
      </div>

      {/* 5 · Ended (Figma 474:244475) */}
      <div className="flex-1 min-w-0 rounded-[16px] border border-[#DCE2EA] bg-white p-[13px] flex flex-col gap-2 min-h-[254px] shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-caption-bold uppercase tracking-wider text-[#3F4B5E]">
            5 · Ended
          </span>
          <span className="text-caption font-bold text-[#55647A]">6</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-[16px] bg-[#F5F7FA] p-3 flex flex-col gap-0.5">
            <span className="text-body-s font-bold text-[#0F2340] truncate">
              B06 · Black Sesame Bạc Xỉu
            </span>
            <span className="text-caption font-medium text-[#3F4B5E] truncate">
              Ended 24 Sep · ★ 4.2 · 1,980 sold
            </span>
          </div>
          <div className="rounded-[16px] bg-[#F5F7FA] p-3 flex flex-col gap-0.5">
            <span className="text-body-s font-bold text-[#0F2340] truncate">
              B05 · Coconut Foam Phin
            </span>
            <span className="text-caption font-medium text-[#3F4B5E] truncate">
              Ended 30 Aug · ★ 4.0 · 1,610 sold
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

