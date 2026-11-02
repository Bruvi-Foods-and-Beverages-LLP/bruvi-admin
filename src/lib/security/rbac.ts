import { DomainCapability, AdminUser } from "@/types/auth";

/**
 * Checks if a user has unrestricted permission for a capability or set of capabilities.
 */
export function hasPermission(
  user: AdminUser | null | undefined,
  capability: DomainCapability | string | (DomainCapability | string)[]
): boolean {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;

  const permissions = user.adminProfile?.permissions || [];
  if (permissions.includes("*:*")) return true;

  const capabilities = Array.isArray(capability) ? capability : [capability];
  return capabilities.every((cap) => {
    if (permissions.includes(cap)) return true;
    const [domain] = cap.split(":");
    return permissions.includes(`${domain}:*`);
  });
}

/**
 * Checks if a user possesses one of the authorized enterprise roles.
 */
export function hasRole(
  user: AdminUser | null | undefined,
  requiredRoles: string | string[]
): boolean {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(user.role);
}

/**
 * Checks if a staff member has authorized access to a specific outlet or store.
 */
export function hasStoreAccess(
  user: AdminUser | null | undefined,
  storeIdOrCode: string
): boolean {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "HQ_OPS") return true;

  const accessibleOutlets = user.adminProfile?.accessibleOutletIds || [];
  if (accessibleOutlets.includes("*")) return true;

  return accessibleOutlets.includes(storeIdOrCode) || user.assignedStoreId === storeIdOrCode;
}

/**
 * Checks if a capability requires shift lead / manager approval.
 */
export function requiresApproval(user: AdminUser | null | undefined, capability: DomainCapability): boolean {
  if (!user || user.role === "SUPER_ADMIN") return false;
  return !hasPermission(user, capability);
}

/**
 * Checks if an operation requires a supervisory PIN (Figma A143: e.g. refunds > ₹200, cash drawer manual open).
 */
export function requiresSupervisorPin(user: AdminUser | null | undefined, capability?: DomainCapability): boolean {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") return false;
  return capability === "orders:refund" || capability === "orders:cancel" || !hasPermission(user, capability || "orders:refund");
}

