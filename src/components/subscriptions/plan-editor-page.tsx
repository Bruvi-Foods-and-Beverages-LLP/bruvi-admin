"use client";

import * as React from "react";
import { ApiClientError } from "@/lib/api/client";
import { MembershipApi, type AdminOptionsDto, type AdminPlanDto } from "@/lib/api/membership";
import { PlanEditor, PlanEditorSkeleton } from "./plan-editor";
import { LoadErrorNotice } from "./primitives";
import type { LoadError } from "@/store/slices/membership-slice";

/** Loads the editor's data (options, and the plan when editing). */
export function PlanEditorPage({ planId }: { planId?: string }) {
  const [state, setState] = React.useState<{ options: AdminOptionsDto; plan: AdminPlanDto | null } | null>(null);
  const [error, setError] = React.useState<LoadError | null>(null);
  const load = React.useCallback(() => {
    Promise.all([MembershipApi.options(), planId ? MembershipApi.plan(planId) : Promise.resolve(null)])
      .then(([options, plan]) => {
        setError(null);
        setState({ options, plan });
      })
      .catch((e) =>
        setError({
          message: e instanceof Error ? e.message : "Could not load",
          forbidden: e instanceof ApiClientError && e.statusCode === 403,
          offline: typeof navigator !== "undefined" && !navigator.onLine,
        }),
      );
  }, [planId]);
  React.useEffect(() => load(), [load]);
  if (error) return <LoadErrorNotice error={error} onRetry={load} what="the plan editor" />;
  if (!state) return <PlanEditorSkeleton />;
  return <PlanEditor plan={state.plan} options={state.options} />;
}
