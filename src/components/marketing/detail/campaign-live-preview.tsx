"use client";

import React, { useState } from "react";
import { Send, Smartphone, Sparkles } from "lucide-react";

interface CampaignLivePreviewProps {
  title: string;
  body: string;
  imageFileName?: string;
  sampleCustomerName?: string;
}

/**
 * Campaign Live Preview (Figma 474:242277, 400x575px)
 * Realistic smartphone hardware mock (320x439px) with clock face on lockscreen,
 * dynamic token substitution ("{first_name}" -> "Saisubbireddy"),
 * and interactive switch between iOS and Android preview modes.
 */
export function CampaignLivePreview({
  title,
  body,
  imageFileName = "diwali-giftcard-1x1.png",
  sampleCustomerName = "Saisubbireddy",
}: CampaignLivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<"ios" | "android">("ios");
  const [isTestSent, setIsTestSent] = useState(false);

  // Substitute {first_name} and other tokens for realistic preview
  const resolvedTitle = (title || "{first_name}, gift a BRUVI this Diwali")
    .replace(/{first_name}/g, sampleCustomerName)
    .replace(/{home_store}/g, "Indiranagar HQ")
    .replace(/{favourite_drink}/g, "Pandan Cold Brew")
    .replace(/{points_balance}/g, "480");

  const resolvedBody = (
    body ||
    "Send a BRUVI gift card from ₹500 and let them pick the brew. Bonus ₹100 on cards of ₹1,000+."
  )
    .replace(/{first_name}/g, sampleCustomerName)
    .replace(/{home_store}/g, "Indiranagar HQ")
    .replace(/{favourite_drink}/g, "Pandan Cold Brew")
    .replace(/{points_balance}/g, "480");

  const handleSendTest = () => {
    setIsTestSent(true);
    setTimeout(() => setIsTestSent(false), 3000);
  };

  return (
    <div className="w-full lg:w-[400px] bg-white border border-[#dce2ea] rounded-[16px] p-5 flex flex-col gap-4 shadow-2xs">
      {/* 1. Header (Figma 474:242278, 358x26px) */}
      <div className="w-full flex items-center justify-between">
        <h3 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340] font-manrope">
          Live preview
        </h3>
        <span className="text-[12px] leading-[16px] font-medium text-[#55647a] font-manrope">
          As {sampleCustomerName} · {deviceMode === "ios" ? "iOS" : "Android"}
        </span>
      </div>

      {/* 2. Realistic Smartphone Device Mock (Figma 474:242281, 320x439px) */}
      <div className="mx-auto w-[320px] h-[439px] rounded-[24px] border-[6px] border-[#0f2340] bg-[#0f2340] p-4 flex flex-col justify-between shadow-xl relative overflow-hidden select-none">
        {/* Subtle background wallpaper gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2340] via-[#152a4a] to-[#0a1628] opacity-90 pointer-events-none" />

        {/* Dynamic Island / Speaker Notch (iOS mode) */}
        {deviceMode === "ios" ? (
          <div className="relative mx-auto w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner z-10">
            <div className="w-2 h-2 rounded-full bg-[#1c3a66]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/10" />
          </div>
        ) : (
          <div className="relative w-full flex items-center justify-between px-2 pt-1 text-[11px] text-white/70 z-10">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-3.5 h-2 border border-white/60 rounded-[2px]" />
            </div>
          </div>
        )}

        {/* Lockscreen Clock & Date Section (Figma 474:242282, 474:242283) */}
        <div className="relative flex flex-col items-center justify-center text-center mt-2 z-10">
          <span className="text-[14px] leading-[20px] font-bold text-white/80 font-manrope tracking-tight">
            Friday, 2 October
          </span>
          <span className="text-[40px] leading-[44px] font-black font-archivo text-white tracking-[-1.5px] mt-0.5">
            9:41
          </span>
        </div>

        {/* Floating Notification Card (Figma 474:242285, 284x144px) */}
        <div className="relative z-10 mb-2">
          {deviceMode === "ios" ? (
            /* iOS Style Card */
            <div className="w-full bg-white/95 backdrop-blur-md rounded-[16px] p-3 shadow-lg border border-white/40 flex gap-2.5 items-start transition-all">
              {/* Bruvi App Icon */}
              <div className="w-9 h-9 rounded-[8px] bg-[#1c3a66] flex items-center justify-center text-white font-extrabold font-manrope text-[13px] shrink-0 shadow-xs">
                B
              </div>

              {/* Message Details */}
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <div className="w-full flex items-center justify-between">
                  <span className="text-[11px] leading-[14px] font-bold text-[#55647a] font-manrope uppercase tracking-wider">
                    BRUVI
                  </span>
                  <span className="text-[11px] leading-[14px] font-medium text-[#7f8ca0] font-manrope">
                    now
                  </span>
                </div>
                <h4 className="text-[13px] leading-[18px] font-bold text-[#0f2340] font-manrope line-clamp-2">
                  {resolvedTitle}
                </h4>
                <p className="text-[12px] leading-[16px] font-medium text-[#3f4b5e] font-manrope line-clamp-3">
                  {resolvedBody}
                </p>
              </div>

              {/* Rich Image Thumbnail */}
              <div className="w-10 h-10 rounded-[8px] bg-[#e8f5fd] border border-[#dce2ea] overflow-hidden shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-[#cde9f9] to-[#6f8db5] flex items-center justify-center text-[#0f2340] text-[10px] font-bold">
                  🎁
                </div>
              </div>
            </div>
          ) : (
            /* Android Material Style Card */
            <div className="w-full bg-[#1e293b] text-white rounded-[16px] p-3 shadow-lg border border-white/10 flex flex-col gap-2 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#1c3a66] flex items-center justify-center text-[9px] font-bold text-white">
                    B
                  </div>
                  <span className="text-[11px] font-bold text-gray-300 font-manrope">
                    Bruvi Coffee
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">9:41 AM</span>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-[13px] font-bold text-white font-manrope line-clamp-1">
                    {resolvedTitle}
                  </span>
                  <p className="text-[11px] leading-[15px] text-gray-300 font-manrope line-clamp-2">
                    {resolvedBody}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-[#a9d8f3] to-[#1c3a66] flex items-center justify-center text-xs shrink-0">
                  🎁
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Home Bar Indicator (iOS) */}
        {deviceMode === "ios" && (
          <div className="relative mx-auto w-32 h-1 bg-white/40 rounded-full mb-1 z-10" />
        )}
      </div>

      {/* 3. Action Controls Row (Figma 474:242295, 358x36px) */}
      <div className="w-full flex items-center gap-2">
        <button
          type="button"
          onClick={handleSendTest}
          className="flex-1 h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white hover:bg-gray-50 text-[14px] leading-[20px] font-bold text-[#0f2340] flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer font-manrope"
        >
          <Send className="w-3.5 h-3.5 text-[#55647a]" />
          <span>{isTestSent ? "Sent to phone!" : "Send test to my device"}</span>
        </button>

        <button
          type="button"
          onClick={() => setDeviceMode((m) => (m === "ios" ? "android" : "ios"))}
          className="h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white hover:bg-gray-50 text-[14px] leading-[20px] font-bold text-[#0f2340] flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer font-manrope shrink-0"
        >
          <Smartphone className="w-4 h-4 text-[#55647a]" />
          <span>{deviceMode === "ios" ? "View Android" : "View iOS"}</span>
        </button>
      </div>
    </div>
  );
}

