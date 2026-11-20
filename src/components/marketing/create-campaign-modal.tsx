"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setIsCreateCampaignOpen, createMarketingCampaign } from "@/store/slices/marketing-slice";
import { ChannelType } from "@/types/marketing";
import { X, Check } from "lucide-react";

/**
 * Create Campaign Modal (Figma 474:241981 - A082 Create Campaign)
 * Allows HQ administrators to configure omnichannel campaigns with channel selection,
 * audience targeting, date schedules, and budget limits.
 */
export function CreateCampaignModal() {
  const dispatch = useAppDispatch();
  const { isCreateCampaignOpen } = useAppSelector((state) => state.marketing);

  const [name, setName] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<ChannelType[]>(["push"]);
  const [audience, setAudience] = useState("All Active Customers");
  const [startDate, setStartDate] = useState("15 Oct 2026");
  const [endDate, setEndDate] = useState("30 Oct 2026");
  const [budget, setBudget] = useState("₹25,000");

  if (!isCreateCampaignOpen) return null;

  const toggleChannel = (channel: ChannelType) => {
    if (selectedChannels.includes(channel)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== channel));
      }
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch(
      createMarketingCampaign({
        name,
        channels: selectedChannels,
        audience,
        audienceCount: audience === "All Active Customers" ? 48200 : 18400,
        startDate,
        endDate,
        budgetSpent: "₹0",
        budgetTotal: budget,
        status: "scheduled",
      }),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-[#dce2ea] rounded-[20px] p-6 shadow-2xl flex flex-col gap-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#ebeff4] pb-3">
          <div>
            <span className="text-[12px] font-normal text-[#55647a] font-manrope">
              Growth / Marketing
            </span>
            <h2 className="text-[20px] font-extrabold text-[#0f2340] font-manrope">
              Create new campaign
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setIsCreateCampaignOpen(false))}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#55647a] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-manrope">
          {/* Campaign Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#0f2340]">Campaign Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Diwali Weekend Sparkle"
              className="h-10 px-3.5 rounded-[12px] border border-[#bcc6d3] text-[14px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] shadow-2xs"
            />
          </div>

          {/* Delivery Channels */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#0f2340]">Channels</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "push", label: "Push Notification" },
                { id: "whatsapp", label: "WhatsApp" },
                { id: "in-app", label: "In-app Banner" },
                { id: "sms", label: "SMS" },
              ].map((ch) => {
                const isSelected = selectedChannels.includes(ch.id as ChannelType);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id as ChannelType)}
                    className={`h-9 px-3 rounded-[12px] border text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#e8f5fd] border-[#1c3a66] text-[#1c3a66]"
                        : "bg-white border-[#bcc6d3] text-[#55647a] hover:bg-gray-50"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Audience */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#0f2340]">Audience Segment</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="h-10 px-3.5 rounded-[12px] border border-[#bcc6d3] bg-white text-[14px] font-medium text-[#0f2340] focus:outline-none focus:border-[#1c3a66] shadow-2xs"
            >
              <option value="All Active Customers">All Active Customers (48,200 targets)</option>
              <option value="Iced Beverage Drinkers">Iced Beverage Drinkers (18,400 targets)</option>
              <option value="Lapsed 45d Customers">Lapsed 45d Customers (49,700 targets)</option>
              <option value="Gold & Platinum Tiers">Gold & Platinum Tiers (4,200 targets)</option>
            </select>
          </div>

          {/* Schedule Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#0f2340]">Start Date</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 px-3.5 rounded-[12px] border border-[#bcc6d3] text-[14px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] shadow-2xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#0f2340]">End Date</label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 px-3.5 rounded-[12px] border border-[#bcc6d3] text-[14px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] shadow-2xs"
              />
            </div>
          </div>

          {/* Budget Limit */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#0f2340]">Budget Cap</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. ₹25,000"
              className="h-10 px-3.5 rounded-[12px] border border-[#bcc6d3] text-[14px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] shadow-2xs"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 mt-2 border-t border-[#ebeff4] pt-4">
            <button
              type="button"
              onClick={() => dispatch(setIsCreateCampaignOpen(false))}
              className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] bg-white text-[14px] font-bold text-[#3f4b5e] hover:bg-gray-50 cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-5 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-white text-[14px] font-bold cursor-pointer shadow-2xs transition-colors"
            >
              Launch campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

