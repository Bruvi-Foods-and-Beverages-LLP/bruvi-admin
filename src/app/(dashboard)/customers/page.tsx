"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCustomers } from "@/store/slices/customers-slice";
import { CustomersPageHeader } from "@/components/customers/customers-page-header";
import { CUSTOMER_TABS, CustomersTabBar, type CustomerTab } from "@/components/customers/customers-tab-bar";
import { CustomersStatCards } from "@/components/customers/customers-stat-cards";
import { CustomersFilterToolbar } from "@/components/customers/customers-filter-toolbar";
import { CustomersTable } from "@/components/customers/customers-table";
import { CustomersPaginationFooter } from "@/components/customers/customers-pagination-footer";
import { CustomersWalletView } from "@/components/customers/wallet/customers-wallet-view";
import { CustomersSegmentsView } from "@/components/customers/segments/customers-segments-view";
import { CustomersSupportView } from "@/components/customers/support/customers-support-view";
import { CustomersTableSkeleton } from "@/components/customers/customers-skeleton";
import { CUSTOMER_TAB_CAPABILITY } from "@/config/sidebar-navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { useSupportLiveStore } from "@/stores/use-support-live-store";

/**
 * Omnichannel Customers & CRM Intelligence Dashboard (Figma 225:103290)
 * Conforms strictly to 1136px design grid, 4px spacing units, Archivo/Manrope/Caslon tokens.
 * The active tab lives in `?tab=` so a live chat alert can deep-link to
 * `?tab=support&ticket=<id>` (and an order to `?tab=support&order=<id>`).
 */
export default function CustomersPage() {
  return (
    <React.Suspense fallback={<p role="status" className="font-sans text-[14px] text-[#55647a]">Loading customers…</p>}>
      <CustomersScreen />
    </React.Suspense>
  );
}

function isCustomerTab(value: string | null): value is CustomerTab {
  return CUSTOMER_TABS.some((t) => t.id === value);
}

function CustomersScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const { isLoading, customers } = useAppSelector((state) => state.customers);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const supportUnresolved = useSupportLiveStore((s) => s.unresolved);
  const [createOpen, setCreateOpen] = React.useState(false);

  const allowedTabs = CUSTOMER_TABS.map((t) => t.id).filter((id) => hasPermission(CUSTOMER_TAB_CAPABILITY[id]));
  const requested = params.get("tab");
  const activeTab: CustomerTab =
    isCustomerTab(requested) && allowedTabs.includes(requested) ? requested : (allowedTabs[0] ?? "customers");
  const canSeeCustomers = allowedTabs.includes("customers");
  const orderId = params.get("order") ?? undefined;
  const ticketId = params.get("ticket") ?? undefined;

  const goTo = React.useCallback(
    (tab: CustomerTab, extra: Record<string, string> = {}) => {
      const query = new URLSearchParams({ tab, ...extra });
      router.replace(`/customers?${query.toString()}`, { scroll: false });
    },
    [router],
  );

  // Load initial mobile customers stream
  React.useEffect(() => {
    if (canSeeCustomers) dispatch(fetchCustomers());
  }, [dispatch, canSeeCustomers]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
      {/* 1. Header Bar with Overline, Title, Export & Create Segment (Figma 225:103330) */}
      <CustomersPageHeader
        showActions={canSeeCustomers}
        onCreateSegment={() => {
          goTo("segments");
          setCreateOpen(true);
        }}
      />

      {/* 2. Sub-Navigation Tabs: Customers, Wallet, Segments, Support (Figma 225:103340) */}
      <CustomersTabBar
        activeTab={activeTab}
        tabs={allowedTabs}
        supportUnresolved={supportUnresolved}
        onTabChange={(tab) => goTo(tab)}
      />

      {activeTab === "customers" ? (
        <>
          {/* 3. 4 KPI Stat Cards (Figma 225:103347) */}
          <CustomersStatCards />

          {/* 4. Customers Master Table Card (Figma 225:103364) */}
          <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
            {/* Filter Toolbar with Search, Segment Pills, Tier Dropdown & Clear (Figma 225:103365) */}
            <CustomersFilterToolbar />

            {/* High-Density Customers Table with Header & Rows (Figma 225:103396) */}
            {isLoading && customers.length === 0 ? (
              <CustomersTableSkeleton />
            ) : (
              <CustomersTable />
            )}

            {/* Pagination & Telemetry Footer (Figma 225:103546) */}
            <CustomersPaginationFooter />
          </div>
        </>
      ) : activeTab === "wallet" ? (
        <CustomersWalletView />
      ) : activeTab === "segments" ? (
        <CustomersSegmentsView
          createOpen={createOpen}
          onCreateOpen={() => setCreateOpen(true)}
          onCreateClose={() => setCreateOpen(false)}
        />
      ) : (
        <CustomersSupportView
          key={orderId ?? "all"}
          orderId={orderId}
          initialTicketId={ticketId}
          onClearOrder={() => goTo("support")}
        />
      )}
    </div>
  );
}
