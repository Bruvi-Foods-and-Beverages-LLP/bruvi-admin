"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { OPTION_NOUN } from "@/lib/catalog/modifier-groups";
import {
  isStepperStyle,
  newOptionKey,
  type GroupDraft,
  type OptionDraft,
} from "@/lib/catalog/modifier-editor";
import type { ModifierGroupDetail } from "@/types/catalog";

export const FIELD =
  "h-9 w-full min-w-0 rounded-[10px] border border-border-input bg-surface px-3 text-[14px] leading-5 text-text outline-none placeholder:text-text-muted focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus-halo disabled:cursor-not-allowed disabled:bg-background-subtle disabled:text-text-muted";

interface Props {
  draft: GroupDraft;
  original: ModifierGroupDetail;
  /** Groups an option can open when chosen (milk → milk amount) */
  nestable: { id: string; name: string }[];
  canEdit: boolean;
  onChange: (next: GroupDraft) => void;
}

/** Options table (Figma 225:92356 → Levels), editable in place. */
export function ModifierOptionsCard({ draft, original, nestable, canEdit, onChange }: Props) {
  const noun = OPTION_NOUN[draft.groupType];
  const stepper = isStepperStyle(draft);
  const picked = new Map(original.modifiers.map((m) => [m.id, m.pickedPercent ?? 0]));
  const grid = stepper
    ? "grid-cols-[minmax(140px,1fr)_minmax(96px,0.6fr)_88px_72px_76px_64px_40px]"
    : "grid-cols-[minmax(140px,1fr)_minmax(96px,0.6fr)_88px_76px_64px_40px]";

  const setOption = (key: string, patch: Partial<OptionDraft>) =>
    onChange({ ...draft, options: draft.options.map((o) => (o.key === key ? { ...o, ...patch } : o)) });

  const move = (index: number, by: -1 | 1) => {
    const next = [...draft.options];
    const [item] = next.splice(index, 1);
    next.splice(index + by, 0, item);
    onChange({ ...draft, options: next });
  };

  const remove = (key: string) =>
    onChange({
      ...draft,
      options: draft.options.filter((o) => o.key !== key),
      defaultKey: draft.defaultKey === key ? null : draft.defaultKey,
    });

  const add = () => {
    const key = newOptionKey();
    onChange({
      ...draft,
      options: [
        ...draft.options,
        {
          key,
          id: null,
          name: "",
          detail: "",
          price: "",
          maxQuantity: stepper ? 4 : 1,
          isAvailable: true,
          nestedGroupId: null,
          recipeMultiplier: null,
          code: null,
        },
      ],
    });
  };

  if (draft.groupType === "TEXT") {
    return (
      <section className="rounded-[16px] border border-border bg-surface px-5 py-4">
        <h2 className="text-[18px] leading-[26px] font-extrabold text-text">{noun.title}</h2>
        <p className="text-[12px] leading-4 font-medium text-text-secondary">
          Customers type a short note for the barista. Set its limit and wording under Selection rules.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[16px] border border-border bg-surface">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-[18px] leading-[26px] font-extrabold text-text">{noun.title}</h2>
          <p className="text-[12px] leading-4 font-medium text-text-secondary">
            {stepper
              ? "Each option is a stepper; price is per unit beyond the free ones"
              : "Tap a radio to set the default · price is what choosing it adds"}
          </p>
        </div>
        <span className="inline-flex h-6 shrink-0 items-center rounded-[12px] bg-info-surface px-2 text-[12px] leading-4 font-bold text-info">
          {draft.options.length} {draft.options.length === 1 ? noun.singular : noun.plural}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className={cn("min-w-[640px]", stepper && "min-w-[720px]")}>
          <div
            className={cn(
              "grid h-9 items-center gap-3 border-y border-border bg-background-subtle px-5 text-[12px] leading-4 font-bold tracking-[0.04em] text-text-secondary uppercase",
              grid,
            )}
          >
            <span>{noun.singular}</span>
            <span>Detail</span>
            <span>Price ₹</span>
            {stepper && <span>Max</span>}
            <span>In stock</span>
            <span className="text-center">Default</span>
            <span />
          </div>

          {draft.options.length === 0 && (
            <p className="px-5 py-8 text-center text-[14px] leading-5 text-text-muted">
              No {noun.plural} yet. Add the first one below.
            </p>
          )}

          {draft.options.map((o, i) => {
            const isDefault = o.key === draft.defaultKey;
            return (
              <div
                key={o.key}
                className={cn(
                  "grid min-h-14 items-center gap-3 border-b border-border px-5 py-2",
                  grid,
                  isDefault && "bg-surface-brand",
                )}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <input
                    className={FIELD}
                    value={o.name}
                    disabled={!canEdit}
                    maxLength={64}
                    placeholder={`${noun.singular[0].toUpperCase()}${noun.singular.slice(1)} name`}
                    aria-label="Option name"
                    onChange={(e) => setOption(o.key, { name: e.target.value })}
                  />
                  {(o.id || nestable.length > 0) && (
                    <div className="flex min-w-0 items-center gap-2 text-[12px] leading-4 font-medium text-text-secondary">
                      {o.id && <span className="shrink-0">picked in {picked.get(o.id) ?? 0}%</span>}
                      {nestable.length > 0 && !stepper && (
                        <select
                          className="h-6 min-w-0 rounded-[6px] border border-border bg-surface px-1 text-[12px] text-text-secondary"
                          value={o.nestedGroupId ?? ""}
                          disabled={!canEdit}
                          aria-label="Opens group"
                          onChange={(e) => setOption(o.key, { nestedGroupId: e.target.value || null })}
                        >
                          <option value="">Opens no group</option>
                          {nestable.map((g) => (
                            <option key={g.id} value={g.id}>
                              Opens {g.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
                <input
                  className={FIELD}
                  value={o.detail}
                  disabled={!canEdit}
                  maxLength={64}
                  placeholder={stepper ? "0–4 pumps" : "250 ml"}
                  aria-label="Detail"
                  onChange={(e) => setOption(o.key, { detail: e.target.value })}
                />
                <input
                  className={FIELD}
                  value={o.price}
                  disabled={!canEdit}
                  inputMode="decimal"
                  placeholder="Free"
                  aria-label="Price in rupees"
                  onChange={(e) => setOption(o.key, { price: e.target.value.replace(/[^\d.]/g, "") })}
                />
                {stepper && (
                  <input
                    className={FIELD}
                    type="number"
                    min={1}
                    max={20}
                    value={o.maxQuantity}
                    disabled={!canEdit}
                    aria-label="Maximum units"
                    onChange={(e) =>
                      setOption(o.key, { maxQuantity: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })
                    }
                  />
                )}
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-text-secondary">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--color-primary)]"
                    checked={o.isAvailable}
                    disabled={!canEdit}
                    onChange={(e) => setOption(o.key, { isAvailable: e.target.checked })}
                  />
                  {o.isAvailable ? "Yes" : "Out"}
                </label>
                <span className="flex justify-center">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isDefault}
                    aria-label={`Make ${o.name || "this option"} the default`}
                    disabled={!canEdit}
                    onClick={() => onChange({ ...draft, defaultKey: isDefault && stepper ? null : o.key })}
                    className={cn(
                      "flex size-6 cursor-pointer items-center justify-center rounded-full border disabled:cursor-not-allowed",
                      isDefault ? "border-2 border-primary" : "border-border-strong",
                    )}
                  >
                    {isDefault && <span className="size-2.5 rounded-full bg-primary" />}
                  </button>
                </span>
                <span className="flex flex-col items-center gap-0.5">
                  {canEdit && (
                    <>
                      <span className="flex">
                        <button
                          type="button"
                          aria-label="Move up"
                          disabled={i === 0}
                          onClick={() => move(i, -1)}
                          className="cursor-pointer rounded p-0.5 text-text-secondary hover:text-text disabled:opacity-30"
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Move down"
                          disabled={i === draft.options.length - 1}
                          onClick={() => move(i, 1)}
                          className="cursor-pointer rounded p-0.5 text-text-secondary hover:text-text disabled:opacity-30"
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                      </span>
                      <button
                        type="button"
                        aria-label={`Delete ${o.name || "option"}`}
                        onClick={() => remove(o.key)}
                        className="cursor-pointer rounded p-0.5 text-text-secondary hover:text-error"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {canEdit && (
        <button
          type="button"
          onClick={add}
          className="flex w-full cursor-pointer items-center gap-2 px-5 py-3 text-[14px] leading-5 font-bold text-text-brand hover:bg-background-subtle"
        >
          <Plus className="size-4" />
          Add {noun.singular}
        </button>
      )}
    </section>
  );
}
