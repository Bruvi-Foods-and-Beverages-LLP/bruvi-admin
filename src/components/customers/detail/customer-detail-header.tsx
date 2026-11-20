"use client";

import * as React from "react";
import Link from "next/link";
import { CustomerEntity } from "@/types/customers";
import { Star } from "lucide-react";

interface CustomerDetailHeaderProps {
  customer: CustomerEntity;
  onOpenMessageModal?: () => void;
  onOpenCouponModal?: () => void;
  onOpenAddPointsModal: () => void;
}

export function CustomerDetailHeader({
  customer,
  onOpenMessageModal,
  onOpenCouponModal,
  onOpenAddPointsModal,
}: CustomerDetailHeaderProps) {
  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-[#e4f0fa] text-[#22629e]";
      case "Gold":
        return "bg-[#fdf0d8] text-[#9a5b00]";
      case "Silver":
        return "bg-[#f5f7fa] text-[#3f4b5e]";
      case "Bronze":
      default:
        return "bg-[#fef3eb] text-[#b45309]";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. Breadcrumb Navigation (Figma Node 474:239783) */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-body-s text-text-secondary">
        <Link
          href="/customers"
          className="hover:text-text transition-colors cursor-pointer"
        >
          Customers
        </Link>
        <span className="text-border-strong select-none">/</span>
        <span className="text-text font-medium truncate max-w-[280px]">
          {customer.name}
        </span>
      </nav>

      {/* 2. Hero Header Container (Figma Node 474:295725) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        {/* Left: Avatar + Title & Meta (Figma Node 474:295704) */}
        <div className="flex items-center gap-4">
          {/* 64x64 Avatar Circle */}
          <div className="h-16 w-16 rounded-full bg-[#e8f5fd] flex items-center justify-center shrink-0 select-none">
            <span className="font-display font-black text-[24px] leading-8 text-[#1c3a66] [font-variation-settings:'wdth'_125,'wght'_900]">
              {customer.initials}
            </span>
          </div>

          {/* Name & Badges + Subtitle */}
          <div className="flex flex-col gap-1 min-w-0">
            {/* Title Line with Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display font-black text-[32px] leading-[38px] text-[#0f2340] tracking-tight [font-variation-settings:'wdth'_125,'wght'_900]">
                {customer.name}
              </h1>

              {/* Tier & Points Badge (Figma Node 474:287027) */}
              <span
                className={`inline-flex items-center gap-1 h-6 px-2.5 rounded-full font-sans font-bold text-[12px] leading-4 [font-variation-settings:'wght'_700] ${getTierBadgeStyle(
                  customer.tier
                )}`}
              >
                <Star className="h-3 w-3 fill-current stroke-[2]" />
                <span>
                  {customer.tier} · {customer.points.toLocaleString("en-IN")} pts
                </span>
              </span>

              {/* BRUVI Club Subscription Badge (Figma Node 474:287028) */}
              {customer.tags.some((t) => t.toLowerCase().includes("club")) && (
                <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-[#0f2340] text-white font-sans font-bold text-[12px] leading-4 [font-variation-settings:'wght'_700]">
                  BRUVI Club Daily
                </span>
              )}
            </div>

            {/* Subtitle Meta Line (Figma Node 474:288175) */}
            <p className="font-sans font-normal text-[14px] leading-5 text-[#3f4b5e] [font-variation-settings:'wght'_400]">
              {customer.code} · {customer.phone} · {customer.email || "no email"} {customer.homeStore ? ` · Home store ${customer.homeStore}` : ""} · Joined {customer.memberSince}
            </p>
          </div>
        </div>

        {/* Right: Action Buttons (Figma Node 474:295705) */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenMessageModal && (
          <button
            type="button"
            onClick={onOpenMessageModal}
            className="flex h-9 items-center justify-center rounded-[12px] border-[1.5px] border-[#bcc6d3] bg-surface px-4 font-sans font-bold text-[14px] leading-5 text-[#0f2340] hover:bg-gray-50 hover:border-[#7f8ca0] transition-all cursor-pointer shadow-2xs"
          >
            Message
          </button>
          )}

          {onOpenCouponModal && (
          <button
            type="button"
            onClick={onOpenCouponModal}
            className="flex h-9 items-center justify-center rounded-[12px] border-[1.5px] border-[#bcc6d3] bg-surface px-4 font-sans font-bold text-[14px] leading-5 text-[#0f2340] hover:bg-gray-50 hover:border-[#7f8ca0] transition-all cursor-pointer shadow-2xs"
          >
            Issue coupon
          </button>
          )}

          <button
            type="button"
            onClick={onOpenAddPointsModal}
            className="flex h-9 items-center justify-center rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] px-4 font-sans font-bold text-[14px] leading-5 text-white transition-all cursor-pointer shadow-2xs"
          >
            Add points
          </button>
        </div>
      </div>
    </div>
  );
}

