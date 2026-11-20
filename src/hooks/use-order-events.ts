"use client";

import * as React from "react";
import { AdminAuthClient } from "@/features/auth/api/auth-client";

/** A change pushed by the backend. Ids only: refetch what the screen shows. */
export type OrderEvent =
  | {
      type: "order.updated";
      orderId: string;
      version: number;
      outletId: string | null;
      customerId: string | null;
      status: string | null;
      at: string;
    }
  | { type: "orders.changed"; outletId: string | null; at: string };

const STREAM_URL = "/api/proxy/events/stream";
const MAX_BACKOFF_MS = 30_000;

/**
 * Live order updates over Server-Sent Events (`GET /v1/events/stream` through the BFF proxy,
 * which adds the session token from the cookie).
 *
 * Reconnects with backoff; when the stream is refused (expired session) it refreshes the token
 * once, which rewrites the cookie, and connects again. `connected` lets screens slow their
 * fallback polling while pushes are flowing.
 */
export function useOrderEvents(onEvent: (event: OrderEvent) => void): { connected: boolean } {
  const [connected, setConnected] = React.useState(false);
  const handlerRef = React.useRef(onEvent);
  React.useEffect(() => {
    handlerRef.current = onEvent;
  }, [onEvent]);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") return;

    let source: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;
    let stopped = false;

    const deliver = (raw: MessageEvent<string>) => {
      try {
        handlerRef.current(JSON.parse(raw.data) as OrderEvent);
      } catch {
        // ignore malformed events
      }
    };

    const scheduleReconnect = async () => {
      if (stopped) return;
      setConnected(false);
      attempt += 1;
      // A refused stream is usually an expired access token: refresh it (shared with any
      // request that is refreshing at the same moment) before trying again.
      if (attempt <= 2) {
        await AdminAuthClient.refreshSession(AdminAuthClient.getToken()).catch(() => null);
      }
      const delay = Math.min(MAX_BACKOFF_MS, 1000 * 2 ** Math.min(attempt - 1, 5));
      retryTimer = setTimeout(connect, delay);
    };

    function connect() {
      if (stopped) return;
      source = new EventSource(STREAM_URL);
      source.addEventListener("ready", () => {
        attempt = 0;
        setConnected(true);
      });
      source.addEventListener("order.updated", deliver as EventListener);
      source.addEventListener("orders.changed", deliver as EventListener);
      source.onerror = () => {
        // The browser retries a dropped stream by itself; a refused one (401) ends CLOSED
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
