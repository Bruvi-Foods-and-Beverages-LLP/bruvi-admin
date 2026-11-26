"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Images } from "lucide-react";

interface RecipeMediaPreviewCardProps {
  imageUrl: string;
  videoDuration?: string;
  photosCount?: number;
  onPlayVideo?: () => void;
  onViewPhotos?: () => void;
}

/**
 * Recipe Media & Training Video Card (Figma Frame 474:230114)
 * High-definition beverage visual with interactive overlay triggers
 * for barista training SOP videos and plating photography.
 */
export function RecipeMediaPreviewCard({
  imageUrl,
  videoDuration = "0:42",
  photosCount = 3,
  onPlayVideo,
  onViewPhotos,
}: RecipeMediaPreviewCardProps) {
  return (
    <div className="w-full h-40 rounded-[16px] relative overflow-hidden bg-surface-warm border border-border group select-none shadow-2xs">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt="Recipe preview"
        fill
        className="object-cover group-hover:scale-102 transition-transform duration-300"
        priority
      />

      {/* Subtle bottom gradient scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Overlay Action Buttons (Figma Frame 474:230115) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
        <button
          type="button"
          onClick={onPlayVideo}
          className="h-8 px-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-caption-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Training video · {videoDuration}</span>
        </button>

        <button
          type="button"
          onClick={onViewPhotos}
          className="h-8 px-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-caption-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Images className="w-3.5 h-3.5" />
          <span>{photosCount} photos</span>
        </button>
      </div>
    </div>
  );
}
