export type StoreDeviceType = "POS" | "KDS" | "KIOSK" | "PRINTER" | "CARD_TERMINAL";

export type StoreDeviceStatus = "ONLINE" | "OFFLINE" | "PENDING" | "ATTENTION";

export type StoreStationKind = "drinks" | "food" | "expo";

export interface StoreStation {
  id: string;
  code: string;
  name: string;
  kind: StoreStationKind;
  summary: string;
  printerLabel: string;
  channelsSummary: string;
  deviceCount: number;
}

export interface StoreDevice {
  id: string;
  code: string;
  subtitle: string;
  type: StoreDeviceType;
  stationId?: string | null;
  station: string;
  status: StoreDeviceStatus;
  statusLabel: string;
  lastSeenLabel: string;
  version: string;
  updateAvailable?: boolean;
  isDisabled?: boolean;
  disabledReason?: string | null;
  pendingCode?: string | null;
  pendingCodeExpiresAtIso?: string | null;
}

export interface StoreNetworkInfo {
  primaryName: string;
  primaryMeta: string;
  primaryStatus: string;
  backupName: string;
  backupMeta: string;
  backupStatus: string;
  routerUptime: string;
  latencyToHq: string;
  offlineModeNote: string;
}

export interface ActivePairingCode {
  code: string;
  deviceType: StoreDeviceType;
  deviceName: string;
  station: string;
  expiresAtIso: string;
  expiresAtLabel: string;
}

export interface StoreDevicesData {
  storeId: string;
  latestVersion: string;
  onlineCount: number;
  totalCount: number;
  attentionCount: number;
  network: StoreNetworkInfo;
  stations: StoreStation[];
  devices: StoreDevice[];
  activePairingCode: ActivePairingCode | null;
}
