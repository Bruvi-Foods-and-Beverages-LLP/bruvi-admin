"use client";

import * as React from "react";
import { useAppSelector } from "@/store";
import { ModifierAppPreview } from "./modifier-app-preview";

/**
 * In-app preview of the selected group (Figma 225:92186, content from the mobile app frame 225:61688)
 */
export function ModifierPreviewCard() {
  const { groups, selectedId, loading } = useAppSelector((s) => s.modifierGroups);
  const group = groups.find((g) => g.id === selectedId);

  return (
    <aside className="flex w-full flex-col items-center gap-4 self-start rounded-[16px] border border-border bg-surface-warm p-[21px] @5xl:w-[400px] @5xl:shrink-0">
      <div className="flex w-full items-center justify-between gap-2">
        <span className="min-w-0 truncate font-serif text-[11px] leading-[14px] tracking-[0.14em] text-text-secondary uppercase">
          Preview · {group ? group.name : "Group"} in app
        </span>
        <span className="shrink-0 text-[12px] leading-4 font-bold text-text-brand">Kiosk · POS</span>
      </div>

      <div className="w-full max-w-[358px] rounded-[24px] bg-surface p-4 shadow-floating">
        {group ? (
          <ModifierAppPreview key={group.id} group={group} />
        ) : (
          <p className="py-10 text-center text-[14px] leading-5 text-text-muted">
            {loading ? "Loading preview…" : "Select a group to preview it"}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-1 border-t border-border pt-[13px]">
        <span className="text-[12px] leading-4 font-bold text-text">How each type deducts stock</span>
        <p className="text-[12px] leading-4 font-medium text-text-secondary">
          Choice swaps an ingredient · Level scales the recipe qty ×0 / 0.6 / 1 / 1.4 · Count adds one portion per step · Text never touches stock
        </p>
      </div>
    </aside>
  );
}
