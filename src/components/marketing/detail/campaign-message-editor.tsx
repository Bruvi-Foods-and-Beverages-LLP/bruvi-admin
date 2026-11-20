"use client";

import React from "react";
import { AlertTriangle, ImageIcon, Plus, ArrowUpRight } from "lucide-react";

export type CampaignChannelTab = "push" | "whatsapp" | "in-app";

interface CampaignMessageEditorProps {
  channel: CampaignChannelTab;
  onChannelChange: (channel: CampaignChannelTab) => void;
  title: string;
  onTitleChange: (title: string) => void;
  body: string;
  onBodyChange: (body: string) => void;
  deepLink: string;
  onDeepLinkChange: (deepLink: string) => void;
  imageFileName: string;
  onReplaceImage?: () => void;
  onInsertToken: (token: string) => void;
}

/**
 * Campaign Message Editor (Figma 474:242213, 712x575px)
 * Left column details entering card with channel tabs, title/body character counters,
 * dynamic tokens insertion, deep link, rich image picker, and Meta WhatsApp approval banner.
 */
export function CampaignMessageEditor({
  channel,
  onChannelChange,
  title,
  onTitleChange,
  body,
  onBodyChange,
  deepLink,
  onDeepLinkChange,
  imageFileName,
  onReplaceImage,
  onInsertToken,
}: CampaignMessageEditorProps) {
  const tokens = [
    "{first_name}",
    "{home_store}",
    "{favourite_drink}",
    "{points_balance}",
  ];

  return (
    <div className="w-full lg:w-[712px] bg-white border border-[#dce2ea] rounded-[16px] p-6 flex flex-col gap-5 shadow-2xs">
      {/* 1. Header Row & Channel Switcher (Figma 474:242214, 662x42px) */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1 border-b border-[#f1f5f9]">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[18px] leading-[26px] font-bold text-[#0f2340] font-manrope">
            Message
          </h2>
          <span className="text-[12px] leading-[16px] font-medium text-[#55647a] font-manrope">
            One message per channel · audience All opted-in 1,12,600
          </span>
        </div>

        {/* Channel Segmented Switch (Figma 474:242217) */}
        <div className="h-8 p-0.5 bg-[#f5f7fa] border border-[#dce2ea] rounded-[10px] flex items-center gap-0.5 select-none">
          <button
            type="button"
            onClick={() => onChannelChange("push")}
            className={`h-7 px-3 rounded-[8px] text-[12px] font-bold font-manrope transition-all cursor-pointer ${
              channel === "push"
                ? "bg-white text-[#0f2340] shadow-2xs border border-[#dce2ea]"
                : "text-[#55647a] hover:text-[#0f2340]"
            }`}
          >
            Push
          </button>
          <button
            type="button"
            onClick={() => onChannelChange("whatsapp")}
            className={`h-7 px-3 rounded-[8px] text-[12px] font-bold font-manrope transition-all cursor-pointer ${
              channel === "whatsapp"
                ? "bg-white text-[#0f2340] shadow-2xs border border-[#dce2ea]"
                : "text-[#55647a] hover:text-[#0f2340]"
            }`}
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => onChannelChange("in-app")}
            className={`h-7 px-3 rounded-[8px] text-[12px] font-bold font-manrope transition-all cursor-pointer ${
              channel === "in-app"
                ? "bg-white text-[#0f2340] shadow-2xs border border-[#dce2ea]"
                : "text-[#55647a] hover:text-[#0f2340]"
            }`}
          >
            In-app
          </button>
        </div>
      </div>

      {/* 2. Title Field with Character Counter (Figma 474:242226, 662x72px) */}
      <div className="w-full flex flex-col gap-1.5">
        <div className="w-full flex items-center justify-between">
          <label className="text-[14px] leading-[20px] font-bold text-[#0f2340] font-manrope">
            Title
          </label>
          <span className="text-[12px] leading-[16px] font-medium text-[#55647a] font-manrope">
            {title.length} / 50
          </span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={50}
          placeholder="{first_name}, gift a BRUVI this Diwali"
          className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white text-[14px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] shadow-2xs font-manrope transition-colors"
        />
      </div>

      {/* 3. Body Textarea & Token Insertion Bar (Figma 474:242232, 662x132px) */}
      <div className="w-full flex flex-col gap-1.5">
        <div className="w-full flex items-center justify-between">
          <label className="text-[14px] leading-[20px] font-bold text-[#0f2340] font-manrope">
            Body
          </label>
          <span className="text-[12px] leading-[16px] font-medium text-[#55647a] font-manrope">
            {body.length} / 120 · iOS truncates after ~110
          </span>
        </div>
        <textarea
          rows={3}
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          maxLength={120}
          placeholder="Send a BRUVI gift card from ₹500 and let them pick the brew."
          className="w-full p-3 rounded-[12px] border border-[#bcc6d3] bg-white text-[14px] leading-[20px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] shadow-2xs font-manrope transition-colors resize-none"
        />

        {/* Tokens Row (Figma 474:242237) */}
        <div className="w-full flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[12px] leading-[16px] font-medium text-[#55647a] font-manrope">
            Insert token:
          </span>
          {tokens.map((token) => (
            <button
              key={token}
              type="button"
              onClick={() => onInsertToken(token)}
              className="h-6 px-2 rounded-[8px] bg-[#f5f7fa] border border-[#dce2ea] text-[12px] font-mono text-[#0f2340] hover:bg-[#e8f5fd] hover:border-[#1c3a66] hover:text-[#1c3a66] transition-colors cursor-pointer select-none"
            >
              {token}
            </button>
          ))}
          <span className="ml-auto text-[12px] leading-[16px] font-medium text-[#7f8ca0] font-manrope">
            Fallback: “there”
          </span>
        </div>
      </div>

      {/* 4. Deep link & Rich Image (Figma 474:242249, 662x92px) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Deep Link */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] leading-[20px] font-bold text-[#0f2340] font-manrope">
            Deep link
          </label>
          <input
            type="text"
            value={deepLink}
            onChange={(e) => onDeepLinkChange(e.target.value)}
            placeholder="bruvi://giftcards/diwali"
            className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white text-[14px] font-mono text-[#0f2340] focus:outline-none focus:border-[#1c3a66] shadow-2xs transition-colors"
          />
          <span className="text-[11px] leading-[14px] font-medium text-[#55647a] font-manrope">
            UTM diwali26 auto-added · web fallback bruvi.in/gift
          </span>
        </div>

        {/* Rich Image File Picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] leading-[20px] font-bold text-[#0f2340] font-manrope">
            Rich image
          </label>
          <div className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <ImageIcon className="w-4 h-4 text-[#55647a] shrink-0" />
              <span className="text-[14px] text-[#0f2340] font-manrope truncate">
                {imageFileName || "diwali-giftcard-1x1.png"}
              </span>
            </div>
            <button
              type="button"
              onClick={onReplaceImage}
              className="text-[12px] font-bold text-[#1c3a66] hover:underline cursor-pointer shrink-0 font-manrope"
            >
              Replace
            </button>
          </div>
          <span className="text-[11px] leading-[14px] font-medium text-[#55647a] font-manrope">
            1080 × 1080 · 184 KB · JPG/PNG ≤ 1 MB
          </span>
        </div>
      </div>

      {/* 5. Warning / Info Box (Figma 474:242266, 662x76px) */}
      <div className="w-full bg-[#fdf0d8] border border-[#f59e0b]/25 rounded-[16px] p-4 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-[14px] leading-[20px] font-bold text-[#0f2340] font-manrope">
            WhatsApp needs a pre-approved template
          </span>
          <span className="text-[12px] leading-[16px] font-medium text-[#55647a] font-manrope">
            Template “diwali_giftcard_v2” is pending Meta approval (submitted 2h ago). Push is ready immediately.
          </span>
        </div>
        <button
          type="button"
          onClick={() => alert("Opening Meta WhatsApp template view...")}
          className="text-[14px] leading-[20px] font-bold text-[#b45309] hover:underline flex items-center gap-1 shrink-0 cursor-pointer font-manrope"
        >
          <span>View template</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

