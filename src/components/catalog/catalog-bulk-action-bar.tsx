"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearSelection,
  executeBulkAction,
} from "@/store/slices/catalog-slice";
import { EyeOff, FolderInput, ChevronDown, Trash2 } from "lucide-react";

/**
 * Catalog Bulk Action Bar (Figma 225:90342)
 * Appears at top of table card when 1 or more products are checked.
 * Height 48px, background #e8f5fd, border-b #dce2ea, px-5
 */
export function CatalogBulkActionBar() {
  const dispatch = useAppDispatch();
  const { selectedProductIds, isSubmitting, allCategories } = useAppSelector(
    (state) => state.catalog
  );

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);

  if (selectedProductIds.length === 0) return null;

  return (
    <div className="h-12 w-full bg-[#e8f5fd] border-b border-[#dce2ea] px-5 flex items-center gap-3 animate-in fade-in select-none font-sans">
      {/* 1. Indeterminate Selection Indicator (Figma 225:90343) */}
      <div className="w-6 h-6 rounded-[4px] bg-[#1C3A66] flex items-center justify-center shrink-0">
        <div className="w-2.5 h-[2px] bg-white rounded-full" />
      </div>

      {/* 2. Selection Count Label (Figma 225:90348) */}
      <span className="text-[14px] leading-5 font-bold text-[#0F2340]">
        {selectedProductIds.length} selected
      </span>

      {/* 3. Vertical Divider (Figma 225:90349) */}
      <div className="w-[1px] h-5 bg-[#7F8CA0]/60 shrink-0 mx-1" />

      {/* 4. Hide Action Button (Figma 225:90350) */}
      <button
        type="button"
        onClick={() =>
          dispatch(
            executeBulkAction({
              action: "HIDE",
              productIds: selectedProductIds,
            })
          )
        }
        disabled={isSubmitting}
        className="h-8 px-3 rounded-[12px] bg-white border border-[#dce2ea] text-[14px] leading-5 font-bold text-[#0F2340] hover:bg-[#f5f7fa] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
      >
        <EyeOff className="h-4 w-4 text-[#0F2340]" />
        <span>Hide</span>
      </button>

      {/* 5. Change Category Button (Figma 225:90356) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          disabled={isSubmitting}
          className="h-8 px-3 rounded-[12px] bg-white border border-[#dce2ea] text-[14px] leading-5 font-bold text-[#0F2340] hover:bg-[#f5f7fa] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <FolderInput className="h-4 w-4 text-[#0F2340]" />
          <span>Change category</span>
          <ChevronDown className="h-3 w-3 text-[#55647A] ml-0.5" />
        </button>

        {isCategoryDropdownOpen && (
          <div className="absolute left-0 mt-1.5 w-52 rounded-[12px] border border-[#dce2ea] bg-white p-1.5 shadow-floating z-40">
            <span className="block px-3 py-1.5 text-[11px] font-bold text-[#7F8CA0] uppercase tracking-wider">
              Move to Category
            </span>
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  dispatch(
                    executeBulkAction({
                      action: "CHANGE_CATEGORY",
                      productIds: selectedProductIds,
                      categoryId: cat.id,
                    })
                  );
                  setIsCategoryDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-[8px] text-[13px] font-semibold text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 6. Batch Archive Button */}
      <button
        type="button"
        onClick={() => {
          if (
            confirm(
              `Are you sure you want to archive ${selectedProductIds.length} products? They will be hidden from all stores.`
            )
          ) {
            dispatch(
              executeBulkAction({
                action: "SET_STATUS",
                productIds: selectedProductIds,
                status: "ARCHIVED",
              })
            );
          }
        }}
        disabled={isSubmitting}
        className="h-8 px-3 rounded-[12px] bg-white border border-[#fce8e6] text-[14px] leading-5 font-bold text-[#c0352b] hover:bg-[#fce8e6] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        <span>Archive</span>
      </button>

      {/* 7. Clear selection link (Figma 225:90363) */}
      <button
        type="button"
        onClick={() => dispatch(clearSelection())}
        className="ml-auto text-[14px] leading-5 font-bold text-[#1C3A66] hover:underline cursor-pointer"
      >
        Clear selection
      </button>
    </div>
  );
}
