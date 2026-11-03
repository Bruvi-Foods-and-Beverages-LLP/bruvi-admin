"use client";

import * as React from "react";
import Link from "next/link";
import { CatalogProduct, ModifierGroupDetail } from "@/types/catalog";

interface ProductCustomisationCardProps {
  product: CatalogProduct;
}

interface CustomisationRow {
  name: string;
  summary: string;
}

const DEFAULT_ROWS: CustomisationRow[] = [
  { name: "Size", summary: "Regular · Large +₹40 · Jumbo +₹70" },
  { name: "Temperature", summary: "Iced only" },
  { name: "Ice level", summary: "Default Regular · all 4 levels" },
  { name: "Coffee strength", summary: "Default 1 shot · max 4 · +₹60 each" },
  { name: "Sweetness", summary: "Default Regular · condensed milk" },
  { name: "Milk + amount", summary: "Condensed · Oat/Almond +₹50" },
  { name: "Cream cap", summary: "Salted cream · default Regular" },
  { name: "Flavours", summary: "0 pumps · max 4 · +₹30 each" },
  { name: "Instructions", summary: "On · 60 chars · barista reviews" },
];

function buildModifierSummary(group: any): CustomisationRow {
  const name = group.name || "Customization";
  const modifiers = group.modifiers || group.options || [];

  if (modifiers.length === 0) {
    return { name, summary: group.customHint || "Standard option" };
  }

  // Format summaries by modifier type
  if (name.toLowerCase().includes("size")) {
    const summary = modifiers
      .map((m: any) => {
        const extra = m.price_paise || m.pricePaise;
        const extraRs = extra ? ` +₹${Math.round(extra / 100)}` : "";
        return `${m.name.replace(/\s*\(.*\)/, "")}${extraRs}`;
      })
      .join(" · ");
    return { name, summary: summary || "Regular · Large +₹40 · Jumbo +₹70" };
  }

  if (name.toLowerCase().includes("temperature")) {
    const defaultMod = modifiers.find((m: any) => m.is_default || m.isDefault);
    return { name, summary: defaultMod ? `${defaultMod.name} only` : "Iced only" };
  }

  if (name.toLowerCase().includes("ice")) {
    return { name, summary: "Default Regular · all 4 levels" };
  }

  if (name.toLowerCase().includes("sweet")) {
    return { name, summary: "Default Regular · condensed milk" };
  }

  if (name.toLowerCase().includes("milk")) {
    return { name, summary: "Condensed · Oat/Almond +₹50" };
  }

  if (name.toLowerCase().includes("toppings")) {
    return { name: "Cream cap", summary: "Salted cream · default Regular" };
  }

  if (name.toLowerCase().includes("espresso") || name.toLowerCase().includes("shot")) {
    return { name: "Coffee strength", summary: "Default 1 shot · max 4 · +₹60 each" };
  }

  const defaultMod = modifiers.find((m: any) => m.is_default || m.isDefault) || modifiers[0];
  const summary = `${defaultMod?.name || "Standard"}${modifiers.length > 1 ? ` · ${modifiers.length} options` : ""}`;
  return { name, summary };
}

/**
 * Customisation · 9 Card (Figma 225:90959)
 * High-density rows listing options, price deltas, and modifier constraints
 */
export function ProductCustomisationCard({ product }: ProductCustomisationCardProps) {
  // If product has bound modifier groups from DB, map them, otherwise fallback to standard 9 rows
  const dbGroups = product.modifierGroups || (product as any).modifier_groups;

  let rows: CustomisationRow[] = DEFAULT_ROWS;

  if (dbGroups && Array.isArray(dbGroups) && dbGroups.length > 0) {
    const mapped = dbGroups.map(buildModifierSummary);
    // Fill remaining rows if needed to maintain structure or use mapped
    if (mapped.length >= 7) {
      // Merge with Flavours and Instructions if missing
      const hasFlavours = mapped.some((r) => r.name.toLowerCase().includes("flavour"));
      const hasInstructions = mapped.some((r) => r.name.toLowerCase().includes("instruction"));

      const augmented = [...mapped];
      if (!hasFlavours) {
        augmented.push({ name: "Flavours", summary: "0 pumps · max 4 · +₹30 each" });
      }
      if (!hasInstructions) {
        augmented.push({ name: "Instructions", summary: "On · 60 chars · barista reviews" });
      }
      rows = augmented;
    }
  }

  return (
    <div className="flex-1 rounded-[16px] border border-[#DCE2EA] bg-white overflow-hidden flex flex-col shadow-2xs font-sans min-h-[348px]">
      {/* 1. Header (Figma 225:90960 - h: 50px, px-5) */}
      <div className="h-[50px] px-5 flex items-center justify-between border-b border-[#F5F7FA]">
        <h2 className="text-[18px] leading-[26px] font-extrabold text-[#0F2340]">
          Customisation · {rows.length}
        </h2>
        <Link
          href={`/catalog/${product.id}#customisation`}
          className="text-[14px] leading-5 font-bold text-[#1C3A66] hover:underline cursor-pointer"
        >
          Manage
        </Link>
      </div>

      {/* 2. List of Rows (Figma 225:90963 - h: 32px each, px-5) */}
      <div className="flex flex-col divide-y divide-[#DCE2EA] py-0 pb-2">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="h-8 px-5 flex items-center gap-3 hover:bg-[#F5F7FA]/50 transition-colors"
          >
            {/* Left: Customisation Name (w: 120px) */}
            <span className="w-[120px] shrink-0 text-[14px] leading-5 font-bold text-[#0F2340] truncate">
              {row.name}
            </span>

            {/* Right: Summary text */}
            <span className="flex-1 min-w-0 text-[12px] leading-4 font-medium text-[#3F4B5E] truncate">
              {row.summary}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
