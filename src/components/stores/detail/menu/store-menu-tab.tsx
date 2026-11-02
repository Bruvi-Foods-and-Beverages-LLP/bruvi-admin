"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { StoreEntity } from "@/store/slices/stores-slice";
import {
  fetchStoreMenu,
  updateStoreMenuItem,
  bulkUpdateStoreMenu,
  setSearchQuery,
  setSelectedCategory,
  setFilterUnavailableOnly,
  toggleSelectItem,
  selectAllItems,
  clearSelection,
  dismissPushStatus,
} from "@/store/slices/store-menu-slice";
import { StoreMenuItem } from "@/types/store-menu";
import { StoreMenuFilterBar } from "./store-menu-filter-bar";
import { StoreMenuBulkBar } from "./store-menu-bulk-bar";
import { StoreMenuTableHeader } from "./store-menu-table-header";
import { StoreMenuCategorySection } from "./store-menu-category-section";
import { StoreMenuItemRow } from "./store-menu-item-row";
import { StoreMenuOverrideModal } from "./store-menu-override-modal";
import { StoreMenuHideModal } from "./store-menu-hide-modal";
import { StoreIcon } from "@/components/icons";
import { AlertCircle, CheckCircle2, RotateCcw, X } from "lucide-react";

interface StoreMenuTabProps {
  store: StoreEntity;
}

export function StoreMenuTab({ store }: StoreMenuTabProps) {
  const dispatch = useAppDispatch();
  const {
    currentStoreMenu,
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    filterUnavailableOnly,
    selectedItemIds,
    isSubmitting,
    pushStatus,
  } = useAppSelector((state) => state.storeMenu);

  const [isOverrideModalOpen, setIsOverrideModalOpen] = React.useState(false);
  const [isHideModalOpen, setIsHideModalOpen] = React.useState(false);

  // Initial load
  React.useEffect(() => {
    if (store?.id || store?.code) {
      dispatch(fetchStoreMenu(store.code || store.id));
    }
  }, [dispatch, store?.id, store?.code]);

  // Dismiss push toast after 5 seconds
  React.useEffect(() => {
    if (pushStatus) {
      const timer = setTimeout(() => {
        dispatch(dismissPushStatus());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, pushStatus]);

  // Filter items
  const filteredItems = React.useMemo(() => {
    const items = currentStoreMenu?.items || [];
    return items.filter((item) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSku = item.sku.toLowerCase().includes(query);
        const matchesSub = item.subtitle?.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesSub) return false;
      }

      // Unavailable only filter
      if (filterUnavailableOnly) {
        if (item.status === "AVAILABLE") return false;
      }

      // Category filter
      if (selectedCategory !== "all" && !filterUnavailableOnly) {
        const normalizedItemCat = item.category.toLowerCase().replace(/[^a-z]/g, "");
        const normalizedSelected = selectedCategory.toLowerCase().replace(/[^a-z]/g, "");
        if (normalizedItemCat !== normalizedSelected) return false;
      }

      return true;
    });
  }, [currentStoreMenu?.items, searchQuery, selectedCategory, filterUnavailableOnly]);

  // Group filtered items by category preserving standard order
  const groupedItems = React.useMemo(() => {
    const categoryOrder = ["Vietnamese", "Specialty", "Matcha", "Bites", "Add-ons", "LAB"];
    const groups: { category: string; items: StoreMenuItem[]; totalCount: number }[] = [];

    const categoryTotals: Record<string, number> = {
      Vietnamese: 12,
      Specialty: 8,
      Matcha: 4,
      Bites: 6,
      "Add-ons": 9,
      LAB: 3,
    };

    categoryOrder.forEach((cat) => {
      const catItems = filteredItems.filter(
        (i) => i.category.toLowerCase().replace(/[^a-z]/g, "") === cat.toLowerCase().replace(/[^a-z]/g, "")
      );
      if (catItems.length > 0) {
        groups.push({
          category: cat,
          items: catItems,
          totalCount: categoryTotals[cat] || catItems.length,
        });
      }
    });

    // Capture any items in custom categories
    filteredItems.forEach((i) => {
      const alreadyGrouped = groups.some(
        (g) => g.category.toLowerCase().replace(/[^a-z]/g, "") === i.category.toLowerCase().replace(/[^a-z]/g, "")
      );
      if (!alreadyGrouped) {
        groups.push({
          category: i.category,
          items: [i],
          totalCount: 1,
        });
      }
    });

    return groups;
  }, [filteredItems]);

  // Selection states
  const visibleItemIds = filteredItems.map((i) => i.itemId);
  const allVisibleSelected =
    visibleItemIds.length > 0 && visibleItemIds.every((id) => selectedItemIds.includes(id));
  const someVisibleSelected =
    visibleItemIds.some((id) => selectedItemIds.includes(id)) && !allVisibleSelected;

  const handleToggleSelectAll = () => {
    if (allVisibleSelected) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAllItems(visibleItemIds));
    }
  };

  const handleToggleChannel = (
    itemId: string,
    channel: "channelCounter" | "channelApp" | "channelKiosk" | "channelQr",
    val: boolean
  ) => {
    dispatch(
      updateStoreMenuItem({
        storeId: store.id || store.code,
        itemId,
        payload: { [channel]: val },
      })
    );
  };

  const handleBulkMarkAvailable = () => {
    dispatch(
      bulkUpdateStoreMenu({
        storeId: store.id || store.code,
        payload: {
          itemIds: selectedItemIds,
          action: "mark_available",
        },
      })
    );
  };

  const handleBulkMarkSoldOut = () => {
    dispatch(
      bulkUpdateStoreMenu({
        storeId: store.id || store.code,
        payload: {
          itemIds: selectedItemIds,
          action: "mark_sold_out",
        },
      })
    );
  };

  const handleApplyPriceOverride = (overridePricePaise: number | null) => {
    dispatch(
      bulkUpdateStoreMenu({
        storeId: store.id || store.code,
        payload: {
          itemIds: selectedItemIds,
          action: "set_price_override",
          overridePricePaise,
        },
      })
    );
    setIsOverrideModalOpen(false);
  };

  const handleApplyHideChannel = (channel: "counter" | "app" | "kiosk" | "qr" | "all") => {
    dispatch(
      bulkUpdateStoreMenu({
        storeId: store.id || store.code,
        payload: {
          itemIds: selectedItemIds,
          action: "hide_channel",
          channel,
        },
      })
    );
    setIsHideModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Toast Notification Banner for Push to Devices */}
      {pushStatus && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 p-4 rounded-[12px] bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] shadow-sm animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="text-body-s font-bold">{pushStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(dismissPushStatus())}
            className="p-1 rounded-full hover:bg-black/5 text-[#15803D] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Menu Surface Card (Figma Node 225:88167) */}
      <div className="w-full rounded-[16px] bg-surface border border-border shadow-xs overflow-hidden flex flex-col">
        {/* Row 0: Search & Filter Chips Bar (Figma Node 225:88168) */}
        <StoreMenuFilterBar
          searchQuery={searchQuery}
          onSearchChange={(val) => dispatch(setSearchQuery(val))}
          categories={currentStoreMenu?.categories || []}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => dispatch(setSelectedCategory(catId))}
          unavailableCount={currentStoreMenu?.unavailableCount || 0}
          filterUnavailableOnly={filterUnavailableOnly}
          onToggleFilterUnavailable={() =>
            dispatch(setFilterUnavailableOnly(!filterUnavailableOnly))
          }
        />

        {/* Row 1: Bulk Action Bar (Figma Node 225:88195) */}
        <StoreMenuBulkBar
          selectedCount={selectedItemIds.length}
          onMarkAvailable={handleBulkMarkAvailable}
          onMarkSoldOut={handleBulkMarkSoldOut}
          onOpenHideChannelsModal={() => setIsHideModalOpen(true)}
          onOpenPriceOverrideModal={() => setIsOverrideModalOpen(true)}
          onClearSelection={() => dispatch(clearSelection())}
          isSubmitting={isSubmitting}
        />

        {/* Row 2: Table Header (Figma Node 225:88204) */}
        <StoreMenuTableHeader
          allSelected={allVisibleSelected}
          someSelected={someVisibleSelected}
          onToggleSelectAll={handleToggleSelectAll}
        />

        {/* Loading Skeleton */}
        {isLoading && !currentStoreMenu ? (
          <div className="p-8 flex flex-col gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-16 w-full rounded-[8px] bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          /* Error Fallback */
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-surface border border-border text-error mb-4">
              <AlertCircle className="h-8 w-8 text-error" />
            </div>
            <h3 className="text-heading-s text-text">Failed to load store menu</h3>
            <p className="text-body-s text-text-muted max-w-md mt-1.5 mb-6">
              {error}
            </p>
            <button
              type="button"
              onClick={() => dispatch(fetchStoreMenu(store.code || store.id))}
              className="h-9 px-5 rounded-[12px] bg-primary hover:bg-navy-900 text-label text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Zero-Data / Filter Empty State (Rule from GEMINI.md 6.2) */
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f7fa] border border-[#dce2ea] text-[#55647A] mb-4">
              <StoreIcon className="h-8 w-8 text-[#55647A]" />
            </div>
            <h3 className="text-heading-s text-[#0F2340]">
              No items match your filter
            </h3>
            <p className="text-body-s text-[#55647A] max-w-md mt-1.5 mb-6 leading-relaxed">
              {searchQuery
                ? `No products or add-ons found matching "${searchQuery}".`
                : "No menu items match the active category filters."}
            </p>
            <button
              type="button"
              onClick={() => {
                dispatch(setSearchQuery(""));
                dispatch(setSelectedCategory("all"));
                dispatch(setFilterUnavailableOnly(false));
              }}
              className="h-9 px-5 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset filters</span>
            </button>
          </div>
        ) : (
          /* Grouped Category Sections and Rows (Figma Nodes 225:88214 - 225:88515) */
          <div className="flex flex-col">
            {groupedItems.map((group) => (
              <div key={group.category} className="flex flex-col">
                <StoreMenuCategorySection
                  categoryName={group.category}
                  shownCount={group.items.length}
                  totalCount={group.totalCount}
                />
                {group.items.map((item) => (
                  <StoreMenuItemRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItemIds.includes(item.itemId)}
                    onToggleSelect={(id) => dispatch(toggleSelectItem(id))}
                    onToggleChannel={handleToggleChannel}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialogs */}
      <StoreMenuOverrideModal
        isOpen={isOverrideModalOpen}
        itemCount={selectedItemIds.length}
        onClose={() => setIsOverrideModalOpen(false)}
        onApply={handleApplyPriceOverride}
        isSubmitting={isSubmitting}
      />

      <StoreMenuHideModal
        isOpen={isHideModalOpen}
        itemCount={selectedItemIds.length}
        onClose={() => setIsHideModalOpen(false)}
        onApply={handleApplyHideChannel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
