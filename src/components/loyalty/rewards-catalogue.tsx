"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, ShoppingBag, Edit2, Archive, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchLoyaltyRewards,
  setRewardFilterType,
  setRewardFilterStatus,
  setRewardFilterStore,
  setRewardSearchQuery,
  setIsCreateRewardOpen,
  setEditingReward,
  archiveLoyaltyReward,
} from "@/store/slices/loyalty-slice";
import type { CatalogReward } from "@/types/loyalty";

export function RewardsCatalogue() {
  const dispatch = useAppDispatch();
  const {
    rewards,
    rewardFilterType,
    rewardFilterStatus,
    rewardFilterStore,
    rewardSearchQuery,
    isLoading,
  } = useAppSelector((state) => state.loyalty);

  useEffect(() => {
    dispatch(fetchLoyaltyRewards());
  }, [dispatch]);

  const items = rewards;

  // Filter items based on active toolbar controls
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (rewardFilterType !== "all" && item.item_type !== rewardFilterType) {
        return false;
      }
      // Status filter
      if (rewardFilterStatus !== "all" && item.status !== rewardFilterStatus) {
        return false;
      }
      // Store filter (mock check for demo)
      if (rewardFilterStore !== "all") {
        if (rewardFilterStore === "lab" && !item.description?.toLowerCase().includes("lab")) {
          return false;
        }
      }
      // Search query
      if (rewardSearchQuery.trim()) {
        const q = rewardSearchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesType = item.item_type.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesType) return false;
      }
      return true;
    });
  }, [items, rewardFilterType, rewardFilterStatus, rewardFilterStore, rewardSearchQuery]);

  const liveCount = useMemo(() => {
    return items.filter((r) => r.status === "LIVE").length;
  }, [items]);

  // Image resolution helper
  const getImageSrc = (reward: CatalogReward) => {
    if (reward.image_url) return reward.image_url;
    if (reward.title.toLowerCase().includes("paneer")) return "/images/menu/banh_mi_paneer.png";
    if (reward.title.toLowerCase().includes("matcha")) return "/images/menu/matcha_latte.jpg";
    if (reward.title.toLowerCase().includes("shot")) return "/images/menu/espresso_shots.svg";
    if (reward.title.toLowerCase().includes("sesame") || reward.title.toLowerCase().includes("xỉu"))
      return "/images/menu/bac_xiu.jpg";
    if (reward.item_type === "DRINK") return "/images/menu/ca_phe_sua_da.jpg";
    return null;
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1136px]">
      {/* ============================================================== */}
      {/* 1. FILTER BAR ROW (Figma 474:246781, height 36px, width 1136px)*/}
      {/* ============================================================== */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Left side: Search input + 3 Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Search Input (Figma 474:246782, width 320px, height 36px) */}
          <div className="w-full sm:w-[320px] h-9 rounded-[12px] border border-[#7f8ca0] bg-white px-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#55647a] shrink-0" />
            <input
              type="text"
              placeholder="Search rewards"
              value={rewardSearchQuery}
              onChange={(e) => dispatch(setRewardSearchQuery(e.target.value))}
              className="w-full text-[14px] font-normal leading-[20px] text-[#0f2340] placeholder:text-[#7f8ca0] font-manrope bg-transparent border-none p-0 focus:outline-none"
            />
          </div>

          {/* Filter 1: Status Dropdown (Figma 474:246790, width 117px) */}
          <div className="relative h-9 rounded-[12px] border border-[#bcc6d3] bg-white flex items-center">
            <select
              value={rewardFilterStatus}
              onChange={(e) => dispatch(setRewardFilterStatus(e.target.value))}
              className="h-full pl-3 pr-7 rounded-[12px] text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="LIVE">Status: Live</option>
              <option value="DRAFT">Status: Draft</option>
              <option value="ARCHIVED">Status: Archived</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#3f4b5e] absolute right-2 pointer-events-none" />
          </div>

          {/* Filter 2: Type Dropdown (Figma 474:246796, width 104px) */}
          <div className="relative h-9 rounded-[12px] border border-[#bcc6d3] bg-white flex items-center">
            <select
              value={rewardFilterType}
              onChange={(e) => dispatch(setRewardFilterType(e.target.value))}
              className="h-full pl-3 pr-7 rounded-[12px] text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
            >
              <option value="all">Type: All</option>
              <option value="DRINK">Type: Drink</option>
              <option value="FOOD">Type: Food</option>
              <option value="ADD_ON">Type: Add-on</option>
              <option value="MERCH">Type: Merch</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#3f4b5e] absolute right-2 pointer-events-none" />
          </div>

          {/* Filter 3: Store Dropdown (Figma 474:246800, width 126px) */}
          <div className="relative h-9 rounded-[12px] border border-[#bcc6d3] bg-white flex items-center">
            <select
              value={rewardFilterStore}
              onChange={(e) => dispatch(setRewardFilterStore(e.target.value))}
              className="h-full pl-3 pr-7 rounded-[12px] text-[14px] font-bold leading-[20px] text-[#0f2340] font-manrope bg-transparent border-none appearance-none focus:outline-none cursor-pointer"
            >
              <option value="all">Store: All 12</option>
              <option value="lab">Store: LAB only (6)</option>
              <option value="bengaluru">Store: Bengaluru</option>
              <option value="mumbai">Store: Mumbai</option>
              <option value="delhi">Store: Delhi NCR</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#3f4b5e] absolute right-2 pointer-events-none" />
          </div>
        </div>

        {/* Right side: Count text (Figma 474:246805, 14px Regular Manrope, #3f4b5e) */}
        <div className="text-[14px] font-normal leading-[20px] text-[#3f4b5e] font-manrope shrink-0 whitespace-nowrap self-center">
          {items.length} rewards · {liveCount} live
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. REWARDS GRID (Figma 474:246806, 368px cards, 16px gap)       */}
      {/* ============================================================== */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[210px] w-full rounded-[16px] border border-[#dce2ea] bg-white p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-[12px] bg-[#ebeff4]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-[#ebeff4] rounded" />
                  <div className="h-3 w-48 bg-[#ebeff4] rounded" />
                </div>
              </div>
              <div className="border-t border-[#dce2ea] pt-3 flex justify-between">
                <div className="h-4 w-16 bg-[#ebeff4] rounded" />
                <div className="h-4 w-16 bg-[#ebeff4] rounded" />
                <div className="h-4 w-16 bg-[#ebeff4] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {filteredItems.map((reward) => {
            const isTote =
              reward.item_type === "MERCH" || reward.title.toLowerCase().includes("tote");
            const imageSrc = getImageSrc(reward);

            // Redemptions count formatting
            const redemptionsDisplay =
              reward.status === "DRAFT"
                ? "—"
                : reward.redemptions_count > 0
                ? reward.redemptions_count.toLocaleString("en-IN")
                : "0";

            // Stock display
            const stockDisplay =
              reward.stock_display ||
              (reward.stock_limit !== null && reward.stock_limit !== undefined
                ? `${reward.stock_limit} left`
                : "n/a");

            const isStockWarning =
              reward.stock_limit !== null &&
              reward.stock_limit !== undefined &&
              reward.stock_limit > 0 &&
              reward.stock_limit < 200;

            // Available stores display
            const availableDisplay =
              reward.available_stores ||
              (reward.status === "ARCHIVED" ? "Ended" : "12 of 12 stores");

            return (
              <div
                key={reward.id}
                onClick={() => dispatch(setEditingReward(reward))}
                className="w-full lg:w-[368px] h-[297px] rounded-[16px] border border-[#dce2ea] bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                {/* Top Section (160px height, 366px width) */}
                <div className="h-[160px] w-full relative overflow-hidden bg-[#f5f7fa] shrink-0">
                  {/* Status Badge (Figma 474:246810, top-left) */}
                  <div className="absolute top-3 left-3 z-10">
                    {reward.status === "LIVE" && (
                      <span className="h-6 px-2 rounded-[12px] bg-[#eaf8ef] text-[#1e7e34] text-[12px] font-bold leading-[16px] font-manrope flex items-center shadow-xs">
                        Live
                      </span>
                    )}
                    {reward.status === "DRAFT" && (
                      <span className="h-6 px-2 rounded-[12px] bg-[#e8f1fd] text-[#1c64f2] text-[12px] font-bold leading-[16px] font-manrope flex items-center shadow-xs">
                        Draft
                      </span>
                    )}
                    {reward.status === "ARCHIVED" && (
                      <span className="h-6 px-2 rounded-[12px] bg-[#f5f7fa] text-[#7f8ca0] text-[12px] font-bold leading-[16px] font-manrope flex items-center shadow-xs">
                        Archived
                      </span>
                    )}
                  </div>

                  {/* Card Edit Action Button (Hover overlay) */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="h-6 px-2 rounded-[10px] bg-white/95 backdrop-blur-xs text-[#0f2340] border border-[#dce2ea] text-[11px] font-bold leading-[16px] font-manrope flex items-center gap-1 shadow-xs">
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </span>
                  </div>

                  {/* Top Illustration or Photo Fill */}
                  {isTote ? (
                    <div className="w-full h-full bg-[#e8f5fd] flex items-center justify-center">
                      <ShoppingBag
                        className="w-12 h-12 text-[#1c3a66] stroke-[2.5]"
                        strokeWidth={2.5}
                      />
                    </div>
                  ) : imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={reward.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f2f6fb] flex items-center justify-center text-[#1c3a66] font-archivo font-extrabold text-2xl">
                      {reward.points_cost} pts
                    </div>
                  )}
                </div>

                {/* Bottom Section (Figma 474:246812, 135px height, padding 16px) */}
                <div className="h-[135px] w-full p-4 flex flex-col justify-between shrink-0">
                  {/* Top row: Title + Subtitle on Left, Points on Right */}
                  <div className="h-[42px] flex items-baseline justify-between gap-2 overflow-hidden">
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="text-[18px] font-extrabold leading-[26px] text-[#0f2340] font-manrope truncate">
                        {reward.title}
                      </h3>
                      <p className="text-[12px] font-medium leading-[16px] text-[#3f4b5e] font-manrope truncate">
                        {reward.description || `${reward.item_type} · all tiers`}
                      </p>
                    </div>
                    <div className="text-[16px] font-extrabold leading-[24px] text-[#0f2340] font-archivo shrink-0">
                      {reward.points_cost.toLocaleString("en-IN")} pts
                    </div>
                  </div>

                  {/* Divider and Bottom 3 Metrics Columns */}
                  <div className="border-t border-[#dce2ea] pt-[13px] flex items-center justify-between">
                    {/* Col 1: Redeemed · 30d */}
                    <div className="w-[111px] shrink-0 flex flex-col">
                      <span className="text-[12px] font-medium leading-[16px] text-[#3f4b5e] font-manrope">
                        Redeemed · 30d
                      </span>
                      <span
                        className={`text-[14px] font-bold leading-[20px] font-manrope ${
                          redemptionsDisplay === "—" ? "text-[#7f8ca0]" : "text-[#0f2340]"
                        }`}
                      >
                        {redemptionsDisplay}
                      </span>
                    </div>

                    {/* Col 2: Stock */}
                    <div className="w-[111px] shrink-0 flex flex-col">
                      <span className="text-[12px] font-medium leading-[16px] text-[#3f4b5e] font-manrope">
                        Stock
                      </span>
                      <span
                        className={`text-[14px] font-bold leading-[20px] font-manrope ${
                          isStockWarning
                            ? "text-[#d97706]"
                            : stockDisplay === "0 left"
                            ? "text-[#7f8ca0]"
                            : "text-[#7f8ca0]"
                        }`}
                      >
                        {stockDisplay}
                      </span>
                    </div>

                    {/* Col 3: Available */}
                    <div className="w-[111px] shrink-0 flex flex-col">
                      <span className="text-[12px] font-medium leading-[16px] text-[#3f4b5e] font-manrope">
                        Available
                      </span>
                      <span
                        className={`text-[14px] font-bold leading-[20px] font-manrope ${
                          availableDisplay === "Ended" ? "text-[#7f8ca0]" : "text-[#0f2340]"
                        }`}
                      >
                        {availableDisplay}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty search/filter fallback */
        <div className="py-16 px-6 flex flex-col items-center justify-center text-center rounded-[16px] border border-dashed border-[#dce2ea] bg-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f7fa] border border-[#dce2ea] text-[#55647a] mb-3">
            <Search className="h-6 w-6 text-[#55647a]" />
          </div>
          <h3 className="text-base font-bold text-[#0f2340] font-manrope">No rewards found</h3>
          <p className="text-sm text-[#55647a] max-w-sm mt-1 mb-5 font-manrope">
            No rewards match the current search or filters. Try adjusting your selections.
          </p>
          <button
            type="button"
            onClick={() => {
              dispatch(setRewardSearchQuery(""));
              dispatch(setRewardFilterType("all"));
              dispatch(setRewardFilterStatus("all"));
              dispatch(setRewardFilterStore("all"));
            }}
            className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-sm font-bold text-white transition-colors cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
