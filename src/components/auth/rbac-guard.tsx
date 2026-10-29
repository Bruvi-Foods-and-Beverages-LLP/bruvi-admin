"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/use-auth-store";

export interface RbacGuardProps {
  roles?: string | string[];
  permissions?: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RbacGuard({
  roles,
  permissions,
  fallback = null,
  children,
}: RbacGuardProps) {
  const hasRole = useAuthStore((s) => s.hasRole);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (roles && !hasRole(roles)) {
    return <>{fallback}</>;
  }

  if (permissions && !hasPermission(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

