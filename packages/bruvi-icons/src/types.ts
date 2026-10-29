import type { SVGProps } from "react";

export type BruviIconSize = "inline" | "button" | "regular" | "kiosk" | "empty" | number;

export const ICON_SIZE_MAP: Record<string, number> = {
  inline: 16,
  button: 20,
  regular: 24,
  kiosk: 32,
  empty: 48,
};

export type BruviIconCategory = "neutral" | "coffee" | "matcha";

export type BruviIconName =
  | "add"
  | "alert"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "arrow-up"
  | "asterisk"
  | "bag"
  | "battery"
  | "bean"
  | "bowl"
  | "briefcase"
  | "building"
  | "calendar"
  | "card"
  | "cart"
  | "cart-filled"
  | "chart"
  | "chat"
  | "check"
  | "chevron"
  | "chevron-down"
  | "chevron-left"
  | "chevron-up"
  | "circle-help"
  | "cloche"
  | "close"
  | "coffee"
  | "corner"
  | "crosshair"
  | "cup"
  | "device-status"
  | "download"
  | "external-link"
  | "eye"
  | "eye-off"
  | "file"
  | "flask"
  | "glass"
  | "google-workspace"
  | "heart"
  | "heart-filled"
  | "home"
  | "home-filled"
  | "iced"
  | "layout"
  | "leaf"
  | "list"
  | "location"
  | "location-pin"
  | "location-off"
  | "lock"
  | "map"
  | "menu"
  | "menu-filled"
  | "message"
  | "monitor"
  | "more-vertical"
  | "notification"
  | "offline"
  | "parcel"
  | "pastry"
  | "pencil"
  | "phin"
  | "phone"
  | "profile"
  | "profile-filled"
  | "receipt"
  | "refresh"
  | "refresh-cw"
  | "remove"
  | "rewards"
  | "rewards-filled"
  | "rotate-ccw"
  | "scan-qr"
  | "search"
  | "send"
  | "shield-check"
  | "star"
  | "star-filled"
  | "store"
  | "success"
  | "sun"
  | "tag"
  | "tag-off"
  | "time"
  | "timer"
  | "trash"
  | "users"
  | "volume"
  | "wallet"
  | "warehouse"
  | "wifi"
  | "wordmark"
  | "wordmark-tagline";

export interface BruviIconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: BruviIconName;
  size?: BruviIconSize;
  filled?: boolean;
  semanticLabel?: string;
  categoryColor?: boolean;
}

