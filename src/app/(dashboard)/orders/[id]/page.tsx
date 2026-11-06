"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrderById } from "@/store/slices/orders-slice";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderCancelRefundModal } from "@/components/orders/order-cancel-refund-modal";
import { CoffeeIcon, PhinIcon, WalletIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

import { OrdersApi } from "@/lib/api/orders";
import type { BackendOrderDetail, NextAction } from "@/features/orders/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const PRODUCT_IMAGE_FALLBACKS: Record<string, string> = {
  "salted cream": "/images/menu/figma_salted_cream.png",
  "salted cream cold brew": "/images/menu/figma_salted_cream.png",
  "ca phe sua da": "/images/menu/ca_phe_sua_da.jpg",
  "cà phê sữa đá": "/images/menu/ca_phe_sua_da.jpg",
  "bac xiu": "/images/menu/bac_xiu.jpg",
  "bạc xỉu": "/images/menu/bac_xiu.jpg",
  "coconut coffee": "/images/menu/coconut_coffee.png",
  "egg coffee": "/images/menu/egg_coffee.png",
  "matcha latte": "/images/menu/matcha_latte.jpg",
  "phin den": "/images/menu/phin_den.png",
  "phin đen": "/images/menu/phin_den.png",
  "banh mi": "/images/menu/banh_mi_paneer.png",
  "bánh mì": "/images/menu/banh_mi_paneer.png",
  "vanilla": "/images/menu/vanilla_bac_xiu.png",
};

function getProductImage(item: { productName?: string; image?: string; imageUrl?: string }): string | null {
  if (item.image) return item.image;
  if (item.imageUrl) return item.imageUrl;

  const lower = (item.productName || "").toLowerCase().trim();
  for (const [key, path] of Object.entries(PRODUCT_IMAGE_FALLBACKS)) {
    if (lower.includes(key)) return path;
  }
  return "/images/menu/figma_salted_cream.png";
}

export default function OrderDetailPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const orderId = unwrappedParams.id;

  const dispatch = useAppDispatch();
  const { selectedOrder, isLoading, error } = useAppSelector((state) => state.orders);
  const [backendDetail, setBackendDetail] = React.useState<BackendOrderDetail | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);

  const loadDetail = React.useCallback(async () => {
    try {
      const raw = await OrdersApi.getOrderDetailRaw(orderId);
      setBackendDetail(raw);
    } catch {}
  }, [orderId]);

  React.useEffect(() => {
    dispatch(fetchOrderById(orderId));
    loadDetail();
  }, [dispatch, orderId, loadDetail]);

  const handleTransition = async (action: NextAction) => {
    if (action.action === "CANCEL") {
      setIsCancelModalOpen(true);
      return;
    }

    try {
      await OrdersApi.transitionStatus(selectedOrder?.id || orderId, action.targetStatus, backendDetail?.version);
      await loadDetail();
      dispatch(fetchOrderById(orderId));
    } catch (err: any) {
      if (err?.statusCode === 409) {
        alert("Order status was modified concurrently. Refetching latest status.");
        await loadDetail();
        dispatch(fetchOrderById(orderId));
      } else {
        alert(err.message || "Failed to update order status");
      }
    }
  };

  const handleContact = () => {
    if (selectedOrder?.customerPhone) {
      window.location.href = `tel:${selectedOrder.customerPhone.replace(/[^0-9+]/g, "")}`;
    } else {
      alert(`Customer phone number not available for order ${selectedOrder?.orderNumber}`);
    }
  };

  const handleResendReceipt = async () => {
    try {
      await OrdersApi.resendReceipt(selectedOrder?.id || orderId);
      alert(`Receipt resent for order ${selectedOrder?.orderNumber}.`);
    } catch (err: any) {
      alert(err.message || "Failed to resend receipt");
    }
  };

  if (isLoading && !selectedOrder) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32 rounded" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-72 rounded" />
            <Skeleton className="h-9 w-64 rounded-[12px]" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Skeleton className="h-[396px] rounded-[16px]" />
            <Skeleton className="h-[90px] rounded-[16px]" />
            <Skeleton className="h-[184px] rounded-[16px]" />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Skeleton className="h-[218px] rounded-[16px]" />
            <Skeleton className="h-[468px] rounded-[16px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 max-w-[1136px] mx-auto text-center">
        <h2 className="text-heading-m text-[#0f2340]">Order Not Found</h2>
        <p className="text-body-s text-text-secondary max-w-md">
          We could not locate order records matching &ldquo;{orderId}&rdquo;. It may have been archived or removed.
        </p>
        <Link
          href="/orders"
          className="h-9 px-4 rounded-[12px] bg-[#1c3a66] text-white text-label flex items-center gap-2 hover:bg-[#0f2340] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>
    );
  }

  const order = selectedOrder;

  const rawPhone = backendDetail?.customer?.phone || order.customerPhone || "";
  const phoneDigits = rawPhone.replace(/[^0-9]/g, "");
  const last5 = phoneDigits.length >= 5 ? phoneDigits.slice(-5) : phoneDigits || "83435";
  const memberSince = backendDetail?.customer?.memberSince || order.customerProfile?.memberSince || "Nov 2026";
  const maskedPhone = `+91 ••••• ${last5} · since ${memberSince}`;

  const profile = {
    initials:
      backendDetail?.customer?.initials ||
      order.customerProfile?.initials ||
      (order.customerName || "V").slice(0, 2).toUpperCase(),
    name: backendDetail?.customer?.name || order.customerProfile?.name || order.customerName || "Valued Customer",
    phone: maskedPhone,
    memberSince,
    tier: (backendDetail?.customer?.tier as any) || order.customerProfile?.tier || ("Gold" as const),
    points: backendDetail?.customer?.points || order.customerProfile?.points || "1,240",
    totalOrders: backendDetail?.customer?.totalOrders || order.customerProfile?.totalOrders || 1,
    lifetimeSpend: backendDetail?.customer?.lifetimeSpend || order.customerProfile?.lifetimeSpend || `₹${order.totalAmount}`,
    note: backendDetail?.customer?.note || order.customerProfile?.note || `Usually orders ${order.items?.[0]?.productName || "Cold Brew"} · no complaints on file`,
  };

  const timelineEvents = order.timeline || [
    { time: "9:31", event: "Placed in app · iPhone, v3.2", dotColor: "#55647a" },
    { time: "9:31", event: "Payment authorized · UPI", dotColor: "#55647a" },
    { time: "9:31", event: "Auto-accepted · ticket to Bar 1 KDS", dotColor: "#55647a" },
    { time: "9:37", event: "Started by Arjun S.", dotColor: "#55647a" },
    { time: "9:37", event: "Customer notified “Preparing”", dotColor: "#55647a" },
    { time: "Now", event: "Preparing · ready by 9:45", isCurrent: true, dotColor: "#22629e" },
  ];

  const slaInfo = order.sla || {
    elapsedText: "10 min since placed · target 8 min",
    busyModeText: "Busy mode +10",
    percentage: 80,
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto px-8 py-6 pb-12">
      {/* 1. Header Bar (Figma 225:101514) */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        {/* Left: Breadcrumbs & Title */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 text-body-s text-text-secondary">
            <Link href="/orders" className="hover:text-[#0f2340] transition-colors">
              Orders
            </Link>
            <span>/</span>
            <span>{order.orderNumber}</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-display-s font-display font-black text-[#0f2340] tracking-[-1.2px]">
              {order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} />
            <span className="text-body-s text-text-secondary whitespace-nowrap">
              {order.channel} · {order.storeName} · {order.customerName} · placed {order.time.replace(/\s*(am|pm)\s*(am|pm)/i, ' $1')}
            </span>
          </div>
        </div>

        {/* Right: Actions Bar (Figma 225:101522) */}
        <div className="flex items-center gap-2 shrink-0 flex-nowrap overflow-x-auto max-w-full pb-1 md:pb-0">
          {/* Dynamic Next Actions driven by backend state machine */}
          {backendDetail?.nextActions && backendDetail.nextActions.length > 0 ? (
            backendDetail.nextActions.map((action) => (
              <button
                key={action.action}
                type="button"
                onClick={() => handleTransition(action)}
                className={cn(
                  "h-9 px-3.5 rounded-[12px] text-label font-bold transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex items-center justify-center",
                  action.variant === "primary"
                    ? "bg-[#1c3a66] hover:bg-[#0f2340] active:bg-[#091628] text-white"
                    : action.variant === "danger"
                    ? "bg-white border-[1.5px] border-[#bcc6d3] text-[#c0352b] hover:bg-[#fce8e6]/40"
                    : "bg-white border-[1.5px] border-[#bcc6d3] text-[#0f2340] hover:bg-[#f5f7fa]"
                )}
              >
                {action.label}
              </button>
            ))
          ) : (
            <>
              {order.status !== "Cancelled" && (
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="h-9 px-3.5 rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label font-bold text-[#c0352b] hover:bg-[#fce8e6]/40 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  Cancel order
                </button>
              )}
            </>
          )}

          {/* Contact */}
          <button
            type="button"
            onClick={handleContact}
            className="h-9 px-3.5 rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label font-bold text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
          >
            Contact
          </button>

          {/* Resend receipt */}
          <button
            type="button"
            onClick={handleResendReceipt}
            className="h-9 px-3.5 rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label font-bold text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
          >
            Resend receipt
          </button>

          {/* Refund */}
          <Link
            href={`/orders/${order.orderNumber}/refund`}
            className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] active:bg-[#091628] text-label font-bold text-white transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex items-center justify-center"
          >
            Refund
          </Link>
        </div>
      </div>

      {/* 2. Main Two-Column Grid (Figma 225:101531) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
        {/* Left Column (720px / 8 cols): Items, Payment & Fulfilment */}
        <div className="lg:col-span-8 flex flex-col gap-4 w-full">
          {/* Card 1: Items Card (Figma 225:101533, 720x396) */}
          <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
            {/* Header Row */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-[#dce2ea]">
              <h2 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340]">
                Items · {order.itemCount}
              </h2>
              <span className="text-caption text-text-secondary">
                Ticket on {order.kdsStation || "Bar 1 KDS"} · pickup at counter
              </span>
            </div>

            {/* Items List */}
            <div className="flex flex-col divide-y divide-[#dce2ea]">
              {order.items.map((item, idx) => {
                const imgSrc = getProductImage(item);
                return (
                  <div key={item.id || idx} className="px-5 py-4 flex items-center gap-4">
                    {/* Thumbnail Badge (56x56) */}
                    <div className="w-14 h-14 rounded-[12px] bg-[#f7f2e8] border border-[#dce2ea] overflow-hidden relative shrink-0 flex items-center justify-center">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={item.productName}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6b4430]">
                          {idx % 2 === 0 ? <PhinIcon size={24} /> : <CoffeeIcon size={24} />}
                        </div>
                      )}
                    </div>

                    {/* Middle Column */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <span className="text-[16px] leading-6 font-bold text-[#0f2340]">
                        {item.quantity}× {item.productName}
                      </span>

                      {/* Modifiers row */}
                      {item.modifiers && item.modifiers.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {item.modifiers.map((mod, mi) => (
                            <div
                              key={mi}
                              className="h-6 px-2 rounded-[4px] bg-[#f5f7fa] border border-[#dce2ea] text-caption-bold text-[#55647a] flex items-center whitespace-nowrap"
                            >
                              <span>{mod}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {item.instructions && (
                        <span className="text-[12px] leading-4 font-medium text-text-secondary">
                          Note: “{item.instructions}”
                        </span>
                      )}
                    </div>

                    {/* Price Column */}
                    <div className="text-right shrink-0 flex flex-col items-end">
                      <span className="text-price-s font-display font-extrabold text-[#0f2340] tnum">
                        ₹{item.totalPrice}
                      </span>
                      <span className="text-caption text-text-secondary">
                        ₹{item.unitPrice} each
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals Summary Block (Figma 225:101569, bg #f5f7fa) */}
            <div className="px-5 py-4 bg-[#f5f7fa] border-t border-[#dce2ea] flex flex-col gap-2">
              <div className="flex items-center justify-between text-body-s">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-bold text-[#0f2340] tnum">
                  ₹{(order.subtotal || order.totalAmount).toFixed(2)}
                </span>
              </div>

              {order.promoCode && (
                <div className="flex items-center justify-between text-body-s">
                  <span className="text-text-secondary">{order.promoCode}</span>
                  <span className="font-bold text-[#1f7a4d] tnum">
                    −₹{(order.promoDiscount || 50).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-body-s">
                <span className="text-text-secondary">
                  {order.taxBreakdown || "GST 5% on ₹920 (CGST 2.5% + SGST 2.5%)"}
                </span>
                <span className="font-bold text-[#0f2340] tnum">
                  ₹{(order.taxAmount || 46).toFixed(2)}
                </span>
              </div>

              <div className="pt-2 border-t border-[#dce2ea] flex items-baseline justify-between">
                <span className="text-[16px] leading-6 font-extrabold text-[#0f2340]">
                  Total paid
                </span>
                <span className="text-price-m font-display font-extrabold text-[#0f2340] tnum">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Payment Details Strip (Figma 225:101582, 720x90) */}
          <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs p-[21px] flex items-center gap-4">
            <div className="w-12 h-12 rounded-[12px] bg-[#f5f7fa] border border-[#dce2ea] flex items-center justify-center shrink-0 text-[#0f2340]">
              <WalletIcon size={24} />
            </div>

            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
              <span className="text-body-s font-bold text-[#0f2340] truncate">
                {order.paymentGatewayText || `${order.paymentMethod} · Razorpay · Captured 9:31:07`}
              </span>
              <span className="text-caption text-text-secondary truncate">
                {order.paymentReference || "UPI ref 4290 7712 0034 · pay_P8sJ4vNc19 · settles Sat 3 Oct"}
              </span>
            </div>

            <Link
              href={`/orders/${order.orderNumber}/payment`}
              className="text-label text-[#1c3a66] hover:underline cursor-pointer shrink-0"
            >
              Payment details →
            </Link>
          </div>

          {/* Card 3: Fulfilment Card (Figma 225:101594, 720x184) */}
          <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs p-[21px] flex flex-col gap-4">
            <h2 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340]">
              Fulfilment
            </h2>

            {/* 3 Metric Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-caption text-text-secondary block">Assigned station</span>
                <span className="text-body-s font-bold text-[#0f2340] mt-0.5 block">
                  {order.kdsStation || "Bar 1 KDS (Hot & Cold)"}
                </span>
              </div>
              <div>
                <span className="text-caption text-text-secondary block">Barista on ticket</span>
                <span className="text-body-s font-bold text-[#0f2340] mt-0.5 block">
                  {order.baristaName || "Arjun S. · Shift Lead"}
                </span>
              </div>
              <div>
                <span className="text-caption text-text-secondary block">Priority tier</span>
                <span className="text-body-s font-bold text-[#9a5b00] mt-0.5 block">
                  {order.priorityTier || "Standard app prep"}
                </span>
              </div>
            </div>

            {/* Customer Note Box */}
            <div className="p-3 rounded-[16px] bg-[#f5f7fa] border border-[#dce2ea] flex items-center gap-2">
              <span className="text-body-s text-text-secondary">Customer note:</span>
              <span className="text-body-s font-bold text-[#0f2340]">
                {order.customerNote || "“Please write Saisubbireddy on the cups”"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (400px / 4 cols): Customer & Timeline */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full">
          {/* Card 4: Customer Card (Figma 225:101610, 400x218) */}
          <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs p-[21px] flex flex-col gap-4">
            {/* Identity Row */}
            <div className="flex items-center gap-3">
              {/* Initials (48x48) */}
              <div className="w-12 h-12 rounded-full bg-[#f3e8df] text-[#6b4430] font-extrabold text-[16px] flex items-center justify-center shrink-0">
                {profile.initials}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[16px] leading-6 font-extrabold text-[#0f2340] block truncate">
                  {profile.name}
                </span>
                <span className="text-caption text-text-secondary block truncate">
                  {profile.phone}
                </span>
              </div>

              {/* Gold Tier Pill */}
              <div className="h-6 px-2 rounded-[12px] bg-[#a9d8f3] text-caption-bold text-[#0f2340] font-extrabold flex items-center shrink-0">
                <span>{profile.tier}</span>
              </div>
            </div>

            {/* Metric Tiles */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-[12px] bg-[#f5f7fa] border border-[#dce2ea] flex flex-col">
                <span className="text-caption text-text-secondary">Points</span>
                <span className="text-[16px] leading-6 font-extrabold font-display text-[#0f2340] tnum mt-0.5">
                  {profile.points}
                </span>
              </div>
              <div className="p-3 rounded-[12px] bg-[#f5f7fa] border border-[#dce2ea] flex flex-col">
                <span className="text-caption text-text-secondary">Orders</span>
                <span className="text-[16px] leading-6 font-extrabold font-display text-[#0f2340] tnum mt-0.5">
                  {profile.totalOrders}
                </span>
              </div>
              <div className="p-3 rounded-[12px] bg-[#f5f7fa] border border-[#dce2ea] flex flex-col">
                <span className="text-caption text-text-secondary">Lifetime</span>
                <span className="text-[16px] leading-6 font-extrabold font-display text-[#0f2340] tnum mt-0.5">
                  {profile.lifetimeSpend}
                </span>
              </div>
            </div>

            {/* Note text */}
            <p className="text-caption text-text-secondary leading-relaxed">
              {profile.note}
            </p>
          </div>

          {/* Card 5: Timeline Card (Figma 225:101630, 400x468) */}
          <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs p-[21px] flex flex-col gap-4">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340]">
                Timeline
              </h2>
              <Link
                href={`/orders/${order.orderNumber}/timeline`}
                className="text-label text-[#1c3a66] hover:underline cursor-pointer"
              >
                Full timeline →
              </Link>
            </div>

            {/* Events List */}
            <div className="flex flex-col gap-3 py-1">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="flex items-center gap-3 text-body-s">
                  {/* Dot */}
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      evt.isCurrent ? "bg-[#22629e] animate-pulse" : "bg-[#55647a]"
                    )}
                  />

                  {/* Time */}
                  <span
                    className={cn(
                      "w-12 shrink-0 font-semibold",
                      evt.isCurrent ? "text-[#22629e] font-bold" : "text-text-secondary"
                    )}
                  >
                    {evt.time}
                  </span>

                  {/* Event text */}
                  <span
                    className={cn(
                      "flex-1 truncate",
                      evt.isCurrent ? "font-bold text-[#0f2340]" : "font-normal text-[#0f2340]"
                    )}
                  >
                    {evt.event}
                  </span>
                </div>
              ))}
            </div>

            {/* SLA Alert Box (Figma 225:101659, bg #fdf0d8) */}
            <div className="mt-2 p-3 rounded-[16px] bg-[#fdf0d8] border border-[#f0dfbe] flex flex-col gap-2">
              <div className="flex items-center justify-between text-caption-bold text-[#9a5b00]">
                <span>{slaInfo.elapsedText}</span>
                <span>{slaInfo.busyModeText}</span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-[#0f2340]/15 overflow-hidden">
                <div
                  className="h-full bg-[#9a5b00] rounded-full transition-all duration-500"
                  style={{ width: `${slaInfo.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Cancellation & Refund Modal (Figma 225:102329) */}
      <OrderCancelRefundModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        order={order}
        mode="cancel_and_refund"
        onSuccess={() => {
          dispatch(fetchOrderById(orderId));
        }}
      />
    </div>
  );
}
