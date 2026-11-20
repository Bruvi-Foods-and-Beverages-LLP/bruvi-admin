"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CampaignTableItem, CampaignTableStatus } from "@/types/marketing";
import { FALLBACK_CAMPAIGN_TABLE_ITEMS } from "@/lib/api/marketing";
import { Search, ChevronDown, Calendar, Check } from "lucide-react";

/**
 * Campaigns List View (Figma Node 474:241757 - A081 All Campaigns Table)
 * - 1136px grid width with strict 4px spacing rhythm
 * - Filter bar (1136x36px):
 *   - Search input (320x36px, border-[#7f8ca0])
 *   - Status: All dropdown (117x36px, border-[#bcc6d3])
 *   - Type: All dropdown (104x36px, border-[#bcc6d3])
 *   - Audience: All dropdown (135x36px, border-[#bcc6d3])
 *   - Sep – Oct 2026 pill (148x36px, bg-[#e8f5fd] border-[#1c3a66])
 *   - Clear filter reset button
 *   - Counter: "8 of 42 campaigns"
 * - Pixel-perfect Flexbox table matching Figma 474:241850 & 474:241859:
 *   - Header row: 36px (h-9) with px-5 and 16px gap
 *   - Data rows: 56px (h-14) with px-5 and 16px gap
 *   - Checkbox (20px), Campaign (194px), Type (120px), Audience (160px), Status (96px), Schedule (120px), Sent (80px, right), Conv (80px, right), Revenue (96px, right)
 *   - Status pills: tight w-fit inline-flex px-2 py-0.5 rounded-[12px] left-aligned under Status column
 * - Pagination footer (1134x48px): "1–8 of 42 · sorted by start date", Previous / Next controls
 */
export function CampaignsListView() {
  const router = useRouter();
  const [items] = useState<CampaignTableItem[]>(FALLBACK_CAMPAIGN_TABLE_ITEMS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [audienceFilter, setAudienceFilter] = useState<string>("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalCampaignsInCatalog = 42;

  // Dropdown open states
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isAudienceOpen, setIsAudienceOpen] = useState(false);

  // Status options matching Figma 474:241757
  const statusOptions = ["All", "Live", "Scheduled", "Always-on", "Draft", "Ended"];

  // Type options matching Figma 474:241757
  const typeOptions = [
    "All",
    "Push + In-app",
    "WhatsApp",
    "WhatsApp + Push",
    "Push",
    "Coupon",
    "In-app",
    "SMS",
  ];

  // Audience options matching Figma 474:241757
  const audienceOptions = [
    "All",
    "Matcha lovers",
    "Lapsed 45 days",
    "All opted-in",
    "LAB fans",
    "Regulars",
  ];

  // Filtered dataset
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSub = item.subtitle.toLowerCase().includes(q);
        const matchesCode = item.code.toLowerCase().includes(q);
        const matchesAud = item.audience.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesCode && !matchesAud) return false;
      }

      // 2. Status Filter
      if (statusFilter !== "All" && item.status !== statusFilter) {
        return false;
      }

      // 3. Type Filter
      if (typeFilter !== "All" && !item.type.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }

      // 4. Audience Filter
      if (audienceFilter !== "All" && !item.audience.toLowerCase().includes(audienceFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [items, search, statusFilter, typeFilter, audienceFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Checkbox handlers
  const allCurrentSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => selectedIds.includes(item.id));

  const toggleSelectAll = () => {
    if (allCurrentSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedItems.some((item) => item.id === id))
      );
    } else {
      const toAdd = paginatedItems.map((item) => item.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...toAdd])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Clear all filters handler
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setAudienceFilter("All");
    setCurrentPage(1);
  };

  // Exact Status Badge adhering strictly to Figma tokens (474:241868, 474:273717, 474:241924, 474:241938, 474:241952)
  // Left-aligned, compact w-fit inline-flex, exact px-2, 24px height, 12px rounded
  const renderStatusBadge = (status: CampaignTableStatus) => {
    switch (status) {
      case "Live":
        return (
          <span className="w-fit inline-flex items-center justify-center h-6 px-2 rounded-[12px] bg-[#dcfce7] text-[12px] leading-[16px] font-bold text-[#15803d] font-manrope">
            Live
          </span>
        );
      case "Scheduled":
        return (
          <span className="w-fit inline-flex items-center justify-center h-6 px-2 rounded-[12px] bg-[#e0f2fe] text-[12px] leading-[16px] font-bold text-[#0284c7] font-manrope">
            Scheduled
          </span>
        );
      case "Always-on":
        return (
          <span className="w-fit inline-flex items-center justify-center h-6 px-2 rounded-[12px] bg-[#e8f5fd] text-[12px] leading-[16px] font-bold text-[#1c3a66] font-manrope">
            Always-on
          </span>
        );
      case "Draft":
        return (
          <span className="w-fit inline-flex items-center justify-center h-6 px-2 rounded-[12px] bg-[#f5f7fa] text-[12px] leading-[16px] font-bold text-[#55647a] font-manrope">
            Draft
          </span>
        );
      case "Ended":
      default:
        return (
          <span className="w-fit inline-flex items-center justify-center h-6 px-2 rounded-[12px] bg-[#f5f7fa] text-[12px] leading-[16px] font-bold text-[#55647a] font-manrope">
            Ended
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 
        1. Filter Toolbar (Figma 474:241803, 1136x36px)
        - Search campaigns input (320px x 36px)
        - Status: All dropdown (117px x 36px)
        - Type: All dropdown (104px x 36px)
        - Audience: All dropdown (135px x 36px)
        - Sep – Oct 2026 selected pill (148px x 36px)
        - Clear button (53px)
        - Spacer (flex-1)
        - Counter: "8 of 42 campaigns"
      */}
      <div className="w-full flex flex-wrap items-center gap-2">
        {/* Search campaigns input (320x36px, Figma 474:241804) */}
        <div className="relative w-full sm:w-[320px] h-9">
          <Search className="w-4 h-4 text-[#7f8ca0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search campaigns"
            className="w-full h-full pl-9 pr-3 rounded-[12px] border border-[#7f8ca0] bg-white text-[14px] leading-[20px] text-[#0f2340] placeholder:text-[#55647a] focus:outline-none focus:border-[#1c3a66] shadow-2xs font-manrope transition-colors"
          />
        </div>

        {/* Status Dropdown Filter (Figma 474:241807, 117x36px) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsTypeOpen(false);
              setIsAudienceOpen(false);
            }}
            className="h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white hover:bg-gray-50 flex items-center justify-between gap-1 shadow-2xs cursor-pointer font-manrope transition-colors"
          >
            <span className="text-[14px] leading-[20px] font-bold text-[#0f2340]">
              Status: {statusFilter}
            </span>
            <ChevronDown className="w-4 h-4 text-[#55647a]" />
          </button>

          {isStatusOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsStatusOpen(false)}
              />
              <div className="absolute left-0 top-10 w-44 rounded-[12px] border border-[#dce2ea] bg-white p-1 shadow-lg z-50 flex flex-col font-manrope animate-in fade-in zoom-in-95 duration-100">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setStatusFilter(opt);
                      setIsStatusOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-[14px] rounded-[8px] flex items-center justify-between transition-colors ${statusFilter === opt
                        ? "bg-[#e8f5fd] font-bold text-[#1c3a66]"
                        : "text-[#0f2340] hover:bg-gray-50"
                      }`}
                  >
                    <span>{opt}</span>
                    {statusFilter === opt && <Check className="w-3.5 h-3.5 text-[#1c3a66]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Type Dropdown Filter (Figma 474:241810, 104x36px) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsTypeOpen(!isTypeOpen);
              setIsStatusOpen(false);
              setIsAudienceOpen(false);
            }}
            className="h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white hover:bg-gray-50 flex items-center justify-between gap-1 shadow-2xs cursor-pointer font-manrope transition-colors"
          >
            <span className="text-[14px] leading-[20px] font-bold text-[#0f2340]">
              Type: {typeFilter}
            </span>
            <ChevronDown className="w-4 h-4 text-[#55647a]" />
          </button>

          {isTypeOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsTypeOpen(false)}
              />
              <div className="absolute left-0 top-10 w-48 rounded-[12px] border border-[#dce2ea] bg-white p-1 shadow-lg z-50 flex flex-col font-manrope animate-in fade-in zoom-in-95 duration-100">
                {typeOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setTypeFilter(opt);
                      setIsTypeOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-[14px] rounded-[8px] flex items-center justify-between transition-colors ${typeFilter === opt
                        ? "bg-[#e8f5fd] font-bold text-[#1c3a66]"
                        : "text-[#0f2340] hover:bg-gray-50"
                      }`}
                  >
                    <span>{opt}</span>
                    {typeFilter === opt && <Check className="w-3.5 h-3.5 text-[#1c3a66]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Audience Dropdown Filter (Figma 474:241813, 135x36px) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsAudienceOpen(!isAudienceOpen);
              setIsStatusOpen(false);
              setIsTypeOpen(false);
            }}
            className="h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white hover:bg-gray-50 flex items-center justify-between gap-1 shadow-2xs cursor-pointer font-manrope transition-colors"
          >
            <span className="text-[14px] leading-[20px] font-bold text-[#0f2340]">
              Audience: {audienceFilter}
            </span>
            <ChevronDown className="w-4 h-4 text-[#55647a]" />
          </button>

          {isAudienceOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsAudienceOpen(false)}
              />
              <div className="absolute left-0 top-10 w-52 rounded-[12px] border border-[#dce2ea] bg-white p-1 shadow-lg z-50 flex flex-col font-manrope animate-in fade-in zoom-in-95 duration-100">
                {audienceOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setAudienceFilter(opt);
                      setIsAudienceOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-[14px] rounded-[8px] flex items-center justify-between transition-colors ${audienceFilter === opt
                        ? "bg-[#e8f5fd] font-bold text-[#1c3a66]"
                        : "text-[#0f2340] hover:bg-gray-50"
                      }`}
                  >
                    <span>{opt}</span>
                    {audienceFilter === opt && <Check className="w-3.5 h-3.5 text-[#1c3a66]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Selected Date Range Pill (Figma 474:241845, 148x36px) */}
        <div className="h-9 px-3 rounded-[12px] bg-[#e8f5fd] border border-[#1c3a66] flex items-center gap-1.5 shadow-2xs">
          <span className="text-[14px] leading-[20px] font-bold text-[#0f2340] font-manrope">
            Sep – Oct 2026
          </span>
          <Calendar className="w-4 h-4 text-[#1c3a66]" />
        </div>

        {/* Clear Filters Button (Figma 474:241847, 53px) */}
        <button
          type="button"
          onClick={handleClearFilters}
          className="h-9 px-2 text-[14px] leading-[20px] font-bold text-[#1c3a66] hover:underline cursor-pointer font-manrope"
        >
          Clear
        </button>

        {/* Right-aligned Counter: "8 of 42 campaigns" (Figma 474:241848) */}
        <div className="ml-auto text-right">
          <span className="text-[14px] leading-[20px] font-normal text-[#3f4b5e] font-manrope">
            {paginatedItems.length} of {totalCampaignsInCatalog} campaigns
          </span>
        </div>
      </div>

      {/* 
        2. Campaigns Data Table Container (Figma 474:241849, 1136x534px)
        - Layout: Flexbox rows with exact column widths and 16px gap matching Figma 474:241850 & 474:241859
        - Checkbox: 20px
        - Campaign: 194px
        - Type: 120px
        - Audience: 160px
        - Status: 96px (left-aligned compact pill)
        - Schedule: 120px
        - Sent: 80px (right-aligned)
        - Conv.: 80px (right-aligned)
        - Revenue: 96px (right-aligned)
      */}
      <div className="w-full bg-white border border-[#dce2ea] rounded-[16px] shadow-2xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="w-full min-w-[1094px]">
            {/* Header Row (Figma 474:241850, 1134x36px, gap: 16px, px-5) */}
            <div className="w-full h-9 bg-[#f5f7fa] border-b border-[#dce2ea] px-5 flex items-center gap-4 select-none">
              {/* Col 0: Checkbox (20x20) */}
              <div className="w-5 shrink-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  aria-label="Select all campaigns"
                  className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors cursor-pointer ${allCurrentSelected
                      ? "bg-[#1c3a66] border-[#1c3a66] text-white"
                      : "bg-white border-[#7f8ca0] hover:border-[#1c3a66]"
                    }`}
                >
                  {allCurrentSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>

              {/* Col 1: Campaign (194px) */}
              <div className="w-[194px] shrink-0 text-[12px] leading-[16px] font-bold text-[#3f4b5e] font-manrope">
                Campaign
              </div>

              {/* Col 2: Type (120px) */}
              <div className="w-[120px] shrink-0 text-[12px] leading-[16px] font-bold text-[#3f4b5e] font-manrope">
                Type
              </div>

              {/* Col 3: Audience (160px) */}
              <div className="w-[160px] shrink-0 text-[12px] leading-[16px] font-bold text-[#3f4b5e] font-manrope">
                Audience
              </div>

              {/* Col 4: Status (96px) */}
              <div className="w-[96px] shrink-0 text-[12px] leading-[16px] font-bold text-[#3f4b5e] font-manrope">
                Status
              </div>

              {/* Col 5: Schedule (120px) */}
              <div className="w-[120px] shrink-0 text-[12px] leading-[16px] font-bold text-[#3f4b5e] font-manrope">
                Schedule
              </div>

              {/* Col 6: Sent (80px, right-aligned) */}
              <div className="w-[80px] shrink-0 text-[12px] leading-[16px] font-bold text-[#3f4b5e] text-right font-manrope">
                Sent
              </div>

              {/* Col 7: Conv. (80px, right-aligned) */}
              <div className="w-[80px] shrink-0 text-[12px] leading-[16px] font-bold text-[#3f4b5e] text-right font-manrope">
                Conv.
              </div>

              {/* Col 8: Revenue (96px, right-aligned) */}
              <div className="w-[96px] shrink-0 text-[12px] leading-[16px] font-bold text-[#3f4b5e] text-right font-manrope">
                Revenue
              </div>
            </div>

            {/* Table Data Rows (Figma 474:241859, 1134x56px each, gap: 16px, px-5) */}
            <div className="divide-y divide-[#dce2ea]">
              {paginatedItems.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-[14px] text-[#55647a] font-manrope font-medium">
                    No campaigns match the selected filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="mt-2 text-[14px] font-bold text-[#1c3a66] hover:underline cursor-pointer font-manrope"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                paginatedItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelectOne(item.id)}
                      className={`w-full h-14 px-5 flex items-center gap-4 transition-colors cursor-pointer select-none ${isSelected ? "bg-[#e8f5fd]/40" : "hover:bg-[#f9fafb]"
                        }`}
                    >
                      {/* Col 0: Checkbox (20x20) */}
                      <div
                        className="w-5 shrink-0 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(item.id)}
                          aria-label={`Select campaign ${item.name}`}
                          className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors cursor-pointer ${isSelected
                              ? "bg-[#1c3a66] border-[#1c3a66] text-white"
                              : "bg-white border-[#7f8ca0] hover:border-[#1c3a66]"
                            }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </div>

                      {/* Col 1: Campaign Title & Subtitle (194px) */}
                      <Link
                        href={`/marketing/${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-[194px] shrink-0 flex flex-col justify-center group/item"
                      >
                        <span className="text-[14px] leading-[20px] font-bold text-[#0f2340] group-hover/item:text-[#1c3a66] group-hover/item:underline font-manrope truncate">
                          {item.name}
                        </span>
                        <span className="text-[12px] leading-[16px] font-medium text-[#55647a] font-manrope truncate">
                          {item.subtitle}
                        </span>
                      </Link>

                      {/* Col 2: Type (120px) */}
                      <div className="w-[120px] shrink-0 text-[14px] leading-[20px] font-normal text-[#0f2340] font-manrope truncate">
                        {item.type}
                      </div>

                      {/* Col 3: Audience (160px) */}
                      <div className="w-[160px] shrink-0 text-[14px] leading-[20px] font-normal text-[#3f4b5e] font-manrope truncate">
                        {item.audience}
                      </div>

                      {/* Col 4: Status (96px, left-aligned compact pill) */}
                      <div className="w-[96px] shrink-0 flex items-center justify-start">
                        {renderStatusBadge(item.status)}
                      </div>

                      {/* Col 5: Schedule (120px) */}
                      <div className="w-[120px] shrink-0 text-[14px] leading-[20px] font-normal text-[#0f2340] font-manrope truncate">
                        {item.schedule}
                      </div>

                      {/* Col 6: Sent (80px, right-aligned) */}
                      <div
                        className={`w-[80px] shrink-0 text-[14px] leading-[20px] text-right font-manrope ${item.sent === "—"
                            ? "text-[#7f8ca0] font-normal"
                            : "text-[#0f2340] font-semibold"
                          }`}
                      >
                        {item.sent}
                      </div>

                      {/* Col 7: Conv. (80px, right-aligned) */}
                      <div
                        className={`w-[80px] shrink-0 text-[14px] leading-[20px] text-right font-manrope ${item.conv === "—"
                            ? "text-[#7f8ca0] font-normal"
                            : "text-[#0f2340] font-semibold"
                          }`}
                      >
                        {item.conv}
                      </div>

                      {/* Col 8: Revenue (96px, right-aligned) */}
                      <div
                        className={`w-[96px] shrink-0 text-[14px] leading-[20px] text-right ${item.revenue === "—"
                            ? "text-[#7f8ca0] font-normal font-manrope"
                            : "text-[#0f2340] font-extrabold font-archivo tracking-[-0.42px]"
                          }`}
                      >
                        {item.revenue}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 
          3. Pagination Footer Row (Figma 474:241973, 1134x48px)
          - Left: "1–8 of 42 · sorted by start date"
          - Right: "Previous" (32px h) and "Next" (32px h) buttons
        */}
        <div className="w-full h-12 px-5 border-t border-[#dce2ea] flex items-center justify-between bg-white select-none">
          {/* Summary Text */}
          <span className="text-[14px] leading-[20px] font-normal text-[#3f4b5e] font-manrope">
            {filteredItems.length === 0
              ? "0 campaigns"
              : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                currentPage * pageSize,
                filteredItems.length
              )} of ${totalCampaignsInCatalog} · sorted by start date`}
          </span>

          {/* Previous / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`h-8 px-3.5 rounded-[12px] border text-[14px] leading-[20px] font-bold font-manrope transition-colors ${currentPage <= 1
                  ? "border-[#dce2ea] text-[#7f8ca0] cursor-not-allowed bg-transparent"
                  : "border-[#bcc6d3] text-[#0f2340] hover:bg-gray-50 cursor-pointer bg-white"
                }`}
            >
              Previous
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`h-8 px-3.5 rounded-[12px] border text-[14px] leading-[20px] font-bold font-manrope transition-colors ${currentPage >= totalPages
                  ? "border-[#dce2ea] text-[#7f8ca0] cursor-not-allowed bg-transparent"
                  : "border-[#bcc6d3] text-[#0f2340] hover:bg-gray-50 cursor-pointer bg-white"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
