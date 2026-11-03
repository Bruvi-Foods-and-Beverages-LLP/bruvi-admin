"use client";

import Image from "next/image";
import { FlaskConical, Plus } from "lucide-react";
import type { CategoryItem } from "@/types/catalog";
import { parsePriceToPaise, type ProductFormState } from "@/lib/catalog/product-form";

interface PreviewCardProps {
  form: ProductFormState;
  category?: CategoryItem;
  menuLabel: string;
}

/** Live customer-app card (Figma 225:91418). */
export function PreviewCard({ form, category, menuLabel }: PreviewCardProps) {
  const fg = category?.colorHex || "var(--color-category-lab)";
  const bg = category?.bgColorHex || "var(--color-category-lab-surface)";
  const rupees = parsePriceToPaise(form.basePriceRupees) / 100;
  const catName = category?.name?.toUpperCase();
  const badge = catName ? (catName === "LAB" ? "BRUVI LAB" : catName) : "BRUVI";
  const surface = form.channelKiosk ? "Kiosk" : form.channelApp ? "App" : form.channelCounter ? "Counter" : form.channelQr ? "QR" : "—";

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-[16px] border border-border bg-surface-warm p-6 shadow-2xs">
      <div className="flex w-full items-center justify-between">
        <span className="font-serif text-[11px] leading-[14px] uppercase tracking-[0.12em] text-text-secondary">
          Live preview · Customer app
        </span>
        <span className="text-caption-bold text-text-brand">{surface}</span>
      </div>

      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-[24px] bg-surface shadow-floating">
        <div className="relative flex h-40 flex-col items-center justify-center gap-2" style={{ backgroundColor: bg }}>
          {form.imageUrl ? (
            <Image src={form.imageUrl} alt="" fill sizes="320px" className="object-cover" />
          ) : (
            <>
              <FlaskConical className="h-8 w-8" style={{ color: fg }} strokeWidth={1.5} />
              <span className="text-caption" style={{ color: fg }}>Photo pending</span>
            </>
          )}
          <span
            className="absolute left-3 top-3 flex h-6 items-center rounded-full px-2 text-[10px] leading-4 font-bold tracking-wide text-white"
            style={{ backgroundColor: fg }}
          >
            {badge}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2">
            <span
              aria-label={form.isVegetarian ? "Vegetarian" : "Non-vegetarian"}
              className={
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] " +
                (form.isVegetarian ? "border-diet-veg" : "border-error")
              }
            >
              <span className={"h-2 w-2 rounded-full " + (form.isVegetarian ? "bg-diet-veg" : "bg-error")} />
            </span>
            <span className="truncate text-title font-extrabold text-text">{form.name.trim() || "Product name"}</span>
          </div>
          <p className="min-h-5 text-body-s text-text-secondary">{form.shortDescription || "Short description appears here"}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="font-display text-[20px] leading-7 font-extrabold text-text tnum" style={{ fontVariationSettings: '"wdth" 112, "wght" 800' }}>
              ₹{Number.isInteger(rupees) ? rupees : rupees.toFixed(2)}
            </span>
            <span className="flex h-9 items-center gap-1 rounded-full bg-primary px-4 text-label text-white">
              <Plus className="h-4 w-4" /> Add
            </span>
          </div>
        </div>
      </div>

      <p className="text-center text-caption text-text-secondary">Updates as you type · {menuLabel}</p>
    </div>
  );
}
