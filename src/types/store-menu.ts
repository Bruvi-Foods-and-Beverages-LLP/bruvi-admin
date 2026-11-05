export type StoreMenuItemStatus =
  | "AVAILABLE"
  | "HIDDEN_INGREDIENT_OUT"
  | "LOW_STOCK"
  | "AUTO_HIDDEN_OUT"
  | "SOLD_OUT";

export type StoreMenuItemTone = "success" | "warning" | "error" | "neutral";

export interface StoreMenuItem {
  id: string;
  storeId: string;
  storeCode: string;
  itemId: string;
  name: string;
  subtitle?: string | null;
  category: string;
  sku: string;
  basePricePaise: number;
  basePriceFormatted: string;
  overridePricePaise?: number | null;
  overridePriceFormatted?: string | null;
  isAddon: boolean;
  channelCounter: boolean;
  channelApp: boolean;
  channelKiosk: boolean;
  channelQr: boolean;
  status: StoreMenuItemStatus;
  statusLabel: string;
  statusTone: StoreMenuItemTone;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  displayOrder: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface StoreMenuCategory {
  id: string;
  name: string;
  count: number;
  totalCount: number;
}

export interface StoreMenuFeed {
  store: {
    id: string;
    code: string;
    name: string;
  };
  totalCount: number;
  unavailableCount: number;
  categories: StoreMenuCategory[];
  items: StoreMenuItem[];
}

export interface UpdateStoreMenuItemPayload {
  channelCounter?: boolean;
  channelApp?: boolean;
  channelKiosk?: boolean;
  channelQr?: boolean;
  overridePricePaise?: number | null;
  status?: StoreMenuItemStatus;
  statusLabel?: string;
  statusTone?: StoreMenuItemTone;
}

export interface BulkStoreMenuPayload {
  itemIds: string[];
  action: "mark_available" | "mark_sold_out" | "hide_channel" | "set_price_override";
  channel?: "counter" | "app" | "kiosk" | "qr" | "all";
  overridePricePaise?: number | null;
}
