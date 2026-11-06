"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { OPTION_NOUN } from "@/lib/catalog/modifier-groups";
import {
  STYLES_BY_TYPE,
  STYLE_LABEL,
  isMultiStyle,
  isStepperStyle,
  type GroupDraft,
} from "@/lib/catalog/modifier-editor";
import type { ModifierDisplayStyle } from "@/types/catalog";
import { FIELD } from "./modifier-options-card";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-2">
      <span className="text-[14px] leading-5 font-bold text-text">{label}</span>
      {children}
      {hint && <span className="text-[12px] leading-4 font-medium text-text-secondary">{hint}</span>}
    </label>
  );
}

function Select({
  value,
  onChange,
  disabled,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="relative block">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full cursor-pointer appearance-none truncate rounded-[12px] border border-border-strong bg-surface pr-10 pl-[17px] text-[16px] leading-6 text-text outline-none focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus-halo disabled:cursor-not-allowed disabled:opacity-60"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-[17px] size-5 -translate-y-1/2 text-text-secondary"
        aria-hidden
      />
    </span>
  );
}

const BIG_FIELD = FIELD.replace("h-9", "h-12").replace("rounded-[10px]", "rounded-[12px]").replace("border-border-input", "border-border-strong");

interface Props {
  draft: GroupDraft;
  canEdit: boolean;
  onChange: (next: GroupDraft) => void;
}

/** Selection rules + how the app draws the group (Figma 225:92356 → Selection rules). */
export function ModifierSelectionRulesCard({ draft, canEdit, onChange }: Props) {
  const noun = OPTION_NOUN[draft.groupType];
  const set = (patch: Partial<GroupDraft>) => onChange({ ...draft, ...patch });
  const multi = isMultiStyle(draft);
  const stepper = isStepperStyle(draft);
  const isText = draft.groupType === "TEXT";

  return (
    <section className="flex flex-col gap-4 rounded-[16px] border border-border bg-surface p-[21px]">
      <h2 className="text-[18px] leading-[26px] font-extrabold text-text">Selection rules</h2>

      <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-3">
        <Field label="Group name">
          <input
            className={BIG_FIELD}
            value={draft.name}
            maxLength={64}
            disabled={!canEdit}
            onChange={(e) => set({ name: e.target.value })}
          />
        </Field>

        <Field label="Shown in the app as">
          <Select
            value={draft.displayStyle}
            disabled={!canEdit || STYLES_BY_TYPE[draft.groupType].length === 1}
            onChange={(v) => set({ displayStyle: v as ModifierDisplayStyle })}
          >
            {STYLES_BY_TYPE[draft.groupType].map((s) => (
              <option key={s} value={s}>
                {STYLE_LABEL[s]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Customer must choose">
          <Select
            value={draft.isRequired ? "REQUIRED" : "OPTIONAL"}
            disabled={!canEdit}
            onChange={(v) => set({ isRequired: v === "REQUIRED" })}
          >
            <option value="REQUIRED">
              {isText ? "Required" : multi ? `At least 1 ${noun.singular}` : `Exactly 1 ${noun.singular}`}
            </option>
            <option value="OPTIONAL">Optional</option>
          </Select>
        </Field>

        {multi && (
          <Field label={`Up to how many ${noun.plural}`}>
            <input
              className={BIG_FIELD}
              type="number"
              min={1}
              max={20}
              value={draft.maxSelect}
              disabled={!canEdit}
              onChange={(e) => set({ maxSelect: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })}
            />
          </Field>
        )}

        {stepper && (
          <>
            <Field label="Unit" hint="Shown as “2 shots”, “0–4 pumps”">
              <input
                className={BIG_FIELD}
                value={draft.unitLabel}
                maxLength={24}
                placeholder="shot"
                disabled={!canEdit}
                onChange={(e) => set({ unitLabel: e.target.value })}
              />
            </Field>
            <Field label="Free units" hint="Included in the drink price, e.g. the first shot">
              <input
                className={BIG_FIELD}
                type="number"
                min={0}
                max={20}
                value={draft.includedQuantity}
                disabled={!canEdit}
                onChange={(e) => set({ includedQuantity: Math.min(20, Math.max(0, Number(e.target.value) || 0)) })}
              />
            </Field>
          </>
        )}

        {isText && (
          <>
            <Field label="Character limit">
              <input
                className={BIG_FIELD}
                type="number"
                min={1}
                max={280}
                value={draft.maxLength}
                disabled={!canEdit}
                onChange={(e) => set({ maxLength: Math.min(280, Math.max(1, Number(e.target.value) || 60)) })}
              />
            </Field>
            <Field label="Placeholder">
              <input
                className={BIG_FIELD}
                value={draft.placeholder}
                maxLength={120}
                placeholder="e.g. Cream on the side, please"
                disabled={!canEdit}
                onChange={(e) => set({ placeholder: e.target.value })}
              />
            </Field>
            <Field label="Helper line">
              <input
                className={BIG_FIELD}
                value={draft.hint}
                maxLength={160}
                placeholder="Reviewed by your barista"
                disabled={!canEdit}
                onChange={(e) => set({ hint: e.target.value })}
              />
            </Field>
          </>
        )}

        <Field label="Status" hint="Inactive groups are hidden from every product">
          <Select
            value={draft.isActive ? "ACTIVE" : "INACTIVE"}
            disabled={!canEdit}
            onChange={(v) => set({ isActive: v === "ACTIVE" })}
          >
            <option value="ACTIVE">Live</option>
            <option value="INACTIVE">Hidden</option>
          </Select>
        </Field>
      </div>
    </section>
  );
}
