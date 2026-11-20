"use client";

import * as React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCustomerOverview,
  fetchCustomerOrders,
  fetchCustomerWallet,
  fetchCustomerLoyalty,
} from "@/store/slices/customers-slice";
import {
  CustomerDetailHeader,
  CustomerDetailTabs,
  CustomerDetailTab,
  CustomerDetailSkeleton,
  CustomerKpiCards,
  CustomerFavouriteCard,
  CustomerRecentActivityCard,
  CustomerClubCard,
  CustomerPreferencesCard,
  CustomerLatestNoteCard,
  CustomerOrdersTab,
  CustomerWalletTab,
  CustomerLoyaltyTab,
  CustomerNotesTab,
  AddPointsModal,
} from "@/components/customers/detail";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { CustomersApi } from "@/lib/api/customers";
import type { CustomerNote } from "@/types/customers";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Pixel-Perfect Omnichannel Customer Detail Page (Figma 474:239742 / A071)
 * Adheres strictly to 1136px grid, 4px spacing unit, Archivo/Manrope tokens.
 */
export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const unwrappedParams = React.use(params);
  const customerId = unwrappedParams.id;

  const dispatch = useAppDispatch();
  const {
    currentCustomerOverview,
    ordersDetail,
    walletDetail,
    loyaltyDetail,
    isDetailLoading,
    detailError,
  } = useAppSelector((state) => state.customers);

  const [activeTab, setActiveTab] = React.useState<CustomerDetailTab>("overview");
  const [notes, setNotes] = React.useState<CustomerNote[]>([]);
  const loadNotes = React.useCallback(async () => {
    if (!customerId) return;
    try {
      setNotes(await CustomersApi.getCustomerNotes(customerId));
    } catch {
      setNotes([]);
    }
  }, [customerId]);
  React.useEffect(() => {
    void loadNotes();
  }, [loadNotes]);
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = React.useState(false);

  // Load customer overview and prefetch other tabs
  React.useEffect(() => {
    if (!customerId) return;
    dispatch(fetchCustomerOverview(customerId));
    dispatch(fetchCustomerOrders(customerId));
    dispatch(fetchCustomerWallet(customerId));
    dispatch(fetchCustomerLoyalty(customerId));
  }, [dispatch, customerId]);

  // Loading skeleton
  if (
    isDetailLoading ||
    !currentCustomerOverview ||
    (currentCustomerOverview.customer.id !== customerId &&
      currentCustomerOverview.customer.code !== customerId)
  ) {
    return (
      <div className="flex flex-col gap-6 max-w-[1136px] w-full mx-auto pb-10">
        <CustomerDetailSkeleton />
      </div>
    );
  }

  // Error / Not Found state
  if (detailError && !currentCustomerOverview) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-[1136px] w-full mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-surface text-error mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-heading-s text-text font-display font-black text-[22px]">
          Customer Not Found
        </h2>
        <p className="text-body-s text-text-muted max-w-md mt-1 mb-6">
          {detailError || `Unable to find customer record for identifier "${customerId}".`}
        </p>
        <Link
          href="/customers"
          className="flex items-center gap-2 h-9 px-4 rounded-[12px] bg-primary text-white text-label hover:bg-navy-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all customers</span>
        </Link>
      </div>
    );
  }

  const { customer, metrics, favourite, recentActivity, subscription, preferences, latestNote } =
    currentCustomerOverview;

  return (
    <div className="flex flex-col gap-6 max-w-[1136px] w-full mx-auto pb-12">
      {/* 1. Header with Breadcrumb, Avatar, Tier, Subscription, Action Buttons (Figma 474:295725) */}
      <CustomerDetailHeader
        customer={customer}
        onOpenAddPointsModal={() => setIsAddPointsModalOpen(true)}
      />

      {/* 2. Sub-Navigation Tabs: Overview, Orders, Wallet, Loyalty, Notes (Figma 474:239807) */}
      <CustomerDetailTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        visitsCount={customer.visits}
        notesCount={notes.length}
      />

      {/* 3. Active Tab View */}
      {activeTab === "overview" ? (
        /* Overview Two Column Layout (Figma 474:239818) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: KPIs, Favourite Drink, Recent Activity (720px / 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* 4 KPI Metrics Card (Figma 474:239820) */}
            <CustomerKpiCards metrics={metrics} />

            {/* Favourite Drink Hero Card (Figma 474:239837) */}
            <CustomerFavouriteCard favourite={favourite} />

            {/* Recent Activity Card (Figma 474:239846) */}
            <CustomerRecentActivityCard
              activities={recentActivity}
              onViewFullTimeline={() => setActiveTab("orders")}
            />
          </div>

          {/* Right Column: Club Subscription, Preferences, Latest Note (400px / 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* BRUVI Club Subscription Card (Figma 474:239890) */}
            <CustomerClubCard subscription={subscription} />

            {/* Preferences & Consent Card (Figma 474:239904) */}
            <CustomerPreferencesCard preferences={preferences} />

            {/* Latest Note Card (Figma 474:239944) */}
            <CustomerLatestNoteCard
              note={latestNote}
              onViewAllNotes={() => setActiveTab("notes")}
            />
          </div>
        </div>
      ) : activeTab === "orders" ? (
        /* Orders Tab View (Figma A072: 474:239974) */
        <CustomerOrdersTab ordersDetail={ordersDetail} />
      ) : activeTab === "wallet" ? (
        /* Wallet Tab View (Figma A073: 474:240376) */
        <CustomerWalletTab
          customerId={customer.id}
          walletDetail={walletDetail}
        />
      ) : activeTab === "loyalty" ? (
        /* Loyalty Tab View (Figma A074: 474:240758) */
        <CustomerLoyaltyTab
          customerId={customer.id}
          loyaltyDetail={loyaltyDetail}
        />
      ) : (
        /* Notes Tab View */
        <CustomerNotesTab
          customerId={customer.id}
          notes={notes}
          onAdded={loadNotes}
        />
      )}

      {/* 4. Action Modals */}
      <AddPointsModal
        isOpen={isAddPointsModalOpen}
        onClose={() => setIsAddPointsModalOpen(false)}
        customer={customer}
      />
    </div>
  );
}

