"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMembershipOptions } from "@/store/slices/membership-slice";
import { MembershipApi } from "@/lib/api/membership";
import { PlansOverview } from "./plans-overview";
import { SubscribersView } from "./subscribers-view";
import { PageHeading, UnderlineTabs, primaryButtonClass, secondaryButtonClass } from "./primitives";

type Tab = "plans" | "subscribers";

/** Subscriptions workspace: Plans (A110) and Subscribers (A113) tabs; the tab lives in the URL. */
export function SubscriptionsScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const tab: Tab = params.get("tab") === "subscribers" ? "subscribers" : "plans";
  const options = useAppSelector((s) => s.membership.options);
  const summary = useAppSelector((s) => s.membership.summary.data);
  const counts = useAppSelector((s) => s.membership.subscribers.data?.counts);
  const filters = useAppSelector((s) => s.membership.subscribers.filters);
  const [giftOpen, setGiftOpen] = React.useState(false);
  const canWrite = options?.canWrite ?? false;

  React.useEffect(() => {
    dispatch(fetchMembershipOptions());
  }, [dispatch]);

  const subscriberCount = summary?.totalSubscribers ?? (counts ? counts.active + counts.trialing : null);
  const exportHref = MembershipApi.exportUrl(filters);

  return (
    <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6 pb-10">
      <div className="flex w-full flex-col gap-4">
        <PageHeading
          overline="Growth · BRUVI Club"
          title="Subscriptions"
          actions={
            tab === "plans" ? (
              <>
                <a href={MembershipApi.exportUrl({})} className={`${secondaryButtonClass} inline-flex items-center`} download>
                  Export
                </a>
                <button type="button" className={primaryButtonClass} disabled={!canWrite} title={!canWrite ? "Your role can't create plans" : undefined} onClick={() => router.push("/subscriptions/plans/new")}>
                  New plan
                </button>
              </>
            ) : (
              <>
                <a href={exportHref} className={`${secondaryButtonClass} inline-flex items-center`} download>
                  Export CSV
                </a>
                <button type="button" className={primaryButtonClass} disabled={!canWrite} title={!canWrite ? "Your role can't gift memberships" : undefined} onClick={() => setGiftOpen(true)}>
                  Gift a membership
                </button>
              </>
            )
          }
        />
        <UnderlineTabs<Tab>
          value={tab}
          tabs={[
            { value: "plans", label: "Plans", href: "/subscriptions" },
            {
              value: "subscribers",
              label: "Subscribers",
              count: subscriberCount != null ? subscriberCount.toLocaleString("en-IN") : null,
              href: "/subscriptions?tab=subscribers",
            },
          ]}
        />
      </div>
      {tab === "plans" ? <PlansOverview /> : <SubscribersView giftOpen={giftOpen} onGiftClose={() => setGiftOpen(false)} />}
    </div>
  );
}
