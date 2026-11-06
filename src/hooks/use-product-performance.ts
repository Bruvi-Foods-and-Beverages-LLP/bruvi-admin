"use client";

import * as React from "react";
import { CatalogApi } from "@/lib/api/catalog";
import type { ProductPerformance, ProductPerformanceFilters } from "@/types/catalog";

const REFRESH_MS = 30_000;

interface State {
  data: ProductPerformance | null;
  loading: boolean;
  error: string | null;
}

/**
 * Loads real performance numbers for a product and refreshes them every 30 s while the tab is
 * visible. A failed refresh keeps the last good numbers on screen and only reports the error.
 */
export function useProductPerformance(
  productId: string,
  filters: ProductPerformanceFilters = {},
): State & { refresh: () => void } {
  const [state, setState] = React.useState<State>({ data: null, loading: true, error: null });
  const filterKey = JSON.stringify(filters);

  const load = React.useCallback(
    async (isCancelled: () => boolean) => {
      try {
        const data = await CatalogApi.getProductPerformance(
          productId,
          JSON.parse(filterKey) as ProductPerformanceFilters,
        );
        if (!isCancelled()) setState({ data, loading: false, error: null });
      } catch (e) {
        if (isCancelled()) return;
        const message = e instanceof Error ? e.message : "Could not load performance";
        setState((prev) => ({ data: prev.data, loading: false, error: message }));
      }
    },
    [productId, filterKey],
  );

  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    void load(isCancelled);

    const timer = setInterval(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- polling an external API
      if (document.visibilityState === "visible") void load(isCancelled);
    }, REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [load, tick]);

  return { ...state, refresh: () => setTick((t) => t + 1) };
}
