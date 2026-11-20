"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setActiveTab } from "@/store/slices/marketing-slice";
import type { MarketingTab } from "@/types/marketing";

const TABS: { key: MarketingTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "campaigns", label: "Campaigns" },
  { key: "audiences", label: "Audiences" },
  { key: "coupons", label: "Coupons" },
  { key: "push", label: "Push" },
];

/** Header of the coupon pages (Figma 474:243657): breadcrumb, title + status, actions, marketing tabs. */
export function CouponPageShell({ crumb, title, badge, actions, children }: {
  crumb: string;
  title: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const go = (tab: MarketingTab) => {
    dispatch(setActiveTab(tab));
    router.push("/marketing");
  };
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[14px] leading-5 text-[#3f4b5e] font-manrope">
              <Link href="/marketing" onClick={() => dispatch(setActiveTab("overview"))} className="hover:underline">Marketing</Link>
              {" / "}
              <button type="button" onClick={() => go("coupons")} className="hover:underline cursor-pointer">Coupons</button>
              {" / "}
              {crumb}
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[32px] leading-[38px] font-black font-archivo text-[#0f2340] tracking-[-0.96px] truncate">{title}</h1>
              {badge}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        <div className="w-full h-[37px] border-b border-[#dce2ea] flex items-center gap-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => go(t.key)}
              className={
                t.key === "coupons"
                  ? "h-[36px] flex items-center text-[14px] font-bold font-manrope text-[#0f2340] border-b-2 border-[#1c3a66] cursor-pointer"
                  : "h-[36px] flex items-center text-[14px] font-bold font-manrope text-[#3f4b5e] hover:text-[#0f2340] cursor-pointer"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

export const secondaryBtn =
  "h-9 px-4 rounded-[12px] border-[1.5px] border-[#bcc6d3] bg-white text-[14px] font-bold text-[#0f2340] hover:bg-[#f5f7fa] font-manrope cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
export const primaryBtn =
  "h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-white text-[14px] font-bold font-manrope cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
