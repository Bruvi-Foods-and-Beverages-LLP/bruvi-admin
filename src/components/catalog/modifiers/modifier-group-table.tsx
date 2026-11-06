"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchModifierGroups,
  selectModifierGroup,
  setModifierSearch,
} from "@/store/slices/modifier-groups-slice";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";
import {
  MODIFIER_TYPE_LABEL,
  defaultLabel,
  groupStatus,
  matchesSearch,
  summariseOptions,
} from "@/lib/catalog/modifier-groups";
import { ModifierTypeIcon } from "./modifier-type-icon";

const ROW_GRID =
  "grid grid-cols-[minmax(0,1fr)_80px_96px_64px_160px] items-center gap-3 px-5";

/**
 * Modifier groups table card (Figma 225:92024)
 */
interface TableProps {
  /** Reorder mode: the working order of group ids and a mover */
  reorder?: { ids: string[]; onMove: (index: number, by: -1 | 1) => void } | null;
}

export function ModifierGroupTable({ reorder = null }: TableProps) {
  const dispatch = useAppDispatch();
  const { groups, loading, error, search, selectedId } = useAppSelector(
    (s) => s.modifierGroups,
  );
  const byId = new Map(groups.map((g) => [g.id, g]));
  const visible = reorder
    ? reorder.ids.map((id) => byId.get(id)).filter((g): g is (typeof groups)[number] => Boolean(g))
    : groups.filter((g) => matchesSearch(g, search));

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-[16px] border border-border bg-surface">
      {/* Card header (Figma 225:92025) */}
      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-[18px] leading-[26px] font-extrabold text-text">
            {loading && groups.length === 0
              ? "Modifier groups"
              : `${groups.length} modifier ${groups.length === 1 ? "group" : "groups"}`}
          </h2>
          <p className="text-[12px] leading-4 font-medium text-text-secondary">
            4 types: Choice · Level · Count · Text · products set their own defaults &amp; limits
          </p>
        </div>
        <label className="flex h-9 w-full shrink-0 items-center gap-2 rounded-[12px] border border-border-strong bg-background-subtle px-[13px] sm:w-[212px]">
          <Search className="size-4 shrink-0 text-text-muted" aria-hidden />
          <input
            value={search}
            disabled={Boolean(reorder)}
            onChange={(e) => dispatch(setModifierSearch(e.target.value))}
            placeholder="Search groups or options"
            aria-label="Search groups or options"
            className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 text-text outline-none placeholder:text-text-muted"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Column header (Figma 225:92037) */}
          <div
            className={cn(
              ROW_GRID,
              "h-9 border-y border-border bg-background-subtle text-[12px] leading-4 font-bold tracking-[0.04em] text-text-secondary uppercase",
            )}
          >
            <span>Group · options</span>
            <span>Type</span>
            <span>Default</span>
            <span className="text-right">Items</span>
            <span>Status</span>
          </div>

          {loading && groups.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={cn(ROW_GRID, "h-12 border-b border-border")}>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="ml-auto h-4 w-6" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))
          ) : error ? (
            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
              <p className="text-[14px] leading-5 text-error">{error}</p>
              <button
                type="button"
                onClick={() => dispatch(fetchModifierGroups())}
                className="h-9 cursor-pointer rounded-[12px] border-[1.5px] border-border-input bg-surface px-[17.5px] text-[14px] font-bold text-text hover:bg-background-subtle"
              >
                Retry
              </button>
            </div>
          ) : visible.length === 0 ? (
            <p className="px-5 py-12 text-center text-[14px] leading-5 text-text-muted">
              {groups.length === 0
                ? "No modifier groups yet."
                : "No groups or options match your search."}
            </p>
          ) : (
            visible.map((group, index) => {
              const status = groupStatus(group);
              const selected = group.id === selectedId;
              return (
                <div
                  key={group.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => dispatch(selectModifierGroup(group.id))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      dispatch(selectModifierGroup(group.id));
                    }
                  }}
                  aria-pressed={selected}
                  className={cn(
                    ROW_GRID,
                    "h-12 w-full cursor-pointer border-b border-border text-left transition-colors last:border-b-0",
                    selected
                      ? "border-l-2 border-l-primary bg-surface-brand pl-[18px]"
                      : "hover:bg-background-subtle",
                  )}
                >
                  <span className="flex min-w-0 flex-col">
                    <Link
                      href={`/catalog/customisation/${group.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="truncate text-[14px] leading-5 font-bold text-text hover:text-text-brand hover:underline"
                    >
                      {group.name}
                    </Link>
                    <span className="truncate text-[12px] leading-4 font-medium text-text-secondary">
                      {summariseOptions(group)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-[14px] leading-5 text-text">
                    <ModifierTypeIcon type={group.groupType} />
                    {MODIFIER_TYPE_LABEL[group.groupType]}
                  </span>
                  <span className="truncate text-[14px] leading-5 font-semibold text-text">
                    {defaultLabel(group)}
                  </span>
                  <span className="text-right text-[14px] leading-5 font-bold text-text-brand">
                    {group.productCount ?? 0}
                  </span>
                  {reorder ? (
                    <span className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        aria-label={`Move ${group.name} up`}
                        disabled={index === 0}
                        onClick={() => reorder.onMove(index, -1)}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-[8px] border border-border-input text-text hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Move ${group.name} down`}
                        disabled={index === visible.length - 1}
                        onClick={() => reorder.onMove(index, 1)}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-[8px] border border-border-input text-text hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                    </span>
                  ) : (
                  <span className="flex">
                    <span
                      className={cn(
                        "inline-flex h-6 max-w-full items-center truncate rounded-[12px] px-2 text-[12px] leading-4 font-bold",
                        status.live
                          ? "bg-success-surface text-success"
                          : "bg-warning-surface text-warning",
                      )}
                    >
                      {status.label}
                    </span>
                  </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
