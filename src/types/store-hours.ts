export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface DayHours {
  day: DayOfWeek;
  isOpen: boolean;
  opens: string;
  closes: string;
  totalFormatted: string;
  isToday?: boolean;
}

export type ChannelType = "SAME_AS_STORE" | "CUSTOM";

export interface ChannelHoursItem {
  channelId: string;
  channelName: string;
  type: ChannelType;
  typeLabel: string;
  badge?: string | null;
  timeRange: string;
  cutoffMinutesBeforeClose: number;
}

export interface SpecialDateItem {
  id: string;
  month: string;
  day: number;
  date: string;
  title: string;
  subtitle: string;
  hours: string;
  isShortDay: boolean;
  isNormalHours: boolean;
  isClosed: boolean;
}

export interface CustomerPreview {
  storeName: string;
  statusText: string;
  detailText: string;
  footnote: string;
  imageUrl?: string | null;
}

export interface StoreHoursEntity {
  storeId: string;
  storeCode: string;
  storeName: string;
  weeklyHours: DayHours[];
  channelHours: ChannelHoursItem[];
  specialDates: SpecialDateItem[];
  timezone: string;
  timezoneLabel: string;
  currentTimeFormatted: string;
  isConfigured: boolean;
  customerPreview: CustomerPreview;
  updatedAt: string;
}

export interface UpdateStoreHoursPayload {
  weeklyHours?: DayHours[];
  channelHours?: Pick<ChannelHoursItem, "channelId" | "cutoffMinutesBeforeClose">[];
  timezone?: string;
  timezoneLabel?: string;
}

export interface CopyHoursPayload {
  targetStoreCodes: string[];
}

export type SpecialDateMode = "CLOSED" | "CUSTOM" | "NORMAL";

export interface AddSpecialDatePayload {
  date: string;
  title: string;
  mode: SpecialDateMode;
  opens?: string;
  closes?: string;
  note?: string;
}
