"use client";

import * as React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { StoreMenuItem } from "@/types/store-menu";
import { ChannelToggleSwitch } from "./channel-toggle-switch";

interface StoreMenuItemRowProps {
  item: StoreMenuItem;
  isSelected: boolean;
  onToggleSelect: (itemId: string) => void;
  onToggleChannel: (
    itemId: string,
    channel: "channelCounter" | "channelApp" | "channelKiosk" | "channelQr",
    val: boolean
  ) => void;
}

export function StoreMenuItemRow({
  item,
  isSelected,
  onToggleSelect,
  onToggleChannel,
}: StoreMenuItemRowProps) {
  const isAvailable = item.status === "AVAILABLE";

  const renderStatusBadge = () => {
    switch (item.status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[12px] font-bold whitespace-nowrap">
            {item.statusLabel || "Available"}
          </span>
        );
      case "HIDDEN_INGREDIENT_OUT":
      case "LOW_STOCK":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FEF3E2] text-[#B45309] text-[12px] font-bold whitespace-nowrap">
            {item.statusLabel}
          </span>
        );
      case "AUTO_HIDDEN_OUT":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[12px] font-bold whitespace-nowrap">
            {item.statusLabel}
          </span>
        );
      case "SOLD_OUT":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[12px] font-bold whitespace-nowrap">
            {item.statusLabel || "Sold out"}
          </span>
        );
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 h-[72px] px-5 border-b border-border transition-colors select-none",
        isSelected ? "bg-bg-subtle" : "bg-surface hover:bg-gray-50/50"
      )}
    >
      {/* Checkbox (24px) */}
      <div className="w-6 shrink-0 flex items-center justify-center">
        <button
          type="button"
          onClick={() => onToggleSelect(item.itemId)}
          aria-label={isSelected ? `Deselect ${item.name}` : `Select ${item.name}`}
          className={cn(
            "h-5 w-5 rounded-[4px] border-[1.5px] flex items-center justify-center transition-all cursor-pointer",
            isSelected
              ? "bg-primary border-primary text-white"
              : "border-border-input bg-surface hover:border-text"
          )}
        >
          {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </button>
      </div>

      {/* Item info (Image + Title + Subtitle) */}
      <div className="flex-1 min-w-[260px] flex items-center gap-3">
        {/* Thumbnail */}
        <div
          className={cn(
            "relative h-12 w-12 rounded-[8px] bg-bg-subtle overflow-hidden shrink-0 flex items-center justify-center border border-border/40",
            !isAvailable && "opacity-50"
          )}
        >
          {item.imageUrl ? (
            item.imageUrl.endsWith(".svg") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            )
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-cream-100 text-[#6B4430] text-xs font-bold">
              {item.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-label text-text font-bold truncate">
            {item.name}
          </span>
          <span className="text-caption text-text-muted truncate">
            {item.subtitle || item.sku}
          </span>
        </div>
      </div>

      {/* Base Price (80px) */}
      <div className="w-20 shrink-0 text-right">
        <span className="text-price-xs text-text font-display">
          {item.basePriceFormatted}
        </span>
      </div>

      {/* Override Price (80px) */}
      <div className="w-20 shrink-0 text-right">
        <span className="text-body-s text-text-muted">
          {item.overridePriceFormatted || "—"}
        </span>
      </div>

      {/* Counter Toggle (64px) */}
      <div className="w-16 shrink-0 flex justify-center">
        <ChannelToggleSwitch
          checked={item.channelCounter}
          onChange={(val) => onToggleChannel(item.itemId, "channelCounter", val)}
          ariaLabel={`Toggle Counter channel for ${item.name}`}
        />
      </div>

      {/* App Toggle (64px) */}
      <div className="w-16 shrink-0 flex justify-center">
        <ChannelToggleSwitch
          checked={item.channelApp}
          onChange={(val) => onToggleChannel(item.itemId, "channelApp", val)}
          ariaLabel={`Toggle App channel for ${item.name}`}
        />
      </div>

      {/* Kiosk Toggle (64px) */}
      <div className="w-16 shrink-0 flex justify-center">
        <ChannelToggleSwitch
          checked={item.channelKiosk}
          onChange={(val) => onToggleChannel(item.itemId, "channelKiosk", val)}
          ariaLabel={`Toggle Kiosk channel for ${item.name}`}
        />
      </div>

      {/* QR Toggle (64px) */}
      <div className="w-16 shrink-0 flex justify-center">
        <ChannelToggleSwitch
          checked={item.channelQr}
          onChange={(val) => onToggleChannel(item.itemId, "channelQr", val)}
          ariaLabel={`Toggle QR channel for ${item.name}`}
        />
      </div>

      {/* Status Badge (160px) */}
      <div className="w-40 shrink-0 flex items-center justify-start">
        {renderStatusBadge()}
      </div>
    </div>
  );
}
