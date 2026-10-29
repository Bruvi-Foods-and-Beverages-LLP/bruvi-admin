import { DomainCapability, AdminUser } from "@/types/auth";

/**
 * Checks if a user has unrestricted permission for a capability.
 */
export function hasPermission(user: AdminUser | null | undefined, capability: DomainCapability): boolean {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;

  const access = user.permissions[capability];
  return access === "ALLOWED" || access === "SENSITIVE_NEEDS_PIN";
}

/**
 * Checks if a capability requires shift lead / manager approval.
 */
export function requiresApproval(user: AdminUser | null | undefined, capability: DomainCapability): boolean {
  if (!user || user.role === "SUPER_ADMIN") return false;
  return user.permissions[capability] === "PARTIAL_NEEDS_APPROVAL";
}

/**
 * Checks if an operation requires a supervisory PIN (Figma A143: e.g. refunds > ₹200, cash drawer manual open).
 */
export function requiresSupervisorPin(user: AdminUser | null | undefined, capability: DomainCapability): boolean {
  if (!user) return false;
  return user.permissions[capability] === "SENSITIVE_NEEDS_PIN";
}

