import { CircleDot, ChartNoAxesColumnIncreasing, Diff, Type } from "lucide-react";
import type { ModifierGroupType } from "@/types/catalog";

const ICONS = {
  CHOICE: CircleDot,
  LEVEL: ChartNoAxesColumnIncreasing,
  COUNT: Diff,
  TEXT: Type,
} satisfies Record<ModifierGroupType, typeof CircleDot>;

export function ModifierTypeIcon({ type }: { type: ModifierGroupType }) {
  const Icon = ICONS[type];
  return <Icon className="size-4 text-text-secondary" strokeWidth={1.5} aria-hidden />;
}
