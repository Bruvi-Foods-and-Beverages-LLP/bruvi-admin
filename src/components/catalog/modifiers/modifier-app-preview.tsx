"use client";

import * as React from "react";
import { Check, CircleAlert, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatRupees } from "@/lib/catalog/modifier-groups";
import type { ModifierDisplayStyle, ModifierGroup, ModifierOption } from "@/types/catalog";

/**
 * Mobile-app rendering of one modifier group (Figma 225:61688), drawn from the group's
 * `displayStyle` exactly like the app: CARDS · TOGGLE · SEGMENTED · RADIO · CHECKBOX · STEPPER · TEXT.
 * Groups saved before display styles existed fall back to their type.
 */

const PRICE = "text-[14px] leading-5 font-semibold text-text-secondary";

function tagLabel(group: ModifierGroup): string {
  if (group.groupType === "TEXT" || group.displayStyle === "STEPPER" || group.groupType === "COUNT")
    return group.isRequired ? "Required" : "Optional";
  if (!group.isRequired) return group.maxSelect > 1 ? `Optional · up to ${group.maxSelect}` : "Optional";
  return group.maxSelect > 1 ? `Choose up to ${group.maxSelect}` : "Choose 1";
}

const FALLBACK_STYLE: Record<ModifierGroup["groupType"], ModifierDisplayStyle> = {
  CHOICE: "RADIO",
  LEVEL: "SEGMENTED",
  COUNT: "STEPPER",
  TEXT: "TEXT",
};

/** Option title + second line: the saved detail, else a "(250 ml)" / "70%" part of the name. */
function optionLines(m: ModifierOption): { title: string; detail: string | null } {
  if (m.detail) return { title: m.name, detail: m.detail };
  return splitName(m.name);
}

/** "Regular (250ml)" → Regular + 250ml · "70% Less" → Less + 70% */
function splitName(name: string): { title: string; detail: string | null } {
  const bracket = name.match(/^(.*?)\s*\((.+)\)\s*$/);
  if (bracket) return { title: bracket[1], detail: bracket[2] };
  const lead = name.match(/^(\d+(?:\.\d+)?\s*%)\s+(.+)$/);
  if (lead) return { title: lead[2], detail: lead[1].replace(/\s+/g, "") };
  return { title: name, detail: null };
}

function SectionHeader({
  group,
  trailing,
  invalid,
}: {
  group: ModifierGroup;
  trailing?: string;
  invalid?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <h4 className="min-w-0 truncate text-[16px] leading-6 font-extrabold text-text">{group.name}</h4>
      <span
        className={cn(
          "inline-flex h-5 shrink-0 items-center rounded-[4px] px-2 text-[12px] leading-4 font-medium",
          invalid ? "bg-error-surface text-error" : "bg-background-subtle text-text-secondary",
        )}
      >
        {invalid ? `Pick a ${group.name.toLowerCase()}` : tagLabel(group)}
      </span>
      {trailing && <span className={cn(PRICE, "ml-auto shrink-0")}>{trailing}</span>}
    </div>
  );
}

function priceText(m: ModifierOption): string | null {
  return m.pricePaise > 0 ? `+${formatRupees(m.pricePaise)}` : null;
}

/* ---------- CHOICE ---------- */

function SizeCards({ options, selected, onPick, invalid }: Presentation & { invalid?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((m) => {
        const { title, detail } = optionLines(m);
        const on = selected.has(m.id);
        const sub = !m.isAvailable
          ? "Sold out today"
          : [detail, priceText(m)].filter(Boolean).join(" · ");
        return (
          <button
            key={m.id}
            type="button"
            disabled={!m.isAvailable}
            onClick={() => onPick(m.id)}
            className={cn(
              "flex min-h-16 min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[12px] border-[1.5px] px-1 text-center",
              !m.isAvailable
                ? "cursor-not-allowed border-border bg-background-subtle text-text-muted"
                : on
                  ? "border-primary bg-surface-brand text-text"
                  : invalid
                    ? "border-error bg-surface text-text"
                    : "border-border-strong bg-surface text-text hover:bg-background-subtle",
            )}
          >
            <span className="max-w-full truncate text-[16px] leading-6 font-bold">{title}</span>
            {sub && <span className="max-w-full truncate text-[12px] leading-4 font-medium">{sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

function PillToggle({ options, selected, onPick }: Presentation) {
  return (
    <div className="flex min-h-11 rounded-full bg-background-subtle p-1">
      {options.map((m) => {
        const on = selected.has(m.id);
        return (
          <button
            key={m.id}
            type="button"
            disabled={!m.isAvailable}
            onClick={() => onPick(m.id)}
            className={cn(
              "flex min-h-9 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full px-2 text-center break-words text-[14px] leading-5 font-semibold",
              on ? "bg-surface text-text shadow-raised" : "text-text-muted",
              !m.isAvailable && "cursor-not-allowed line-through opacity-50",
            )}
          >
            {m.name}
          </button>
        );
      })}
    </div>
  );
}

function OptionList({ options, selected, onPick, multi }: Presentation & { multi: boolean }) {
  return (
    <ul>
      {options.map((m) => {
        const on = selected.has(m.id);
        return (
          <li key={m.id} className="border-b border-border last:border-b-0">
            <button
              type="button"
              disabled={!m.isAvailable}
              onClick={() => onPick(m.id)}
              className={cn(
                "flex h-[52px] w-full cursor-pointer items-center gap-3 text-left",
                !m.isAvailable && "cursor-not-allowed opacity-50",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center border-2",
                  multi ? "rounded-[6px]" : "rounded-full",
                  on ? "border-primary" : "border-border-strong",
                  multi && on && "bg-primary",
                )}
              >
                {on &&
                  (multi ? (
                    <Check className="size-4 text-text-inverse" strokeWidth={3} />
                  ) : (
                    <span className="size-3 rounded-full bg-primary" />
                  ))}
              </span>
              <span className={cn("min-w-0 truncate text-[16px] leading-6 text-text", !m.isAvailable && "line-through")}>
                {m.name}
              </span>
              {m.isDefault && (
                <span className="text-[12px] leading-4 font-medium text-text-secondary">Default</span>
              )}
              <span className={cn(PRICE, "ml-auto shrink-0 font-normal")}>{priceText(m)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- LEVEL ---------- */

function Segmented({ options, selected, onPick }: Presentation) {
  return (
    <div className="flex overflow-hidden rounded-[12px] border-[1.5px] border-border-strong">
      {options.map((m, i) => {
        const on = selected.has(m.id);
        const { title, detail } = optionLines(m);
        return (
          <button
            key={m.id}
            type="button"
            disabled={!m.isAvailable}
            onClick={() => onPick(m.id)}
            className={cn(
              "flex min-h-[41px] min-w-0 flex-1 basis-0 cursor-pointer flex-col items-center justify-center px-1 py-1 text-center [overflow-wrap:anywhere]",
              i > 0 && !on && "border-l border-border",
              on ? "bg-primary text-text-inverse" : "bg-surface text-text",
              !m.isAvailable && "cursor-not-allowed line-through opacity-50",
            )}
          >
            <span className={cn("text-[14px] leading-5", on ? "font-bold" : "font-semibold")}>{title}</span>
            {detail && (
              <span className={cn("text-[11px] leading-[14px] font-medium", on ? "text-text-inverse/80" : "text-text-secondary")}>
                {detail}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- COUNT ---------- */

function CountRows({
  group,
  counts,
  onChange,
}: {
  group: ModifierGroup;
  counts: Record<string, number>;
  onChange: (id: string, next: number) => void;
}) {
  return (
    <ul>
      {group.modifiers.map((m) => {
        const n = counts[m.id] ?? 0;
        const out = !m.isAvailable;
        const max = Math.max(1, m.maxQuantity ?? 1);
        const unit = group.unitLabel ? ` ${group.unitLabel}s` : "";
        return (
          <li key={m.id} className="flex min-h-[52px] items-center gap-3 border-b border-border py-1 last:border-b-0">
            <span className="flex min-w-0 flex-1 flex-col">
              <span className={cn("truncate text-[16px] leading-6", out ? "text-text-muted" : "text-text")}>{m.name}</span>
              <span className="truncate text-[12px] leading-4 font-medium text-text-secondary">
                {out ? "Out today" : (m.detail ?? `0–${max}${unit}`)}
              </span>
            </span>
            <span className={cn(PRICE, "shrink-0 font-normal", out && "text-text-muted")}>{priceText(m)}</span>
            <span
              className={cn(
                "flex h-9 w-[107px] shrink-0 items-center justify-between rounded-full px-2",
                out ? "bg-border" : "border-[1.5px] border-border-strong",
              )}
            >
              <button
                type="button"
                aria-label={`Remove one ${m.name}`}
                disabled={out || n <= 0}
                onClick={() => onChange(m.id, n - 1)}
                className="flex size-6 cursor-pointer items-center justify-center text-text disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <span className={cn("text-[14px] leading-5 font-bold", out ? "text-text-muted" : "text-text")}>{n}</span>
              <button
                type="button"
                aria-label={`Add one ${m.name}`}
                disabled={out || n >= max}
                onClick={() => onChange(m.id, n + 1)}
                className="flex size-6 cursor-pointer items-center justify-center text-text disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- main ---------- */

interface Presentation {
  options: ModifierOption[];
  selected: Set<string>;
  onPick: (id: string) => void;
}

export function ModifierAppPreview({ group }: { group: ModifierGroup }) {
  const defaults = React.useMemo(
    () => group.modifiers.filter((m) => m.isDefault && m.isAvailable).map((m) => m.id),
    [group.modifiers],
  );
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set(defaults));
  const [counts, setCounts] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(defaults.map((id) => [id, Math.max(1, group.includedQuantity ?? 1)])),
  );

  const style = group.displayStyle ?? FALLBACK_STYLE[group.groupType];
  const multi = style === "CHECKBOX" || group.maxSelect > 1;
  const pick = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!multi) return new Set([id]);
      if (next.has(id)) next.delete(id);
      else if (next.size < group.maxSelect) next.add(id);
      return next;
    });

  const def = group.modifiers.find((m) => m.isDefault);
  // Single choice shows the difference to the default, like the app and the cart charge it
  const options =
    multi || style === "STEPPER"
      ? group.modifiers
      : group.modifiers.map((m) => ({ ...m, pricePaise: Math.max(0, m.pricePaise - (def?.pricePaise ?? 0)) }));
  const invalid =
    group.isRequired && !multi && style !== "STEPPER" && style !== "TEXT" && selected.size === 0 && options.length > 0;
  const available = options.filter((m) => m.isAvailable);
  const p: Presentation = { options, selected, onPick: pick };

  let body: React.ReactNode;
  let trailing: string | undefined;

  if (style === "TEXT") {
    body = (
      <div className="flex flex-col gap-2">
        <div className="min-h-24 rounded-[12px] border-[1.5px] border-border-strong px-[17.5px] py-[13.5px] text-[16px] leading-6 text-text-muted">
          {group.placeholder?.trim() || group.customHint?.trim() || "e.g. Cream on the side, please"}
        </div>
        <div className="flex justify-between gap-3 text-[12px] leading-4 font-medium text-text-muted">
          <span>{group.hint ?? ""}</span>
          <span>0/{group.maxLength ?? 60}</span>
        </div>
      </div>
    );
  } else if (options.length === 0) {
    body = <p className="text-[14px] leading-5 text-text-muted">No options yet</p>;
  } else if (style === "SEGMENTED") {
    body = <Segmented {...p} />;
  } else if (style === "STEPPER") {
    if (options.length === 1) trailing = priceText(options[0]) ?? undefined;
    body = (
      <CountRows
        group={group}
        counts={counts}
        onChange={(id, next) => setCounts((c) => ({ ...c, [id]: next }))}
      />
    );
  } else if (style === "CARDS") {
    body = <SizeCards {...p} invalid={invalid} />;
  } else if (style === "TOGGLE") {
    body = <PillToggle {...p} />;
  } else {
    const chosen = options.find((m) => selected.has(m.id));
    if (!multi && chosen) trailing = priceText(chosen) ?? undefined;
    body = <OptionList {...p} multi={multi} />;
  }

  const outOptions = options.filter((m) => !m.isAvailable);
  const alternatives = options.filter((m) => m.isAvailable).slice(0, 2);

  return (
    <div className="flex flex-col gap-3">
      <SectionHeader group={group} trailing={trailing} invalid={invalid} />
      {body}
      {invalid && available.length > 0 && (
        <p className="flex items-center gap-2 text-[14px] leading-5 font-semibold text-error">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          Choose {available.slice(0, 2).map((m) => optionLines(m).title).join(" or ")} to add this drink.
        </p>
      )}
      {(style === "STEPPER" || style === "CHECKBOX" || style === "RADIO") && outOptions.length > 0 && (
        <div className="flex items-start gap-2 rounded-[16px] bg-error-surface px-4 py-3 text-[14px] leading-5 font-semibold text-error">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            {outOptions[0].name} just ran out, so we&rsquo;ve removed your 1 {group.unitLabel ?? outOptions[0].name}
            {outOptions[0].pricePaise > 0 ? ` (−${formatRupees(outOptions[0].pricePaise)})` : ""}.
            {alternatives.length > 0 ? ` Try ${alternatives.map((m) => m.name.toLowerCase()).join(" or ")}.` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
