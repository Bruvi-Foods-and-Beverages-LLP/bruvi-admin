"use client";

import * as React from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setFilterSearch,
  setFilterTab,
  setFilterCategory,
  setFilterStation,
  setFilterOwner,
  resetFilters,
  fetchRecipes,
} from "@/store/slices/recipes-slice";
import { cn } from "@/lib/utils/cn";

/**
 * Recipes Filter Bar (Figma Frame 474:229642)
 * Height 36px flex container with 280px search box, segmented tab pills,
 * category/station/owner dropdowns, clear action, and live average margin KPI label.
 * Fully compliant with global semantic typography (.text-body-s, .text-label, .text-label-semi, .text-caption)
 * and semantic theme tokens (bg-background-subtle, text-text, text-text-secondary, text-text-muted, border-border).
 */
export function RecipesFilterBar() {
  const dispatch = useAppDispatch();
  const { filters, metrics, categories, stations, owners } = useAppSelector(
    (state) => state.recipes
  );

  const [localSearch, setLocalSearch] = React.useState(filters.search || "");
  const [activeDropdown, setActiveDropdown] = React.useState<
    "category" | "station" | "owner" | null
  >(null);

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        dispatch(setFilterSearch(localSearch));
        dispatch(fetchRecipes());
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, dispatch]);

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.tab !== "ALL" ||
    filters.category !== "ALL" ||
    filters.station !== "ALL" ||
    filters.owner !== "ALL";

  return (
    <div className="w-full flex items-center justify-between gap-2 select-none overflow-x-auto no-scrollbar">
      {/* Left side: Search + Filter controls (Figma Frame 474:229642) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* 1. Search Box (Figma Frame 474:229643 - w: 280px, h: 36px, r: 12px) */}
        <div className="relative w-[280px] h-9 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted stroke-[1.75]" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search recipes, SKUs, ingredients"
            className="w-full h-9 pl-9 pr-8 rounded-[12px] bg-background-subtle border border-border-strong text-body-s text-text placeholder:text-text-muted focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary transition-all outline-none"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                dispatch(setFilterSearch(""));
                dispatch(fetchRecipes());
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. All · 24 Tab Pill (Figma Frame 474:229651) */}
        <button
          type="button"
          onClick={() => {
            dispatch(setFilterTab("ALL"));
            dispatch(fetchRecipes());
          }}
          className={cn(
            "h-9 px-3 rounded-[18px] text-label transition-all cursor-pointer flex items-center gap-1 shrink-0",
            filters.tab === "ALL"
              ? "bg-surface-inverse text-text-inverse shadow-2xs"
              : "bg-surface border border-border text-text hover:bg-background-subtle"
          )}
        >
          <span>All · {metrics.totalCount}</span>
        </button>

        {/* 3. Drafts · 3 Tab Pill (Figma Frame 474:229653) */}
        <button
          type="button"
          onClick={() => {
            dispatch(setFilterTab("DRAFTS"));
            dispatch(fetchRecipes());
          }}
          className={cn(
            "h-9 px-3 rounded-[18px] text-label-semi transition-all cursor-pointer flex items-center gap-1 shrink-0",
            filters.tab === "DRAFTS"
              ? "bg-surface-inverse text-text-inverse shadow-2xs"
              : "bg-surface border border-border text-text hover:bg-background-subtle"
          )}
        >
          <span>Drafts · {metrics.draftsCount}</span>
        </button>

        {/* 4. Category Dropdown (Figma Frame 474:229655) */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() =>
              setActiveDropdown(activeDropdown === "category" ? null : "category")
            }
            className={cn(
              "h-9 px-3.5 rounded-[12px] bg-surface border border-border-strong text-label-semi text-text flex items-center gap-1 hover:bg-background-subtle transition-colors cursor-pointer",
              filters.category !== "ALL" && "border-primary bg-surface-brand"
            )}
          >
            <span>
              Category: {filters.category === "ALL" ? "All" : filters.category}
            </span>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </button>

          {activeDropdown === "category" && (
            <div className="absolute left-0 top-10.5 z-20 w-44 rounded-[12px] border border-border bg-surface py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  dispatch(setFilterCategory("ALL"));
                  dispatch(fetchRecipes());
                  setActiveDropdown(null);
                }}
                className={cn(
                  "w-full px-3 py-1.5 text-left text-body-s text-text hover:bg-background-subtle transition-colors cursor-pointer",
                  filters.category === "ALL" && "font-bold text-text-brand bg-surface-brand"
                )}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    dispatch(setFilterCategory(cat));
                    dispatch(fetchRecipes());
                    setActiveDropdown(null);
                  }}
                  className={cn(
                    "w-full px-3 py-1.5 text-left text-body-s text-text hover:bg-background-subtle transition-colors cursor-pointer",
                    filters.category === cat && "font-bold text-text-brand bg-surface-brand"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. Station Dropdown (Figma Frame 474:229661) */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() =>
              setActiveDropdown(activeDropdown === "station" ? null : "station")
            }
            className={cn(
              "h-9 px-3.5 rounded-[12px] bg-surface border border-border-strong text-label-semi text-text flex items-center gap-1 hover:bg-background-subtle transition-colors cursor-pointer",
              filters.station !== "ALL" && "border-primary bg-surface-brand"
            )}
          >
            <span>
              Station: {filters.station === "ALL" ? "All" : filters.station}
            </span>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </button>

          {activeDropdown === "station" && (
            <div className="absolute left-0 top-10.5 z-20 w-36 rounded-[12px] border border-border bg-surface py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  dispatch(setFilterStation("ALL"));
                  dispatch(fetchRecipes());
                  setActiveDropdown(null);
                }}
                className={cn(
                  "w-full px-3 py-1.5 text-left text-body-s text-text hover:bg-background-subtle transition-colors cursor-pointer",
                  filters.station === "ALL" && "font-bold text-text-brand bg-surface-brand"
                )}
              >
                All Stations
              </button>
              {stations.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    dispatch(setFilterStation(st));
                    dispatch(fetchRecipes());
                    setActiveDropdown(null);
                  }}
                  className={cn(
                    "w-full px-3 py-1.5 text-left text-body-s text-text hover:bg-background-subtle transition-colors cursor-pointer",
                    filters.station === st && "font-bold text-text-brand bg-surface-brand"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 6. Owner Dropdown (Figma Frame 474:229665) */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() =>
              setActiveDropdown(activeDropdown === "owner" ? null : "owner")
            }
            className={cn(
              "h-9 px-3.5 rounded-[12px] bg-surface border border-border-strong text-label-semi text-text flex items-center gap-1 hover:bg-background-subtle transition-colors cursor-pointer",
              filters.owner !== "ALL" && "border-primary bg-surface-brand"
            )}
          >
            <span>
              Owner: {filters.owner === "ALL" ? "All" : filters.owner}
            </span>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </button>

          {activeDropdown === "owner" && (
            <div className="absolute left-0 top-10.5 z-20 w-36 rounded-[12px] border border-border bg-surface py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  dispatch(setFilterOwner("ALL"));
                  dispatch(fetchRecipes());
                  setActiveDropdown(null);
                }}
                className={cn(
                  "w-full px-3 py-1.5 text-left text-body-s text-text hover:bg-background-subtle transition-colors cursor-pointer",
                  filters.owner === "ALL" && "font-bold text-text-brand bg-surface-brand"
                )}
              >
                All Owners
              </button>
              {owners.map((ow) => (
                <button
                  key={ow}
                  type="button"
                  onClick={() => {
                    dispatch(setFilterOwner(ow));
                    dispatch(fetchRecipes());
                    setActiveDropdown(null);
                  }}
                  className={cn(
                    "w-full px-3 py-1.5 text-left text-body-s text-text hover:bg-background-subtle transition-colors cursor-pointer",
                    filters.owner === ow && "font-bold text-text-brand bg-surface-brand"
                  )}
                >
                  {ow}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 7. Clear Action (Figma Frame 474:229669 - Text 474:229670) */}
        <button
          type="button"
          onClick={() => {
            setLocalSearch("");
            dispatch(resetFilters());
            dispatch(fetchRecipes());
          }}
          className={cn(
            "px-2 text-label text-text-brand transition-opacity cursor-pointer shrink-0",
            hasActiveFilters
              ? "hover:underline opacity-100"
              : "opacity-75 hover:opacity-100"
          )}
        >
          Clear
        </button>
      </div>

      {/* Right side: Avg margin KPI stat (Figma Text 474:229671) */}
      <div className="text-caption text-text-secondary whitespace-nowrap shrink-0 pl-2">
        Avg margin {metrics.avgMargin.toFixed(1)}% · target {metrics.targetMargin.toFixed(0)}%
      </div>
    </div>
  );
}
