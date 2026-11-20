"use client";

import * as React from "react";
import { AdminAuthClient } from "@/features/auth/api/auth-client";

const STREAM_URL = "/api/proxy/events/stream";
const MAX_BACKOFF_MS = 30_000;

/**
 * Live support updates over the shared Server-Sent Events stream: `onChange` gets the id of a
 * ticket or chat that changed (new customer message, status change). Reconnects with backoff
 * and refreshes the session once when the stream is refused. `connected` lets the inbox slow
 * its fallback polling while pushes flow.
 */
export function useSupportEvents(onChange: (ticketId: string) => void): { connected: boolean } {
  const [connected, setConnected] = React.useState(false);
  const handlerRef = React.useRef(onChange);
  React.useEffect(() => {
    handlerRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") return;
    let source: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;
    let stopped = false;

    const deliver = (raw: MessageEvent<string>) => {
      try {
        const data = JSON.parse(raw.data) as { ticketId?: string };
        if (data.ticketId) handlerRef.current(data.ticketId);
      } catch {
        // ignore malformed events
      }
    };

    const scheduleReconnect = async () => {
      if (stopped) return;
      setConnected(false);
      attempt += 1;
      if (attempt <= 2) {
        await AdminAuthClient.refreshSession(AdminAuthClient.getToken()).catch(() => null);
      }
      retryTimer = setTimeout(connect, Math.min(MAX_BACKOFF_MS, 1000 * 2 ** Math.min(attempt - 1, 5)));
    };

    function connect() {
      if (stopped) return;
      source = new EventSource(STREAM_URL);
      source.addEventListener("ready", () => {
        attempt = 0;
        setConnected(true);
      });
      source.addEventListener("support.updated", deliver as EventListener);
      source.onerror = () => {
        if (source?.readyState === EventSource.CLOSED) {
          source.close();
          void scheduleReconnect();
        } else {
          setConnected(false);
        }
      };
    }

    connect();
    return () => {
      stopped = true;
      if (retryTimer) clearTimeout(retryTimer);
      source?.close();
    };
  }, []);

  return { connected };
}
