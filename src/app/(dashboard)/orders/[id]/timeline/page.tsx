"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrdersApi } from "@/lib/api/orders";
import { OrderTimelineDetail, OrderTimelineItem } from "@/types/orders";
import {
  CreditCard,
  Check,
  Monitor,
  Bell,
  Clock,
  Download,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type FilterTab = "ALL" | "PEOPLE" | "SYSTEM";

export default function OrderTimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const orderId = resolvedParams.id;

  const [timeline, setTimeline] = useState<OrderTimelineDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [messageSent, setMessageSent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchTimeline() {
      try {
        setLoading(true);
        setError(null);
        const data = await OrdersApi.getOrderTimeline(orderId);
        if (isMounted) {
          setTimeline(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load order timeline"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTimeline();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportLog = () => {
    if (!timeline) return;
    const jsonStr = JSON.stringify(timeline, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${timeline.orderNumber}-timeline.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Timeline log exported successfully");
  };

  const handleMessageBar = () => {
    setMessageSent(true);
    showToast(`Priority broadcast sent to ${timeline?.storeName || "store"} bar`);
    setTimeout(() => setMessageSent(false), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1c3a66]" />
        <span className="text-body-s text-text-secondary">
          Loading audit telemetry for order {orderId}…
        </span>
      </div>
    );
  }

  if (error || !timeline) {
    return (
      <div className="max-w-[1136px] mx-auto py-12 px-4 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-bold text-[#0f2340]">Failed to load timeline</h2>
        <p className="text-body-s text-text-secondary max-w-md">
          {error || "Order timeline data could not be retrieved from the server."}
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-[#1c3a66] text-white text-sm font-bold"
          >
            Retry
          </button>
          <Link
            href={`/orders/${orderId}`}
            className="px-4 py-2 rounded-xl border border-[#dce2ea] text-[#0f2340] text-sm font-bold hover:bg-slate-50"
          >
            Back to order
          </Link>
        </div>
      </div>
    );
  }

  // Filter events based on activeTab
  const allEvents = timeline.events;
  const filteredEvents = allEvents.filter((evt) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "PEOPLE") return evt.category === "customer" || evt.category === "staff";
    if (activeTab === "SYSTEM") return evt.category === "system";
    return true;
  });

  const peopleCount = allEvents.filter(
    (e) => e.category === "customer" || e.category === "staff"
  ).length;
  const systemCount = allEvents.filter((e) => e.category === "system").length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0f2340] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Header Block (Figma 225:102940, 1136x62) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
          {/* Left Column: Breadcrumbs + Title Row */}
          <div className="flex flex-col gap-1">
            {/* Breadcrumb (Figma 225:102942) */}
            <div className="flex items-center gap-1.5 text-body-s text-text-secondary">
              <Link href="/orders" className="hover:text-[#0f2340] transition-colors">
                Orders
              </Link>
              <span>/</span>
              <Link
                href={`/orders/${timeline.orderNumber}`}
                className="hover:text-[#0f2340] transition-colors"
              >
                {timeline.orderNumber}
              </Link>
              <span>/</span>
              <span className="text-[#0f2340] font-semibold">Timeline</span>
            </div>

            {/* Title Row with Status Pill + Subtitle (Figma 225:102943) */}
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <h1 className="text-[28px] sm:text-[32px] leading-[38px] font-extrabold font-display text-[#0f2340]">
                {timeline.orderNumber} timeline
              </h1>

              {/* Status Pill (Figma 225:102945) */}
              <div className="h-6 px-2.5 rounded-[12px] bg-[#e1effe] text-caption-bold text-[#1c3a66] flex items-center font-bold">
                <span>{timeline.status}</span>
              </div>

              {/* Order Metadata Subtext (Figma 225:102947) */}
              <span className="text-body-s text-text-secondary">
                {timeline.channel} · {timeline.storeName} · {timeline.customerName} · ₹{timeline.totalAmount}
              </span>
            </div>
          </div>

          {/* Right Column: Actions (Figma 225:102948) */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            {/* Export Log Button (Figma 225:102949) */}
            <button
              type="button"
              onClick={handleExportLog}
              className="h-9 px-4 rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download size={14} className="text-[#3f4b5e]" />
              <span>Export log</span>
            </button>

            {/* Open Order Button (Figma 225:102951) */}
            <Link
              href={`/orders/${timeline.orderNumber}`}
              className="h-9 px-4 rounded-[12px] bg-[#1c3a66] text-label text-white font-bold hover:bg-[#152e52] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Open order</span>
              <ExternalLink size={13} className="text-white/80" />
            </Link>
          </div>
        </div>

        {/* Main Two-Column Layout (Figma 225:102953, 1136x702, gap 16px) */}
        <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
          {/* Left Column: Event History Card (Figma 225:102954, 720px width) */}
          <div className="w-full lg:w-[720px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px_25px] flex flex-col gap-0 shadow-2xs shrink-0">
            {/* Card Header (Figma 225:102955) */}
            <div className="flex items-center justify-between pb-4 border-b border-[#f0f3f6]">
              <h2 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340]">
                All events · {filteredEvents.length}
              </h2>

              {/* Filter Tabs (Figma 225:102957) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("ALL")}
                  className={cn(
                    "h-6 px-2.5 rounded-[12px] text-caption-bold font-bold transition-all cursor-pointer",
                    activeTab === "ALL"
                      ? "bg-[#0f2340] text-white shadow-2xs"
                      : "border border-[#dce2ea] text-text-secondary hover:bg-slate-50"
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("PEOPLE")}
                  className={cn(
                    "h-6 px-2.5 rounded-[12px] text-caption-bold font-bold transition-all cursor-pointer",
                    activeTab === "PEOPLE"
                      ? "bg-[#0f2340] text-white shadow-2xs"
                      : "border border-[#dce2ea] text-text-secondary hover:bg-slate-50"
                  )}
                >
                  People · {peopleCount}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("SYSTEM")}
                  className={cn(
                    "h-6 px-2.5 rounded-[12px] text-caption-bold font-bold transition-all cursor-pointer",
                    activeTab === "SYSTEM"
                      ? "bg-[#0f2340] text-white shadow-2xs"
                      : "border border-[#dce2ea] text-text-secondary hover:bg-slate-50"
                  )}
                >
                  System · {systemCount}
                </button>
              </div>
            </div>

            {/* Event Rows (Figma 225:102964 ~ 225:103073) */}
            <div className="flex flex-col pt-3">
              {filteredEvents.map((evt, idx) => {
                const isLast = idx === filteredEvents.length - 1;
                return (
                  <div key={evt.id} className="flex items-start gap-4 group">
                    {/* Time Column (80px wide) */}
                    <div className="w-20 shrink-0 pt-1">
                      <span
                        className={cn(
                          "text-[14px] leading-5 font-semibold",
                          evt.isCurrent ? "text-[#1c3a66] font-bold" : "text-text-secondary"
                        )}
                      >
                        {evt.time}
                      </span>
                    </div>

                    {/* Timeline Dot / Icon Column (32px wide) */}
                    <div className="w-8 shrink-0 flex flex-col items-center">
                      {/* Avatar Node */}
                      {evt.avatarType === "initials" ? (
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-extrabold text-[12px]",
                            evt.category === "customer"
                              ? "bg-[#f5ede7] text-[#6b4430]"
                              : "bg-[#e1effe] text-[#1c3a66]"
                          )}
                        >
                          {evt.avatarText}
                        </div>
                      ) : evt.isCurrent ? (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-[#1c3a66] opacity-30" />
                          <div className="w-8 h-8 rounded-full bg-[#1c3a66] border border-[#22629e] flex items-center justify-center shrink-0 text-white shadow-xs">
                            <Clock size={15} />
                          </div>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#f5f7fa] border border-[#dce2ea] flex items-center justify-center shrink-0 text-[#3f4b5e]">
                          {evt.avatarIcon === "payment" && <CreditCard size={14} />}
                          {evt.avatarIcon === "check" && <Check size={14} />}
                          {evt.avatarIcon === "kds" && <Monitor size={14} />}
                          {evt.avatarIcon === "bell" && <Bell size={14} />}
                          {evt.avatarIcon === "note" && <MessageSquare size={14} />}
                          {!evt.avatarIcon && <Check size={14} />}
                        </div>
                      )}

                      {/* Connector Line (w-0.5, h-[26px], omitted on the last live step) */}
                      {!isLast && !evt.isCurrent && (
                        <div className="w-[2px] h-[26px] bg-[#dce2ea]" />
                      )}
                    </div>

                    {/* Details Column (526px wide) */}
                    <div className="flex-1 min-w-0 pt-1 pb-4 flex flex-col gap-0.5">
                      {/* Title + Tag Badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] leading-5 font-bold text-[#0f2340]">
                          {evt.title}
                        </span>

                        {/* Tag */}
                        <div
                          className={cn(
                            "h-5 px-2 rounded-[4px] text-[11px] leading-[14px] font-bold flex items-center",
                            evt.tag === "Customer" && "bg-[#f5ede7] text-[#6b4430]",
                            evt.tag === "Staff" && "bg-[#e1effe] text-[#1c3a66]",
                            evt.tag === "System" && "bg-[#f5f7fa] text-text-secondary border border-[#dce2ea]/50",
                            evt.tag === "Live" && "bg-[#e1effe] text-[#1c3a66]"
                          )}
                        >
                          <span>{evt.tag}</span>
                        </div>
                      </div>

                      {/* Subtitle Description */}
                      <p className="text-[12px] leading-4 font-medium text-text-secondary truncate">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Up Next Section (Figma 225:103090, 670x125, border-t #bcc6d3) */}
            <div className="border-t border-[#bcc6d3] pt-5 mt-2 flex flex-col gap-3">
              <span className="text-[12px] leading-4 font-bold uppercase tracking-wider text-[#8c9ba8]">
                Up next
              </span>

              {timeline.upcomingSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-4">
                  {/* Time / Placeholder */}
                  <div className="w-20 shrink-0">
                    <span className="text-[14px] leading-5 text-[#8c9ba8] font-normal">
                      {step.time}
                    </span>
                  </div>

                  {/* Empty Dot Circle */}
                  <div className="w-8 shrink-0 flex justify-center">
                    <div className="w-8 h-8 rounded-full border border-dashed border-[#bcc6d3] shrink-0" />
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] leading-5 text-[#8c9ba8] font-normal block truncate">
                      {step.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Figma 225:103100, 400px width, gap 16px) */}
          <div className="w-full lg:w-[400px] flex flex-col gap-4 shrink-0">
            {/* Card 1: Service Level Card (Figma 225:103101, dark navy #0f2340, 400x245) */}
            <div className="w-full rounded-[16px] bg-[#0f2340] p-5 text-white flex flex-col gap-4 shadow-sm">
              {/* Top Row: Overline + Over target pill */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] leading-[14px] font-serif uppercase tracking-wider text-[#a9d8f3]/80">
                  Service level
                </span>
                <div className="h-6 px-2.5 rounded-[12px] bg-[#3b1219] text-[#ff8585] text-caption-bold font-bold flex items-center">
                  <span>{timeline.serviceLevel.statusText}</span>
                </div>
              </div>

              {/* Stat Row */}
              <div className="flex items-baseline gap-2">
                <span className="text-[40px] leading-[44px] font-extrabold font-display text-white tnum">
                  {timeline.serviceLevel.elapsedTime}
                </span>
                <span className="text-body-s text-[#a9d8f3]/80">
                  {timeline.serviceLevel.elapsedSubtext}
                </span>
              </div>

              {/* Progress Bar + Ticks */}
              <div className="flex flex-col gap-2">
                {/* 2-color Segmented bar (8px height, rounded-full) */}
                <div className="w-full h-2 rounded-[4px] bg-[#1d3353] overflow-hidden flex">
                  <div
                    style={{ width: `${timeline.serviceLevel.percentageSuccess}%` }}
                    className="h-full bg-[#4ecb71]"
                  />
                  <div
                    style={{ width: `${timeline.serviceLevel.percentageOver}%` }}
                    className="h-full bg-[#ff6b6b]"
                  />
                </div>

                {/* Scale labels */}
                <div className="flex items-center justify-between text-caption text-[#a9d8f3]/70 font-medium">
                  <span>0:00</span>
                  <span>{timeline.serviceLevel.targetTime}</span>
                  <span>{timeline.serviceLevel.elapsedTime}</span>
                </div>
              </div>

              {/* Divider + 3 Metrics Grid (Figma 225:103118) */}
              <div className="border-t border-[#a9d8f3]/20 pt-4 grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-caption text-[#a9d8f3]/70 font-medium">Queue wait</span>
                  <span className="text-[16px] leading-6 font-extrabold font-display text-white tnum mt-0.5">
                    {timeline.serviceLevel.queueWait}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-caption text-[#a9d8f3]/70 font-medium">Make time</span>
                  <span className="text-[16px] leading-6 font-extrabold font-display text-white tnum mt-0.5">
                    {timeline.serviceLevel.makeTime}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-caption text-[#a9d8f3]/70 font-medium">Ready by</span>
                  <span className="text-[16px] leading-6 font-extrabold font-display text-white tnum mt-0.5">
                    {timeline.serviceLevel.readyBy}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Why it’s late Card (Figma 225:103128, 400x441, white card) */}
            <div className="w-full rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col gap-3 shadow-2xs min-h-[441px]">
              {/* Title */}
              <h3 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340]">
                {timeline.whyItsLate.title}
              </h3>

              {/* Narrative explanation */}
              <p className="text-body-s text-text-secondary leading-relaxed">
                {timeline.whyItsLate.explanation}
              </p>

              {/* Action Breakdown counts (Figma 225:103131) */}
              <div className="flex flex-col gap-2 pt-2">
                {/* Customer Action */}
                <div className="flex items-center gap-2 text-caption font-medium text-text-secondary">
                  <div className="w-3 h-3 rounded-full bg-[#f5ede7] border border-[#6b4430] shrink-0" />
                  <span>Customer action · {timeline.whyItsLate.customerActionsCount}</span>
                </div>

                {/* Staff Action */}
                <div className="flex items-center gap-2 text-caption font-medium text-text-secondary">
                  <div className="w-3 h-3 rounded-full bg-[#e1effe] border border-[#22629e] shrink-0" />
                  <span>Staff action · {timeline.whyItsLate.staffActionsCount}</span>
                </div>

                {/* System Event */}
                <div className="flex items-center gap-2 text-caption font-medium text-text-secondary">
                  <div className="w-3 h-3 rounded-full bg-[#f5f7fa] border border-[#bcc6d3] shrink-0" />
                  <span>System event · {timeline.whyItsLate.systemEventsCount}</span>
                </div>
              </div>

              {/* Spacer to push action button to bottom */}
              <div className="flex-1" />

              {/* Message Indiranagar Bar Action Button (Figma 225:103142) */}
              <button
                type="button"
                onClick={handleMessageBar}
                disabled={messageSent}
                className={cn(
                  "w-full h-12 rounded-[12px] border-[1.5px] border-[#bcc6d3] text-label font-bold text-[#0f2340] hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs",
                  messageSent && "bg-emerald-50 border-emerald-500 text-emerald-800"
                )}
              >
                <MessageSquare size={16} className={messageSent ? "text-emerald-700" : "text-[#3f4b5e]"} />
                <span>
                  {messageSent
                    ? "Broadcast dispatched ✓"
                    : `Message ${timeline.whyItsLate.barStoreName}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
