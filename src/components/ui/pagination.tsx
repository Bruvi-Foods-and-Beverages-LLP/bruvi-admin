"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** When provided, a "Rows" selector is shown. */
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: readonly number[];
  /** Plural noun for the summary, e.g. "customers". */
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** 1 … 4 5 [6] 7 8 … 20 — always includes first, last and the neighbours of the current page. */
export function getPageItems(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const items: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) items.push("…");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push("…");
  items.push(totalPages);
  return items;
}

const btn =
  "h-8 min-w-8 px-2 inline-flex items-center justify-center rounded-[8px] border font-sans font-bold text-[12px] leading-4 transition-colors select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

/**
 * Shared table footer: "1–10 of 84 customers", rows-per-page, numbered pages.
 * Default page size is 10 everywhere.
 */
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  label = "results",
  disabled,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);
  const go = (p: number) => {
    if (!disabled && p >= 1 && p <= totalPages && p !== current) onPageChange(p);
  };

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "w-full min-h-14 px-5 py-2 border-t border-[#dce2ea] bg-white flex flex-wrap items-center justify-between gap-3 select-none",
        className,
      )}
    >
      <div className="font-sans text-[14px] leading-5 text-[#3f4b5e] tnum">
        {start.toLocaleString("en-IN")}–{end.toLocaleString("en-IN")} of {total.toLocaleString("en-IN")} {label}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {onPageSizeChange && (
          <label className="flex items-center gap-2 font-sans text-[12px] leading-4 text-[#3f4b5e]">
            Rows
            <span className="relative inline-flex items-center">
              <select
                value={pageSize}
                disabled={disabled}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="h-8 appearance-none pl-2.5 pr-7 rounded-[8px] border border-[#dce2ea] bg-white font-sans font-bold text-[12px] text-[#0f2340] outline-none focus:border-[#1c3a66] cursor-pointer"
              >
                {pageSizeOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-[#3f4b5e]" />
            </span>
          </label>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => go(current - 1)}
            disabled={disabled || current <= 1}
            className={cn(btn, "border-[#dce2ea] bg-white text-[#3f4b5e] hover:bg-[#f5f7fa]")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {getPageItems(current, totalPages).map((it, i) =>
            it === "…" ? (
              <span key={`e${i}`} className="px-1 font-sans text-[12px] text-[#7f8ca0]">
                …
              </span>
            ) : (
              <button
                key={it}
                type="button"
                aria-current={it === current ? "page" : undefined}
                onClick={() => go(it)}
                disabled={disabled}
                className={cn(
                  btn,
                  it === current
                    ? "border-[#1c3a66] bg-[#1c3a66] text-white"
                    : "border-[#dce2ea] bg-white text-[#3f4b5e] hover:bg-[#f5f7fa]",
                )}
              >
                {it}
              </button>
            ),
          )}
          <button
            type="button"
            aria-label="Next page"
            onClick={() => go(current + 1)}
            disabled={disabled || current >= totalPages}
            className={cn(btn, "border-[#dce2ea] bg-white text-[#3f4b5e] hover:bg-[#f5f7fa]")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

/**
 * Client-side pagination for lists that are already fully loaded.
 * Returns the current page of `items` plus ready-to-spread props for <Pagination />.
 */
export function usePagination<T>(items: readonly T[], initialPageSize: number = DEFAULT_PAGE_SIZE, label?: string) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, totalPages);

  const pageItems = React.useMemo(
    () => items.slice((current - 1) * pageSize, current * pageSize),
    [items, current, pageSize],
  );

  return {
    pageItems,
    page: current,
    pageSize,
    reset: () => setPage(1),
    paginationProps: {
      page: current,
      pageSize,
      total: items.length,
      label,
      onPageChange: setPage,
      onPageSizeChange: (s: number) => {
        setPageSize(s);
        setPage(1);
      },
    } satisfies PaginationProps,
  };
}
