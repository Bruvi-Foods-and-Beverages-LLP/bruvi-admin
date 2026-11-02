"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { PhinIcon } from "@/components/icons";

export interface AuthGuardProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const initAuth = useAuthStore((s) => s.initAuth);
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);

  React.useEffect(() => {
    initAuth();
  }, [initAuth]);

  React.useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      const redirectUrl = pathname !== "/" ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
      router.replace(redirectUrl);
    }
  }, [mounted, isLoading, isAuthenticated, router, pathname]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#F5F7FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1C3A66] text-white shadow-lg animate-pulse">
            <PhinIcon size={28} color="#FFFFFF" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-serif text-sm font-bold tracking-tight text-[#0F2340]">
              BRUVI HQ ENTERPRISE
            </span>
            <span className="text-[11px] font-medium text-[#7F8CA0]">
              Verifying corporate credentials...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

