"use client";

import * as React from "react";
import { CustomerPreferences } from "@/types/customers";
import { Smartphone, Store } from "lucide-react";

interface CustomerPreferencesCardProps {
  preferences: CustomerPreferences;
}

export function CustomerPreferencesCard({
  preferences,
}: CustomerPreferencesCardProps) {
  const { milkSweetness, dietBirthday, consents, devices } = preferences;

  return (
    <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col select-none">
      {/* Header (Figma 474:239905) */}
      <div className="px-5 py-3.5 border-b border-[#dce2ea]">
        <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340] tracking-tight [font-variation-settings:'wght'_800]">
          Preferences & consent
        </h3>
      </div>

      {/* Row 1: Milk & Sweetness (Figma 474:239907) */}
      <div className="px-5 py-2.5 flex items-center justify-between border-b border-[#dce2ea]/60">
        <span className="font-sans font-normal text-[14px] leading-5 text-[#3f4b5e] [font-variation-settings:'wght'_400]">
          Milk · sweetness
        </span>
        <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] [font-variation-settings:'wght'_700]">
          {milkSweetness ?? "Not set"}
        </span>
      </div>

      {/* Row 2: Diet & Birthday (Figma 474:239910) */}
      <div className="px-5 py-2.5 flex items-center justify-between border-b border-[#dce2ea]/60">
        <span className="font-sans font-normal text-[14px] leading-5 text-[#3f4b5e] [font-variation-settings:'wght'_400]">
          Diet · birthday
        </span>
        <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] [font-variation-settings:'wght'_700]">
          {dietBirthday ?? "Not set"}
        </span>
      </div>

      {/* Row 3: Communication Consents (Figma 474:239913) */}
      {consents && (
      <div className="px-5 py-3 flex items-center gap-2 flex-wrap border-b border-[#dce2ea]">
        {/* Push */}
        <span
          className={`inline-flex items-center h-6 px-2.5 rounded-full font-sans font-bold text-[12px] leading-4 [font-variation-settings:'wght'_700] ${
            consents.push
              ? "bg-[#e3f4ea] text-[#1f7a4d]"
              : "bg-[#f5f7fa] text-[#7f8ca0]"
          }`}
        >
          {consents.push ? "✓ Push" : "✕ Push"}
        </span>

        {/* WhatsApp */}
        <span
          className={`inline-flex items-center h-6 px-2.5 rounded-full font-sans font-bold text-[12px] leading-4 [font-variation-settings:'wght'_700] ${
            consents.whatsapp
              ? "bg-[#e3f4ea] text-[#1f7a4d]"
              : "bg-[#f5f7fa] text-[#7f8ca0]"
          }`}
        >
          {consents.whatsapp ? "✓ WhatsApp" : "✕ WhatsApp"}
        </span>

        {/* Email */}
        <span
          className={`inline-flex items-center h-6 px-2.5 rounded-full font-sans font-bold text-[12px] leading-4 [font-variation-settings:'wght'_700] ${
            consents.email
              ? "bg-[#e3f4ea] text-[#1f7a4d]"
              : "bg-[#f5f7fa] text-[#3f4b5e]"
          }`}
        >
          {consents.email ? "✓ Email" : "✕ Email"}
        </span>

        {/* SMS */}
        <span
          className={`inline-flex items-center h-6 px-2.5 rounded-full font-sans font-bold text-[12px] leading-4 [font-variation-settings:'wght'_700] ${
            consents.sms
              ? "bg-[#f5f7fa] text-[#3f4b5e]"
              : "bg-[#f5f7fa] text-[#7f8ca0]"
          }`}
        >
          {consents.sms ? "SMS · orders only" : "✕ SMS"}
        </span>
      </div>
      )}

      {/* Devices Section (Figma 474:239922) */}
      <div className="px-5 pt-3 pb-4 flex flex-col gap-2.5">
        <span className="font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] [font-variation-settings:'wght'_700]">
          Devices
        </span>

        {devices.length === 0 && (
          <p className="font-sans text-[14px] leading-5 text-[#55647a]">No devices registered yet.</p>
        )}

        <div className="flex flex-col gap-2.5 divide-y divide-[#dce2ea]/50">
          {devices.map((device) => (
            <div key={device.id} className="pt-2 first:pt-0 flex items-center gap-3">
              {/* Icon */}
              <div className="h-8 w-8 rounded-full bg-[#f5f7fa] border border-[#dce2ea] flex items-center justify-center text-[#3f4b5e] shrink-0">
                {device.type === "phone" ? (
                  <Smartphone className="h-4 w-4" />
                ) : (
                  <Store className="h-4 w-4" />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col min-w-0">
                <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] truncate [font-variation-settings:'wght'_700]">
                  {device.name}
                </span>
                <span className="font-sans font-medium text-[12px] leading-4 text-[#3f4b5e] truncate [font-variation-settings:'wght'_500]">
                  {device.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

