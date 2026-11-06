import type { ModifierGroup, ModifierGroupType } from "@/types/catalog";

export const MODIFIER_TYPE_LABEL: Record<ModifierGroupType, string> = {
  CHOICE: "Choice",
  LEVEL: "Level",
  COUNT: "Count",
  TEXT: "Text",
};

export function formatRupees(paise: number): string {
  const rupees = paise / 100;
  return `₹${Number.isInteger(rupees) ? rupees : rupees.toFixed(2)}`;
}

/** "Regular · Large +₹40 · Jumbo +₹70" */
export function summariseOptions(group: ModifierGroup): string {
  if (group.groupType === "TEXT") {
    return group.placeholder?.trim() || group.customHint?.trim() || "Free text note";
  }
  if (group.modifiers.length === 0) return "No options yet";
  return group.modifiers
    .map((m) => (m.pricePaise > 0 ? `${m.name} +${formatRupees(m.pricePaise)}` : m.name))
    .join(" · ");
}

/** Group-level default shown in the Default column */
export function defaultLabel(group: ModifierGroup): string {
  if (group.groupType === "TEXT") return "Empty";
  return group.modifiers.find((m) => m.isDefault)?.name ?? "Per product";
}

/** Unavailable options drive the status pill; otherwise the group is live */
export function groupStatus(group: ModifierGroup): { live: boolean; label: string } {
  const out = group.modifiers.filter((m) => !m.isAvailable);
  if (out.length === 0) return { live: true, label: "Live" };
  const label =
    out.length === 1 ? `${out[0].name} out` : `${out.length} options out`;
  return { live: false, label };
}

export function matchesSearch(group: ModifierGroup, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    group.name.toLowerCase().includes(q) ||
    group.modifiers.some((m) => m.name.toLowerCase().includes(q))
  );
}

/* ---------- Detail page helpers ---------- */

export const OPTION_NOUN: Record<ModifierGroupType, { singular: string; plural: string; title: string }> = {
  CHOICE: { singular: "option", plural: "options", title: "Options" },
  LEVEL: { singular: "level", plural: "levels", title: "Levels" },
  COUNT: { singular: "step", plural: "steps", title: "Steps" },
  TEXT: { singular: "note", plural: "notes", title: "Note field" },
};

export const TYPE_EXPLAINER: Record<ModifierGroupType, string> = {
  CHOICE: "A Choice group swaps one ingredient for another. The customer picks from the options; the chosen option's recipe is used.",
  LEVEL: "A Level group scales the recipe quantity of the linked ingredient. Customers pick one level; stock deducts the chosen level, never the default.",
  COUNT: "A Count group is a stepper, not fixed steps: each step adds one portion and can carry a price.",
  TEXT: "A Text group is a free-text note for the barista. It never touches stock.",
};

export const STOCK_NOTE: Record<ModifierGroupType, string> = {
  CHOICE: "Choice swaps an ingredient. Stock deducts the chosen option's recipe, never the default.",
  LEVEL: "Level scales the recipe quantity. Stock deducts the chosen level, never the default.",
  COUNT: "Count adds one portion per step. Stock deducts every step the customer adds.",
  TEXT: "Text notes are passed to the barista and never touch stock.",
};

export type SelectionRule = "EXACTLY_ONE" | "OPTIONAL_ONE" | "CUSTOM";

export function ruleOf(g: Pick<ModifierGroup, "minSelect" | "maxSelect" | "isRequired">): SelectionRule {
  if (g.maxSelect === 1 && g.minSelect === 1 && g.isRequired) return "EXACTLY_ONE";
  if (g.maxSelect === 1 && g.minSelect === 0 && !g.isRequired) return "OPTIONAL_ONE";
  return "CUSTOM";
}

export function priceLabel(paise: number): string {
  return paise > 0 ? `+${formatRupees(paise)}` : "Free";
}

/** "4 levels · free · used by 18 products" */
export function detailSummary(group: ModifierGroup): string {
  const n = group.modifiers.length;
  const noun = OPTION_NOUN[group.groupType];
  const max = Math.max(0, ...group.modifiers.map((m) => m.pricePaise));
  const parts = [
    group.groupType === "TEXT" ? "free text" : `${n} ${n === 1 ? noun.singular : noun.plural}`,
    max > 0 ? `up to ${formatRupees(max)}` : "free",
  ];
  const used = group.productCount ?? 0;
  parts.push(`used by ${used} ${used === 1 ? "product" : "products"}`);
  return parts.join(" · ");
}

/** Level groups with 4 steps scale the recipe quantity ×0 / ×0.6 / ×1 / ×1.4 (see the stock note) */
export function levelMultipliers(group: ModifierGroup): number[] | null {
  return group.groupType === "LEVEL" && group.modifiers.length === 4 ? [0, 0.6, 1, 1.4] : null;
}
