"use client";

import * as React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchStoreOverview,
} from "@/store/slices/stores-slice";
import { StoreDetailHeader } from "@/components/stores/detail/store-detail-header";
import {
  StoreDetailTabs,
  StoreDetailTab,
} from "@/components/stores/detail/store-detail-tabs";
import { KpiCards } from "@/components/stores/detail/overview/kpi-cards";
import { HourlySalesChart } from "@/components/stores/detail/overview/hourly-sales-chart";
import { RecentIssuesCard } from "@/components/stores/detail/overview/recent-issues-card";
import { LiveChannelsCard } from "@/components/stores/detail/overview/live-channels-card";
import { StoreLocationCard } from "@/components/stores/detail/overview/store-location-card";
import { StoreMenuTab } from "@/components/stores/detail/menu/store-menu-tab";
import { StoreHoursTab } from "@/components/stores/detail/hours/store-hours-tab";
import { StoreDetailSkeleton } from "@/components/stores/detail/store-detail-skeleton";
import { pushStoreMenuToDevices } from "@/store/slices/store-menu-slice";
import { saveStoreHours, setCopyModalOpen } from "@/store/slices/store-hours-slice";
import { StoreIcon } from "@/components/icons";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StoreDetailPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const storeId = unwrappedParams.id;

  const dispatch = useAppDispatch();
  const overview = useAppSelector(
    (state) => state.stores.currentStoreOverview
  );
  const isLoading = useAppSelector(
    (state) => state.stores.isOverviewLoading
  );
  const error = useAppSelector(
    (state) => state.stores.overviewError
  );

  const storeMenu = useAppSelector((state) => state.storeMenu.currentStoreMenu);
  const isPushing = useAppSelector((state) => state.storeMenu.isSubmitting);
  const currentStoreHours = useAppSelector((state) => state.storeHours.currentStoreHours);
  const isSavingHours = useAppSelector((state) => state.storeHours.isSaving);

  const [activeTab, setActiveTab] = React.useState<StoreDetailTab>("overview");
  const [userToggledPause, setUserToggledPause] = React.useState<boolean | null>(null);

  const isAppOrdersPaused =
    userToggledPause !== null
      ? userToggledPause
      : overview?.liveChannels?.appPickup?.status === "PAUSED";

  React.useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreOverview(storeId));
    }
  }, [dispatch, storeId]);

  const handleToggleAppOrders = () => {
    setUserToggledPause(!isAppOrdersPaused);
  };

  const handlePushToDevices = () => {
    if (overview?.store) {
      dispatch(pushStoreMenuToDevices(overview.store.code || overview.store.id));
    }
  };

  const handleExportMenu = () => {
    if (!storeMenu || !overview?.store) return;
    const jsonStr = JSON.stringify(storeMenu, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bruvi_${overview.store.code.toLowerCase()}_menu.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveHours = () => {
    if (overview?.store && currentStoreHours) {
      dispatch(
        saveStoreHours({
          storeIdOrCode: overview.store.code || overview.store.id,
          payload: {
            weeklyHours: currentStoreHours.weeklyHours,
            channelHours: currentStoreHours.channelHours,
            specialDates: currentStoreHours.specialDates,
            timezone: currentStoreHours.timezone,
            timezoneLabel: currentStoreHours.timezoneLabel,
          },
        })
      );
    }
  };

  const handleCopyHours = () => {
    dispatch(setCopyModalOpen(true));
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1136px] w-full">
      {/* Loading Skeleton State */}
      {isLoading || !overview || (overview.store.id !== storeId && overview.store.code !== storeId) ? (
        <StoreDetailSkeleton />
      ) : error ? (
        /* Error / Not Found State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-surface text-error mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-heading-s text-text">
            Store Not Found
          </h2>
          <p className="text-body-s text-text-muted max-w-md mt-1 mb-6">
            {error || `Unable to find store information for identifier "${storeId}".`}
          </p>
          <Link
            href="/stores"
            className="flex items-center gap-2 h-9 px-4 rounded-[12px] bg-primary text-white text-label hover:bg-navy-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all stores</span>
          </Link>
        </div>
      ) : (
        /* Main Store Detail Content */
        <>
          {/* Top Architecture: Header (Figma Node 225:86590 / 225:88139 / 225:87727) */}
          <StoreDetailHeader
            store={overview.store}
            activeTab={activeTab}
            isAppOrdersPaused={isAppOrdersPaused}
            onToggleAppOrders={handleToggleAppOrders}
            onPushToDevices={handlePushToDevices}
            onExportMenu={handleExportMenu}
            isPushing={isPushing}
            onSaveHours={handleSaveHours}
            onCopyHours={handleCopyHours}
            isSavingHours={isSavingHours}
          />

          {/* Tabs Navigation (Figma Node 225:86611) */}
          <StoreDetailTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Active Tab View */}
          {activeTab === "overview" ? (
            /* Figma Node 225:86622: Two-column layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (712px / 8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* 4 Stat / KPI Metric Cards (Figma Node 225:86624) */}
                <KpiCards kpi={overview.kpi} />

                {/* Today's Sales by Hour Bar Chart (Figma Node 225:86641) */}
                <HourlySalesChart
                  hourlySales={overview.hourlySales}
                  peakHour={overview.peakHour}
                  peakSales={overview.peakSales}
                  channelBreakdown={overview.channelBreakdown}
                />

                {/* Recent Issues Card (Figma Node 225:86693) */}
                <RecentIssuesCard issues={overview.recentIssues} />
              </div>

              {/* Right Column (400px / 4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Live Channels Status Card (Figma Node 225:86720) */}
                <LiveChannelsCard
                  channels={{
                    ...overview.liveChannels,
                    appPickup: {
                      ...overview.liveChannels.appPickup,
                      status: isAppOrdersPaused ? "PAUSED" : "ONLINE",
                      detail: isAppOrdersPaused ? "Paused" : "Active",
                    },
                  }}
                />

                {/* Store Location with Pinpointed Google Map (Figma Node 225:86749) */}
                <StoreLocationCard store={overview.store} />
              </div>
            </div>
          ) : activeTab === "hours" ? (
            /* Figma Node 225:87687: Store Hours Tab View */
            <StoreHoursTab store={overview.store} />
          ) : activeTab === "menu" ? (
            /* Figma Node 225:88099: Store Menu Tab View */
            <StoreMenuTab store={overview.store} />
          ) : (
            /* Placeholder for future tabs (Hours, Devices, Staff) */
            <div className="p-12 rounded-[16px] bg-surface border border-border text-center flex flex-col items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 border border-border text-text-muted mb-3">
                <StoreIcon className="h-7 w-7" />
              </div>
              <h3 className="text-heading-s text-text capitalize">
                {activeTab} Management
              </h3>
              <p className="text-body-s text-text-muted max-w-sm mt-1">
                The {activeTab} configuration interface for {overview.store.name} will be released in the upcoming update.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
