"use client";

import React, { useState } from "react";
import { X, Check, Award, Sparkles, QrCode, ArrowRight, ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setIsPreviewMemberViewOpen } from "@/store/slices/loyalty-slice";

type PreviewTier = "SILVER" | "GOLD" | "PLATINUM";

export function PreviewTierModal() {
  const dispatch = useAppDispatch();
  const { isPreviewMemberViewOpen, tiersData } = useAppSelector((state) => state.loyalty);
  const [selectedTier, setSelectedTier] = useState<PreviewTier>("GOLD");

  if (!isPreviewMemberViewOpen) return null;

  const tiers = tiersData?.tiers || [];
  const currentTierInfo = tiers.find((t) => t.code === selectedTier) || tiers[1] || {
    name: selectedTier === "SILVER" ? "Silver" : selectedTier === "GOLD" ? "Gold" : "Platinum",
    code: selectedTier,
    minPoints: selectedTier === "SILVER" ? 0 : selectedTier === "GOLD" ? 1000 : 2000,
    maxPoints: selectedTier === "SILVER" ? 999 : selectedTier === "GOLD" ? 1999 : null,
    earnMultiplierText: selectedTier === "SILVER" ? "1× base" : selectedTier === "GOLD" ? "1.25× app" : "1.5× app",
    censusMembers: selectedTier === "SILVER" ? "1,01,400" : selectedTier === "GOLD" ? "20,300" : "5,100",
    censusShare: selectedTier === "SILVER" ? "80%" : selectedTier === "GOLD" ? "16%" : "4%",
    benefits: [],
  };

  const matrix = tiersData?.benefitsMatrix || [];

  const tierTheme = {
    SILVER: {
      cardBg: "bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]",
      border: "border-[#cbd5e1]",
      badgeBg: "bg-[#e2e8f0]",
      badgeText: "text-[#475569]",
      titleColor: "text-[#0f2340]",
      pointsColor: "text-[#0f2340]",
      accentDot: "#94a3b8",
      mockPoints: 450,
      nextThreshold: 1000,
      nextTierName: "Gold",
    },
    GOLD: {
      cardBg: "bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fde68a]",
      border: "border-[#fcd34d]",
      badgeBg: "bg-[#f59e0b]/20",
      badgeText: "text-[#b45309]",
      titleColor: "text-[#78350f]",
      pointsColor: "text-[#78350f]",
      accentDot: "#f59e0b",
      mockPoints: 1420,
      nextThreshold: 2000,
      nextTierName: "Platinum",
    },
    PLATINUM: {
      cardBg: "bg-gradient-to-br from-[#0f2340] via-[#1c3a66] to-[#0a192f]",
      border: "border-[#3b82f6]/40",
      badgeBg: "bg-white/10",
      badgeText: "text-[#93c5fd]",
      titleColor: "text-white",
      pointsColor: "text-white",
      accentDot: "#1c3a66",
      mockPoints: 3450,
      nextThreshold: null,
      nextTierName: null,
    },
  }[selectedTier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row items-center gap-6 max-h-[92vh] overflow-y-auto">
        {/* Mobile Device Frame */}
        <div className="w-[360px] h-[720px] bg-[#0f2340] rounded-[48px] p-3 shadow-2xl border-4 border-[#334155] flex flex-col relative shrink-0">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b]" />
            <div className="w-2 h-2 rounded-full bg-[#059669]/60" />
          </div>

          {/* Screen Content */}
          <div className="w-full h-full bg-[#f8fafc] rounded-[38px] overflow-hidden flex flex-col relative">
            {/* Mobile Top Bar */}
            <div className="pt-8 px-6 pb-3 flex items-center justify-between text-[11px] font-bold text-[#0f2340]">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span>5G</span>
                <div className="w-4 h-2.5 border border-[#0f2340] rounded-[2px] p-[1px]">
                  <div className="w-full h-full bg-[#0f2340] rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* App Nav */}
            <div className="px-6 py-2 flex items-center justify-between border-b border-[#e2e8f0]">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#64748b] uppercase">BRUVI LOYALTY</span>
                <h3 className="text-[16px] font-extrabold text-[#0f2340]">My Member Pass</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1c3a66]/10 flex items-center justify-center text-[#1c3a66]">
                <Award className="w-4 h-4" />
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
              {/* Digital Pass Card */}
              <div
                className={`w-full rounded-[24px] p-5 border shadow-sm flex flex-col justify-between min-h-[190px] relative overflow-hidden transition-all duration-300 ${tierTheme.cardBg} ${tierTheme.border}`}
              >
                {/* Decorative background watermark */}
                <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none select-none">
                  <Award className="w-40 h-40 text-current" />
                </div>

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[18px] font-black tracking-tight font-archivo uppercase text-[#0f2340]">
                        BRUVI
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${tierTheme.badgeBg} ${tierTheme.badgeText}`}
                      >
                        {currentTierInfo.name} Pass
                      </span>
                    </div>
                    <p className={`text-[12px] font-medium mt-0.5 opacity-80 ${tierTheme.titleColor}`}>
                      Karthik Raghavan
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/70 backdrop-blur-xs shadow-2xs border border-white/50">
                    <QrCode className="w-5 h-5 text-[#0f2340]" />
                  </div>
                </div>

                <div className="mt-4 relative z-10">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-[32px] font-black tracking-tight font-archivo ${tierTheme.pointsColor}`}>
                      {tierTheme.mockPoints.toLocaleString()}
                    </span>
                    <span className={`text-[12px] font-bold uppercase tracking-wider ${tierTheme.titleColor} opacity-80`}>
                      pts available
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {tierTheme.nextThreshold ? (
                    <div className="mt-2 space-y-1">
                      <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                        <div
                          className="h-full bg-[#1c3a66] rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (tierTheme.mockPoints / tierTheme.nextThreshold) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-medium opacity-75">
                        <span>{tierTheme.mockPoints} pts</span>
                        <span>
                          {tierTheme.nextThreshold - tierTheme.mockPoints} pts to {tierTheme.nextTierName}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Top Tier Maintained · 1.5× Earn Active</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Multiplier Callout */}
              <div className="p-3 bg-white rounded-2xl border border-[#e2e8f0] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1f7a4d] flex items-center justify-center font-bold text-[13px]">
                    ⚡
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#0f2340]">App Earn Rate</div>
                    <div className="text-[11px] text-[#64748b]">Every ₹20 spent on mobile</div>
                  </div>
                </div>
                <span className="text-[13px] font-extrabold text-[#1f7a4d] bg-emerald-50 px-2 py-0.5 rounded-lg">
                  {currentTierInfo.earnMultiplierText}
                </span>
              </div>

              {/* Active Perks List */}
              <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
                  <h4 className="text-[12px] font-extrabold text-[#0f2340] uppercase tracking-wider">
                    {currentTierInfo.name} Tier Benefits
                  </h4>
                  <span className="text-[11px] text-[#64748b]">Live Rules</span>
                </div>

                <div className="space-y-2">
                  {matrix.length > 0 ? (
                    matrix.map((item, idx) => {
                      const val =
                        selectedTier === "SILVER"
                          ? item.silver
                          : selectedTier === "GOLD"
                          ? item.gold
                          : item.platinum;
                      const isUnlocked = val !== "—";

                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 text-[11px] py-1 transition-opacity ${
                            isUnlocked ? "opacity-100" : "opacity-40"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isUnlocked ? "bg-emerald-100 text-[#1f7a4d]" : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <div className="flex-1 flex justify-between gap-1">
                            <span className="font-medium text-[#0f2340]">{item.benefit}</span>
                            <span className="font-bold text-[#1c3a66] shrink-0">{val}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[11px] text-[#64748b] italic">Loading live benefits...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Bottom Home Bar */}
            <div className="p-2 flex justify-center">
              <div className="w-32 h-1 bg-[#0f2340]/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Modal Side Controls & Explanation */}
        <div className="w-full md:w-[380px] bg-white rounded-3xl p-6 border border-[#dce2ea] shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#55647a] uppercase tracking-wider">
                  Mobile App Simulation
                </span>
                <h2 className="text-[20px] font-extrabold text-[#0f2340]">Member View Preview</h2>
              </div>
              <button
                type="button"
                onClick={() => dispatch(setIsPreviewMemberViewOpen(false))}
                className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] flex items-center justify-center text-[#55647a] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[13px] text-[#3f4b5e] leading-relaxed">
              Experience the Bruvi customer mobile app through the eyes of different customer tiers. This live simulation reflects your active tier qualification rules, multipliers, and benefits matrix.
            </p>

            {/* Tier Selector Buttons */}
            <div className="space-y-2 pt-2">
              <label className="text-[12px] font-bold text-[#0f2340] uppercase tracking-wider">
                Select Preview Tier:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["SILVER", "GOLD", "PLATINUM"] as PreviewTier[]).map((tierKey) => {
                  const isActive = selectedTier === tierKey;
                  return (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => setSelectedTier(tierKey)}
                      className={`h-10 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isActive
                          ? "bg-[#1c3a66] text-white shadow-sm ring-2 ring-[#1c3a66]/20"
                          : "bg-[#f8fafc] border border-[#dce2ea] text-[#3f4b5e] hover:bg-[#f1f5f9]"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            tierKey === "SILVER" ? "#94a3b8" : tierKey === "GOLD" ? "#f59e0b" : "#1c3a66",
                        }}
                      />
                      {tierKey.charAt(0) + tierKey.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Tier Stats Summary */}
            <div className="p-4 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] space-y-2.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#64748b]">Active Members:</span>
                <span className="font-bold text-[#0f2340]">
                  {currentTierInfo.censusMembers || currentTierInfo.memberCount?.toLocaleString() || "0"} ({currentTierInfo.censusShare || (selectedTier === "SILVER" ? "80%" : selectedTier === "GOLD" ? "16%" : "4%")})
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#64748b]">Points Threshold:</span>
                <span className="font-bold text-[#0f2340]">
                  {currentTierInfo.maxPoints
                    ? `${currentTierInfo.minPoints.toLocaleString()}–${currentTierInfo.maxPoints.toLocaleString()}`
                    : `${currentTierInfo.minPoints.toLocaleString()}+`} pts
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#64748b]">Earn Multiplier:</span>
                <span className="font-bold text-[#1f7a4d]">
                  {currentTierInfo.earnMultiplierText}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch(setIsPreviewMemberViewOpen(false))}
            className="w-full h-10 rounded-xl bg-[#1c3a66] hover:bg-[#0f2340] text-white text-[13px] font-bold transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
