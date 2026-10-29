/**
 * Enterprise Roles defined in Figma A142 / A143
 */
export type UserRole =
  | "STORE_MANAGER"
  | "SHIFT_LEAD"
  | "BARISTA"
  | "CASHIER"
  | "KITCHEN"
  | "WAREHOUSE"
  | "HQ_OPS"
  | "FINANCE"
  | "MARKETING"
  | "SUPER_ADMIN";

/**
 * 4-Tier Permission Matrix Capability Access Levels (Figma A143)
 */
export type CapabilityAccessLevel =
  | "ALLOWED"
  | "PARTIAL_NEEDS_APPROVAL"
  | "NOT_ALLOWED"
  | "SENSITIVE_NEEDS_PIN";

/**
 * Granular Domain Capabilities
 */
export type DomainCapability =
  | "orders:view"
  | "orders:create"
  | "orders:refund"
  | "orders:cancel"
  | "menu:view"
  | "menu:edit_price"
  | "menu:toggle_86"
  | "recipes:view"
  | "recipes:edit"
  | "inventory:count"
  | "inventory:adjust"
  | "inventory:waste"
  | "warehouse:grn"
  | "warehouse:po"
  | "dispatch:assign"
  | "dispatch:edit_zones"
  | "finance:view_reports"
  | "finance:reconcile"
  | "staff:view"
  | "staff:manage_shifts"
  | "system:audit_logs"
  | "system:settings";

/**
 * Authenticated HQ Staff User Profile
 */
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  assignedStoreId?: string | null; // Null indicates HQ all-store scope
  permissions: Record<DomainCapability, CapabilityAccessLevel>;
  is2FAEnabled: boolean;
  lastLoginAt?: string;
}

/**
 * Staff Session Context
 */
export interface AdminSession {
  user: AdminUser;
  accessToken: string;
  expiresAt: number;
}

