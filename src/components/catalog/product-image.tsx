"use client";

import * as React from "react";
import Image from "next/image";
import { CoffeeIcon } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  /** Rendered width hint for the Next.js optimizer, e.g. "40px". */
  sizes: string;
  iconSize?: number;
  className?: string;
}

/**
 * Product photo that fills its (relative) parent.
 * Served through the Next.js image optimizer so a 1024px storage original ships as a
 * right-sized WebP, and falls back to the coffee glyph when missing or unloadable.
 */
export function ProductImage({ src, alt, sizes, iconSize = 18, className }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);

  if (!src || failedSrc === src) {
    return <CoffeeIcon size={iconSize} className="text-[#7F8CA0]" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => setFailedSrc(src)}
    />
  );
}
