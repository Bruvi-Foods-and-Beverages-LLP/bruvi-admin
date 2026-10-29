import React from "react";
import iconsData from "./icons-data.json";
import {
  BruviIconProps,
  BruviIconSize,
  ICON_SIZE_MAP,
} from "./types";

const ICONS_MAP = iconsData as Record<
  string,
  { viewBox: string; innerHtml: string }
>;

// Icons with dedicated filled artwork
const FILLED_SUPPORTED = new Set([
  "home",
  "menu",
  "cart",
  "rewards",
  "profile",
  "heart",
  "star",
]);

// Category-colored glyphs (from mobile BruviIconColors)
const CATEGORY_COLORS: Record<string, string> = {
  phin: "#6B4430",
  bean: "#6B4430",
  coffee: "#6B4430",
  leaf: "#566F2C",
};

export function resolveIconDimension(size: BruviIconSize = "regular"): number {
  if (typeof size === "number") return size;
  return ICON_SIZE_MAP[size] || 24;
}

export const BruviIcon = React.forwardRef<SVGSVGElement, BruviIconProps>(
  (
    {
      name,
      size = "regular",
      filled = false,
      semanticLabel,
      categoryColor = false,
      className,
      style,
      color,
      ...restProps
    },
    ref
  ) => {
    // Resolve asset key (check if filled variant requested and available)
    let assetKey: string = name;
    if (filled && FILLED_SUPPORTED.has(name)) {
      const filledKey = `${name}-filled`;
      if (ICONS_MAP[filledKey]) {
        assetKey = filledKey;
      }
    }

    const iconEntry = ICONS_MAP[assetKey] || ICONS_MAP[name];

    if (!iconEntry) {
      console.warn(`[BruviIcon] Unknown icon: "${name}"`);
      return null;
    }

    const numericSize = resolveIconDimension(size);

    // Aspect ratio calculation for non-square glyphs (like wordmark: 132/32, tagline: 240/74)
    const vbParts = iconEntry.viewBox.split(" ").map(Number);
    const vbWidth = vbParts[2] || 24;
    const vbHeight = vbParts[3] || 24;
    const aspect = vbWidth / vbHeight;

    const width = aspect !== 1 ? Math.round(numericSize * aspect) : numericSize;
    const height = numericSize;

    // Resolve color
    const effectiveColor =
      color || (categoryColor ? CATEGORY_COLORS[name] : undefined);

    return (
      <svg
        ref={ref}
        viewBox={iconEntry.viewBox}
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{
          color: effectiveColor,
          display: "inline-block",
          verticalAlign: "middle",
          flexShrink: 0,
          ...style,
        }}
        aria-hidden={!semanticLabel}
        aria-label={semanticLabel}
        role={semanticLabel ? "img" : undefined}
        dangerouslySetInnerHTML={{ __html: iconEntry.innerHtml }}
        {...restProps}
      />
    );
  }
);

BruviIcon.displayName = "BruviIcon";
