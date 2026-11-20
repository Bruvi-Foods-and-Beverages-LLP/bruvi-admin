"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { LabBatchItem } from "@/types/lab";

interface LabBatchesTableProps {
  batches: LabBatchItem[];
  onPromoteClick?: (batch: LabBatchItem) => void;
}

export function LabBatchesTable({ batches }: LabBatchesTableProps) {
  // Demo or real batches matching Figma 474:244485
  const displayBatches = [
    {
      id: "b69eb5b2-ec1f-42af-92d8-af0d3f79d1ec",
      batchNumber: "07",
      name: "Yuzu Matcha Tonic",
      code: "LAB-07 · ₹260",
      image: "/images/bruvi_lab_tonic.png",
      status: "LIVE",
      statusLabel: "Live · 8 days left",
      statusDot: "#1F7A4D",
      statusBg: "#E3F4EA",
      statusColor: "#1F7A4D",
      window: "26 Sep – 10 Oct",
      stores: "6",
      sold: "2,340",
      rating: "★ 4.5",
      buyAgain: "61%",
      buyAgainIsHigh: true,
      margin: "71%",
    },
    {
      id: "52a0fbd5-ed16-4ae2-83b5-517bcdee009b",
      batchNumber: "06",
      name: "Black Sesame Bạc Xỉu",
      code: "LAB-06 · ₹240",
      image: "/images/menu/bac_xiu.jpg",
      status: "ENDED",
      statusLabel: "Ended 24 Sep",
      statusDot: "#55647A",
      statusBg: "#F5F7FA",
      statusColor: "#3F4B5E",
      window: "10 – 24 Sep",
      stores: "8",
      sold: "1,980",
      rating: "★ 4.2",
      buyAgain: "48%",
      buyAgainIsHigh: false,
      margin: "66%",
    },
    {
      id: "batch_08",
      batchNumber: "08",
      name: "Pandan Coconut Cold Brew",
      code: "LAB-08 · ₹280",
      image: "/images/menu/matcha_latte.jpg",
      status: "DEV",
      statusLabel: "In development",
      statusDot: "#22629E",
      statusBg: "#E4F0FA",
      statusColor: "#22629E",
      window: "Pilot 12 – 26 Oct",
      stores: "2",
      sold: "—",
      rating: "—",
      buyAgain: "—",
      buyAgainIsHigh: false,
      margin: "74% est.",
    },
  ];

  return (
    <div className="w-full rounded-[16px] border border-[#DCE2EA] bg-white overflow-hidden shadow-2xs flex flex-col">
      {/* Table Header Row (Figma 474:244486) */}
      <div className="h-9 bg-[#F5F7FA] border-b border-[#DCE2EA] px-5 flex items-center gap-4 text-[#3F4B5E] text-caption-bold uppercase tracking-wider text-[11px]">
        <div className="flex-1 min-w-[260px]">Batch</div>
        <div className="w-[140px] shrink-0">Status</div>
        <div className="w-[120px] shrink-0">Window</div>
        <div className="w-[64px] shrink-0 text-right">Stores</div>
        <div className="w-[80px] shrink-0 text-right">Sold</div>
        <div className="w-[64px] shrink-0 text-right">Rating</div>
        <div className="w-[96px] shrink-0 text-right">Buy again</div>
        <div className="w-[80px] shrink-0 text-right">Margin</div>
      </div>

      {/* Table Rows (Figma 474:244495, 474:244511, 474:244527) */}
      <div className="divide-y divide-[#DCE2EA] flex flex-col">
        {displayBatches.map((item) => (
          <Link
            key={item.id}
            href={`/lab/${item.id}`}
            className="h-14 px-5 flex items-center gap-4 hover:bg-[#F5F7FA] transition-colors group cursor-pointer"
          >
            {/* Batch Info */}
            <div className="flex-1 min-w-[260px] flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 rounded-[8px] bg-[#F5F7FA] border border-[#DCE2EA] overflow-hidden shrink-0 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/menu/matcha_latte.jpg";
                  }}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-body-s font-bold text-[#0F2340] group-hover:text-[#1C3A66] transition-colors truncate">
                  Batch {item.batchNumber} · {item.name}
                </span>
                <span className="text-caption font-medium text-[#3F4B5E]">
                  {item.code}
                </span>
              </div>
            </div>

            {/* Status Pill */}
            <div className="w-[140px] shrink-0">
              <span
                className="h-6 px-2.5 rounded-[12px] inline-flex items-center gap-1.5 text-caption font-bold whitespace-nowrap"
                style={{ backgroundColor: item.statusBg, color: item.statusColor }}
              >
                <span
                  className="w-2 h-2 rounded-[4px] shrink-0"
                  style={{ backgroundColor: item.statusDot }}
                />
                <span>{item.statusLabel}</span>
              </span>
            </div>

            {/* Window */}
            <div className="w-[120px] text-body-s font-normal text-[#0F2340] shrink-0 truncate">
              {item.window}
            </div>

            {/* Stores */}
            <div className="w-[64px] text-right text-body-s font-semibold text-[#0F2340] shrink-0">
              {item.stores}
            </div>

            {/* Sold */}
            <div className="w-[80px] text-right text-body-s font-semibold text-[#0F2340] shrink-0">
              {item.sold}
            </div>

            {/* Rating */}
            <div className="w-[64px] text-right text-body-s font-bold text-[#0F2340] shrink-0">
              {item.rating}
            </div>

            {/* Buy Again */}
            <div
              className={`w-[96px] text-right text-body-s font-bold shrink-0 ${
                item.buyAgainIsHigh ? "text-[#1F7A4D]" : "text-[#3F4B5E]"
              }`}
            >
              {item.buyAgain}
            </div>

            {/* Margin */}
            <div className="w-[80px] text-right text-body-s font-semibold text-[#0F2340] shrink-0">
              {item.margin}
            </div>
          </Link>
        ))}
      </div>

      {/* Table Footer Row (Figma 474:244543) */}
      <div className="p-[12px_20px] flex items-center justify-between border-t border-[#DCE2EA] bg-white">
        <span className="text-body-s font-normal text-[#3F4B5E]">
          Showing 3 of 8 numbered batches · 2 ideas in backlog
        </span>
        <Link
          href="/lab"
          className="text-body-s font-bold text-[#1C3A66] hover:underline"
        >
          View batch archive →
        </Link>
      </div>
    </div>
  );
}

