"use client";

import * as React from "react";
import { useSupportEvents } from "@/hooks/use-support-events";
import { ApiClientError } from "@/lib/api/client";
import { SupportAdminApi } from "@/lib/api/support";
import { useAuthStore } from "@/stores/use-auth-store";
import { useSupportLiveStore } from "@/stores/use-support-live-store";
import { SupportLiveAlert } from "./support-live-alert";

/** Roles the support API accepts (SupportAdminController @Roles). */
const SUPPORT_ROLES = ["SUPER_ADMIN", "ADMIN", "STORE_MANAGER"];

/**
 * Keeps the live chat state for the whole admin panel: the blue dot on
 * Customers, the dot on the Support tab, the inbox refresh signal and the
 * full-screen alert stack. Mount once in the dashboard layout.
 */
export function SupportLiveWatcher() {
  const role = useAuthStore((s) => s.user?.role);
  const canSupport = useAuthStore((s) => s.hasPermission("orders:view"));
  if (!role || !SUPPORT_ROLES.includes(role) || !canSupport) return null;
  return <LiveWatcher />;
}

function LiveWatcher() {
  const setLive = useSupportLiveStore((s) => s.setLive);
  const setConnected = useSupportLiveStore((s) => s.setConnected);
  const recordEvent = useSupportLiveStore((s) => s.recordEvent);
  const [blocked, setBlocked] = React.useState(false);
  const inFlight = React.useRef(false);
  const queued = React.useRef(false);
  const debounce = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // One request at a time; a call that arrives meanwhile runs once more after it.
  const refresh = React.useCallback(async () => {
    if (inFlight.current) {
      queued.current = true;
      return;
    }
    inFlight.current = true;
    try {
      do {
        queued.current = false;
        try {
          setLive(await SupportAdminApi.live());
        } catch (error) {
          // No support access for this account: stop asking.
          if (error instanceof ApiClientError && (error.statusCode === 401 || error.statusCode === 403)) {
            setBlocked(true);
            queued.current = false;
          }
        }
      } while (queued.current);
    } finally {
      inFlight.current = false;
    }
  }, [setLive]);

  const { connected } = useSupportEvents((ticketId) => {
    recordEvent(ticketId);
    // A burst (message + status change) becomes one refresh.
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => void refresh(), 300);
  });

  React.useEffect(() => setConnected(connected), [connected, setConnected]);

  // First load, then a fallback poll: 10 s without the live stream, 60 s with it.
  React.useEffect(() => {
    if (blocked) return;
    void refresh();
    const tick = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const timer = setInterval(tick, connected ? 60_000 : 10_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [blocked, connected, refresh]);

  React.useEffect(
    () => () => {
      if (debounce.current) clearTimeout(debounce.current);
    },
    [],
  );

  return blocked ? null : <SupportLiveAlert />;
}
