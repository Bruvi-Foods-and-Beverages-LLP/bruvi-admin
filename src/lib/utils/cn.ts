import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The theme's type styles (`.text-label`, `.text-price-l`, …) live in globals.css. tailwind-merge
 * would otherwise read them as colours and drop them when a colour like `text-text` follows.
 */
const TYPE_STYLES = [
  "body",
  "body-s",
  "caption",
  "caption-bold",
  "display-l",
  "display-m",
  "display-s",
  "heading-l",
  "heading-m",
  "heading-s",
  "kiosk-hero",
  "label",
  "label-button",
  "label-semi",
  "order-number",
  "overline",
  "overline-l",
  "price-button",
  "price-l",
  "price-m",
  "price-s",
  "price-xl",
  "price-xs",
  "tagline",
  "title",
];

const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: TYPE_STYLES }] } },
});

/**
 * Standard utility function for merging Tailwind CSS classes
 * with conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
