import type {
  ModifierDisplayStyle,
  ModifierGroup,
  ModifierGroupDetail,
  ModifierGroupPayload,
  ModifierGroupType,
  ModifierOptionPayload,
} from "@/types/catalog";

/** Renderers a type can use in the customer app. */
export const STYLES_BY_TYPE: Record<ModifierGroupType, ModifierDisplayStyle[]> = {
  CHOICE: ["CARDS", "TOGGLE", "RADIO", "CHECKBOX"],
  LEVEL: ["SEGMENTED", "RADIO"],
  COUNT: ["STEPPER"],
  TEXT: ["TEXT"],
};

export const STYLE_LABEL: Record<ModifierDisplayStyle, string> = {
  CARDS: "Cards (size)",
  TOGGLE: "Toggle (2 options)",
  SEGMENTED: "Segmented bar",
  RADIO: "Radio list",
  CHECKBOX: "Checkbox list",
  STEPPER: "Steppers",
  TEXT: "Note field",
};

export interface OptionDraft {
  /** Stable key for React and for the default; the id for saved options. */
  key: string;
  id: string | null;
  name: string;
  detail: string;
  /** Rupees as typed */
  price: string;
  maxQuantity: number;
  isAvailable: boolean;
  nestedGroupId: string | null;
  recipeMultiplier: number | null;
  code: string | null;
}

export interface GroupDraft {
  name: string;
  groupType: ModifierGroupType;
  displayStyle: ModifierDisplayStyle;
  isRequired: boolean;
  maxSelect: number;
  unitLabel: string;
  includedQuantity: number;
  maxLength: number;
  placeholder: string;
  hint: string;
  isActive: boolean;
  defaultKey: string | null;
  options: OptionDraft[];
}

let tmp = 0;
export const newOptionKey = () => `new-${Date.now()}-${tmp++}`;

export function draftFromGroup(g: ModifierGroupDetail): GroupDraft {
  return {
    name: g.name,
    groupType: g.groupType,
    displayStyle: g.displayStyle,
    isRequired: g.isRequired,
    maxSelect: g.maxSelect,
    unitLabel: g.unitLabel ?? "",
    includedQuantity: g.includedQuantity,
    maxLength: g.maxLength ?? 60,
    placeholder: g.placeholder ?? "",
    hint: g.hint ?? "",
    isActive: g.isActive,
    defaultKey: g.modifiers.find((m) => m.isDefault)?.id ?? null,
    options: g.modifiers.map((m) => ({
      key: m.id,
      id: m.id,
      name: m.name,
      detail: m.detail ?? "",
      price: m.pricePaise ? String(m.pricePaise / 100) : "",
      maxQuantity: m.maxQuantity ?? 1,
      isAvailable: m.isAvailable,
      nestedGroupId: m.nestedGroupId ?? null,
      recipeMultiplier: m.recipeMultiplier ?? null,
      code: m.code ?? null,
    })),
  };
}

export const isStepperStyle = (d: Pick<GroupDraft, "displayStyle">) => d.displayStyle === "STEPPER";
export const isMultiStyle = (d: Pick<GroupDraft, "displayStyle">) =>
  d.displayStyle === "STEPPER" || d.displayStyle === "CHECKBOX";

export function pricePaise(price: string): number {
  const n = Number(price.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

/** Draft problems that block saving; empty when the draft can be saved. */
export function validateDraft(d: GroupDraft): string[] {
  const errors: string[] = [];
  if (!d.name.trim()) errors.push("Give the group a name.");
  if (d.groupType !== "TEXT") {
    if (d.options.length === 0) errors.push("Add at least one option.");
    if (d.options.some((o) => !o.name.trim())) errors.push("Every option needs a name.");
    const names = d.options.map((o) => o.name.trim().toLowerCase());
    if (new Set(names).size !== names.length) errors.push("Option names must be different.");
    if (d.displayStyle === "TOGGLE" && d.options.length !== 2) errors.push("A toggle needs exactly 2 options.");
    if (isMultiStyle(d) && d.maxSelect < 1) errors.push("Allow at least 1 option.");
  }
  return errors;
}

/** The group the preview renders while editing (prices in paise, the draft default applied). */
export function previewGroup(id: string, d: GroupDraft): ModifierGroup {
  return {
    id,
    name: d.name || "Untitled group",
    groupType: d.groupType,
    displayStyle: d.displayStyle,
    minSelect: d.isRequired ? 1 : 0,
    maxSelect: isMultiStyle(d) ? d.maxSelect : 1,
    isRequired: d.isRequired,
    displayOrder: 0,
    unitLabel: d.unitLabel || null,
    includedQuantity: d.includedQuantity,
    maxLength: d.maxLength,
    placeholder: d.placeholder || null,
    hint: d.hint || null,
    modifiers: d.options.map((o, i) => ({
      id: o.key,
      name: o.name || "Option",
      detail: o.detail || null,
      pricePaise: pricePaise(o.price),
      isDefault: o.key === d.defaultKey,
      isAvailable: o.isAvailable,
      displayOrder: i + 1,
      maxQuantity: o.maxQuantity,
    })),
  };
}

export interface SavePlan {
  group: ModifierGroupPayload;
  deletes: string[];
  updates: { id: string; payload: ModifierOptionPayload }[];
  creates: { key: string; payload: ModifierOptionPayload & { name: string } }[];
  /** Final option order by key; new keys are swapped for ids after create. */
  orderKeys: string[];
  orderChanged: boolean;
}

/** Minimal set of API calls that turns `original` into `draft`. */
export function planSave(original: ModifierGroupDetail, d: GroupDraft): SavePlan {
  const multi = isMultiStyle(d);
  const group: ModifierGroupPayload = {};
  const put = <K extends keyof ModifierGroupPayload>(key: K, next: ModifierGroupPayload[K], prev: unknown) => {
    if (next !== prev) group[key] = next;
  };
  put("name", d.name.trim(), original.name);
  put("displayStyle", d.displayStyle, original.displayStyle);
  put("isRequired", d.isRequired, original.isRequired);
  put("minSelect", d.isRequired ? 1 : 0, original.minSelect);
  put("maxSelect", multi ? Math.max(1, d.maxSelect) : 1, original.maxSelect);
  put("isActive", d.isActive, original.isActive);
  if (isStepperStyle(d)) {
    put("unitLabel", d.unitLabel.trim() || null, original.unitLabel);
    put("includedQuantity", d.includedQuantity, original.includedQuantity);
  }
  if (d.groupType === "TEXT") {
    put("maxLength", d.maxLength, original.maxLength);
    put("placeholder", d.placeholder.trim() || null, original.placeholder);
    put("hint", d.hint.trim() || null, original.hint);
  }

  const byId = new Map(original.modifiers.map((m) => [m.id, m]));
  const kept = new Set(d.options.filter((o) => o.id).map((o) => o.id as string));
  const deletes = original.modifiers.filter((m) => !kept.has(m.id)).map((m) => m.id);

  const updates: SavePlan["updates"] = [];
  const creates: SavePlan["creates"] = [];
  d.options.forEach((o) => {
    const payload: ModifierOptionPayload = {
      name: o.name.trim(),
      detail: o.detail.trim() || null,
      pricePaise: pricePaise(o.price),
      isAvailable: o.isAvailable,
      isDefault: o.key === d.defaultKey,
      maxQuantity: isStepperStyle(d) ? Math.max(1, o.maxQuantity) : 1,
      nestedGroupId: o.nestedGroupId,
    };
    if (!o.id) {
      creates.push({ key: o.key, payload: { ...payload, name: payload.name as string } });
      return;
    }
    const prev = byId.get(o.id);
    if (!prev) return;
    const diff: ModifierOptionPayload = {};
    if (payload.name !== prev.name) diff.name = payload.name;
    if (payload.detail !== (prev.detail ?? null)) diff.detail = payload.detail;
    if (payload.pricePaise !== prev.pricePaise) diff.pricePaise = payload.pricePaise;
    if (payload.isAvailable !== prev.isAvailable) diff.isAvailable = payload.isAvailable;
    if (payload.isDefault !== prev.isDefault) diff.isDefault = payload.isDefault;
    if (payload.maxQuantity !== (prev.maxQuantity ?? 1)) diff.maxQuantity = payload.maxQuantity;
    if (payload.nestedGroupId !== (prev.nestedGroupId ?? null)) diff.nestedGroupId = payload.nestedGroupId;
    if (Object.keys(diff).length > 0) updates.push({ id: o.id, payload: diff });
  });

  const orderKeys = d.options.map((o) => o.key);
  const originalOrder = original.modifiers.filter((m) => kept.has(m.id)).map((m) => m.id);
  const draftSavedOrder = d.options.filter((o) => o.id).map((o) => o.id as string);
  const orderChanged =
    creates.length > 0 || originalOrder.join(",") !== draftSavedOrder.join(",");

  return { group, deletes, updates, creates, orderKeys, orderChanged };
}

export const planIsEmpty = (p: SavePlan) =>
  Object.keys(p.group).length === 0 &&
  p.deletes.length === 0 &&
  p.updates.length === 0 &&
  p.creates.length === 0 &&
  !p.orderChanged;
