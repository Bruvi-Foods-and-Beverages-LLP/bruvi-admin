"use client";

import * as React from "react";
import {
  applyAdminPreferencesToDom,
  useAdminPreferencesStore,
} from "@/stores/use-admin-preferences-store";

export function AdminPreferencesHydrator() {
  const uiScale = useAdminPreferencesStore((s) => s.uiScale);
  const tableDensity = useAdminPreferencesStore((s) => s.tableDensity);

  React.useEffect(() => {
    applyAdminPreferencesToDom({ uiScale, tableDensity });
  }, [uiScale, tableDensity]);

  return null;
}
