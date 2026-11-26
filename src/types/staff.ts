export type StaffStatus = "ON_SHIFT" | "OFF" | "LEAVE" | "INVITED";

export type StaffScope = "Store" | "Warehouse" | "HQ";

export type StaffAppKey = "Staff app" | "POS" | "KDS" | "Warehouse app" | "HQ Admin";

export type PermissionAccessLevel = "allowed" | "partial" | "none";

export interface StaffCertification {
  id: string;
  label: string;
  status: "valid" | "expiring" | "expired";
  detail?: string;
}

export interface StaffMember {
  id: string;
  empCode: string;
  name: string;
  initials: string;
  avatarTone?: "sky" | "cream" | "coffee" | "matcha";
  roleId: string;
  roleName: string;
  storeId: string;
  storeName: string;
  status: StaffStatus;
  statusMeta: string;
  phoneMasked: string;
  certifications: StaffCertification[];
  joinedLabel: string;
  isPendingOnboarding?: boolean;
}

export interface StaffAccessItem {
  id: string;
  appName: string;
  deviceOrScope: string;
  icon: "phone" | "monitor" | "card";
  granted: boolean;
}

export interface StaffScheduleDay {
  dayLabel: string;
  timeRange: string | null;
  station?: string;
  note?: string;
  isSwapPending?: boolean;
  swapLabel?: string;
  isOff?: boolean;
}

export interface StaffNote {
  id: string;
  text: string;
  author: string;
  authorRole: string;
  dateLabel: string;
}

export interface StaffDocumentItem {
  id: string;
  title: string;
  subtitle: string;
  kind: "cert" | "doc";
  hasViewAction?: boolean;
}

export interface StaffDetail extends StaffMember {
  storeCode: string;
  reportsTo: string;
  tenureLabel: string;
  todayShift: {
    dateLabel: string;
    timeRange: string;
    stationLabel: string;
    clockedInLabel: string;
    geofenceLabel: string;
    startTime: string;
    endTime: string;
    nowLabel: string;
    progressPercent: number;
    breakPercentStart: number;
    breakPercentWidth: number;
    avgMakeTime: string;
    avgMakeDelta: string;
    checklistsRate: string;
    checklistsSub: string;
    issuesCount: string;
    issuesSub: string;
  };
  nextTwoWeeks: {
    rangeLabel: string;
    summaryLabel: string;
    days: StaffScheduleDay[];
  };
  access: StaffAccessItem[];
  documents: StaffDocumentItem[];
  notes: StaffNote[];
}

export interface StaffRole {
  id: string;
  name: string;
  description: string;
  scope: StaffScope;
  defaultApps: StaffAppKey[];
  memberCount: number;
  keyPermissions: Array<{
    label: string;
    level: PermissionAccessLevel;
    sensitive?: boolean;
  }>;
  totalPermissionsCount: number;
  memberPreviews: Array<{ initials: string; tone: "sky" | "cream" | "coffee" | "matcha" }>;
  membersSummary: string;
}

export interface PermissionCapability {
  id: string;
  area: "ORDERS" | "CASH" | "INVENTORY" | "MENU" | "STAFF" | "FINANCE" | "SETTINGS";
  label: string;
  subtitle?: string;
  sensitive?: boolean;
  levelsByRole: Record<string, PermissionAccessLevel>;
}

export interface PermissionChangeLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  summary: string;
  isUnsaved?: boolean;
}

export type StationKind = "Bar" | "Counter" | "Kitchen";

export interface RotaCell {
  timeRange?: string;
  station?: StationKind;
  isOff?: boolean;
  isLeave?: boolean;
  isSwap?: boolean;
  swapText?: string;
}

export interface RotaRow {
  staffId: string;
  name: string;
  initials: string;
  roleName: string;
  cells: RotaCell[]; // 7 days: Mon 28 .. Sun 4
}

export interface CoverageHourPoint {
  hourLabel: string;
  scheduled: number;
  forecastNeeded: number;
  isNow?: boolean;
}

export interface OpenShiftItem {
  id: string;
  storeName: string;
  roleLabel: string;
  meta: string;
  urgent?: boolean;
}

export interface SwapRequestItem {
  id: string;
  fromName: string;
  fromMeta: string;
  toName: string;
  toMeta: string;
  requestedMeta: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
}
