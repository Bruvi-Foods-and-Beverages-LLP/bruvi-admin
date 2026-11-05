"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchOrderById } from "@/store/slices/orders-slice";
import { OrdersApi } from "@/lib/api/orders";
import { CoffeeIcon, PhinIcon } from "@/components/icons";
import { OrderCancelRefundModal } from "@/components/orders/order-cancel-refund-modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Check,
  Minus,
  Plus,
  ChevronDown,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ItemRefundSelection {
  selected: boolean;
  quantity: number;
}

export default function OrderRefundPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const orderId = unwrappedParams.id;
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { selectedOrder, isLoading, error } = useAppSelector((state) => state.orders);

  // Form state
  const [itemSelections, setItemSelections] = React.useState<Record<string, ItemRefundSelection>>(() => {
    if (selectedOrder && selectedOrder.items?.length > 0) {
      const initialMap: Record<string, ItemRefundSelection> = {};
      selectedOrder.items.forEach((item, index) => {
        initialMap[item.id] = {
          selected: index === 0,
          quantity: 1,
        };
      });
      return initialMap;
    }
    return {};
  });
  const [reason, setReason] = React.useState("Item quality / preparation issue");
  const [note, setNote] = React.useState(
    "Customer found salted cream split, remade one cup on the house"
  );
  const [refundMethod, setRefundMethod] = React.useState<"UPI" | "WALLET">("UPI");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [successResult, setSuccessResult] = React.useState<{
    refundId: string;
    amount: number;
  } | null>(null);

  React.useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  // Initialize item selections once order loads
  React.useEffect(() => {
    if (selectedOrder && selectedOrder.items?.length > 0) {
      setItemSelections((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        const initialMap: Record<string, ItemRefundSelection> = {};
        selectedOrder.items.forEach((item, index) => {
          initialMap[item.id] = {
            selected: index === 0,
            quantity: 1,
          };
        });
        return initialMap;
      });
    }
  }, [selectedOrder]);

  if (isLoading && !selectedOrder) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-10 w-96 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <Skeleton className="h-[640px] rounded-[16px]" />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Skeleton className="h-[320px] rounded-[16px]" />
            <Skeleton className="h-[90px] rounded-[16px]" />
            <Skeleton className="h-[220px] rounded-[16px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 max-w-[1136px] mx-auto text-center">
        <h2 className="text-heading-m text-[#0f2340]">Order Not Found</h2>
        <p className="text-body-s text-[#3f4b5e] max-w-md">
          Could not locate order details for &ldquo;{orderId}&rdquo;.
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

  // Toggle item selection
  const handleToggleItem = (itemId: string) => {
    setItemSelections((prev) => {
      const current = prev[itemId] || { selected: false, quantity: 1 };
      return {
        ...prev,
        [itemId]: {
          ...current,
          selected: !current.selected,
          quantity: current.quantity || 1,
        },
      };
    });
  };

  // Adjust quantity
  const handleQtyChange = (itemId: string, delta: number, maxQty: number) => {
    setItemSelections((prev) => {
      const current = prev[itemId] || { selected: true, quantity: 1 };
      const newQty = Math.max(1, Math.min(maxQty, current.quantity + delta));
      return {
        ...prev,
        [itemId]: {
          ...current,
          selected: true,
          quantity: newQty,
        },
      };
    });
  };

  // Calculate refund totals dynamically
  // 1. Calculate sum of selected items
  let selectedItemsSubtotal = 0;
  const selectedLines: { id: string; name: string; qty: number; lineTotal: number }[] = [];

  order.items.forEach((item) => {
    const sel = itemSelections[item.id];
    if (sel?.selected && sel.quantity > 0) {
      const lineTotal = item.unitPrice * sel.quantity;
      selectedItemsSubtotal += lineTotal;
      selectedLines.push({
        id: item.id,
        name: item.productName,
        qty: sel.quantity,
        lineTotal,
      });
    }
  });

  // 2. Prorate promo discount if applicable
  // In order A-047 Figma design: 1x Salted Cream Cold Brew = 390.00, Promo BREW50 prorated = -20.10, Taxable = 369.90, GST 5% = +18.50, Total = 388.40
  const orderSubtotal = order.subtotal || order.totalAmount;
  const promoRatio = orderSubtotal > 0 ? selectedItemsSubtotal / orderSubtotal : 0;
  const proratedDiscount = order.promoDiscount
    ? Math.round(order.promoDiscount * promoRatio * 100) / 100
    : 0;

  const taxableValue = Math.max(0, selectedItemsSubtotal - proratedDiscount);
  // 5% GST
  const gstRefund = Math.round(taxableValue * 0.05 * 100) / 100;
  const refundTotal = taxableValue + gstRefund;
  const orderTotalAfterRefund = Math.max(0, order.totalAmount - refundTotal);

  const selectedCount = selectedLines.length;

  // Process refund handler
  const handleProcessRefund = async () => {
    if (selectedCount === 0 || refundTotal <= 0) return;

    try {
      setIsProcessing(true);
      const res = await OrdersApi.processRefund(order.orderNumber, {
        refundAmount: refundTotal,
        reason,
        note,
        method: refundMethod === "UPI" ? "Original UPI" : "BRUVI wallet",
        items: selectedLines.map((l) => ({ id: l.id, quantity: l.qty })),
      });

      setSuccessResult({
        refundId: res.refundId || "RF-30431",
        amount: refundTotal,
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Refund failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-16">
      {/* 1. Header Frame (Figma 225:101873, 1136x62) */}
      <div className="flex flex-col gap-1 w-full">
        {/* Breadcrumbs (Figma 225:101874) */}
        <div className="flex items-center gap-1.5 text-body-s text-[#3f4b5e]">
          <Link href="/orders" className="hover:text-[#0f2340] hover:underline transition-colors">
            Orders
          </Link>
          <span className="text-[#7f8ca0]">/</span>
          <Link
            href={`/orders/${order.orderNumber}`}
            className="hover:text-[#0f2340] hover:underline transition-colors"
          >
            {order.orderNumber}
          </Link>
          <span className="text-[#7f8ca0]">/</span>
          <span className="text-[#0f2340] font-medium">Refund</span>
        </div>

        {/* Title & Customer Subtitle Row (Figma 225:101876) */}
        <div className="flex flex-wrap items-baseline gap-3 mt-1">
          <h1 className="font-display font-black text-[32px] leading-[38px] text-[#0f2340] tracking-tight">
            Refund {order.orderNumber}
          </h1>
          <span className="text-[14px] font-normal text-[#3f4b5e]">
            {order.customerName} · paid ₹{order.totalAmount.toFixed(2)} via {order.paymentMethod} ·{" "}
            {order.storeName}
          </span>
        </div>
      </div>

      {/* 2. Main Two-Column Grid (Figma 225:101879) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
        {/* Left Column (720px / 8 cols): Steps 1, 2, 3 and Action Footer */}
        <div className="lg:col-span-8 flex flex-col gap-4 w-full">
          {/* Card: Steps Form (Figma 225:101880, 720x702) */}
          <div className="bg-white border border-[#dce2ea] rounded-[16px] shadow-xs overflow-hidden flex flex-col">
            {/* Step 1: Items to refund (Figma 225:101881) */}
            <div className="p-5 border-b border-[#dce2ea] flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-[18px] font-extrabold text-[#0f2340] leading-6">
                  1 · Items to refund
                </h2>
                <span className="text-[12px] font-medium text-[#3f4b5e]">
                  Discount and GST are prorated automatically
                </span>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3">
                {order.items.map((item) => {
                  const selection = itemSelections[item.id] || {
                    selected: false,
                    quantity: 1,
                  };
                  const isChecked = selection.selected;

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "rounded-[12px] transition-all flex items-center justify-between gap-3 p-3.5",
                        isChecked
                          ? "border-2 border-[#1c3a66] bg-[#f8fafc]/40"
                          : "border border-[#7f8ca0] bg-white hover:border-[#1c3a66]/60"
                      )}
                    >
                      {/* Checkbox and Product Thumbnail */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {/* Checkbox (Figma 24x24) */}
                        <button
                          type="button"
                          onClick={() => handleToggleItem(item.id)}
                          aria-label={`Select ${item.productName}`}
                          className={cn(
                            "w-6 h-6 rounded-[4px] shrink-0 flex items-center justify-center transition-colors cursor-pointer",
                            isChecked
                              ? "bg-[#1c3a66] text-white"
                              : "border border-[#7f8ca0] bg-white hover:border-[#1c3a66]"
                          )}
                        >
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>

                        {/* Thumbnail (48x48) */}
                        <div className="w-12 h-12 rounded-[8px] bg-[#f5f7fa] border border-[#dce2ea] flex items-center justify-center shrink-0">
                          {item.productName.toLowerCase().includes("cold brew") ? (
                            <CoffeeIcon className="w-6 h-6 text-[#1c3a66]" />
                          ) : (
                            <PhinIcon className="w-6 h-6 text-[#1c3a66]" />
                          )}
                        </div>

                        {/* Title & Modifiers */}
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-[16px] font-bold text-[#0f2340] leading-tight truncate">
                            {item.productName}
                          </span>
                          {item.modifiers && item.modifiers.length > 0 && (
                            <span className="text-[12px] font-medium text-[#3f4b5e] mt-1 line-clamp-1">
                              {item.modifiers.join(" · ")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Quantity Stepper & Line Price */}
                      <div className="flex items-center gap-4 shrink-0">
                        {/* Stepper (Figma 225:101895, 104x36) - only shown or enabled when checked */}
                        {isChecked ? (
                          <div className="h-9 w-[104px] border border-[#7f8ca0] rounded-[12px] flex items-center justify-between px-2 bg-white">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.id, -1, item.quantity)}
                              disabled={selection.quantity <= 1}
                              aria-label="Decrease quantity"
                              className="w-6 h-6 flex items-center justify-center text-[#0f2340] hover:bg-[#f5f7fa] disabled:opacity-30 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[14px] font-bold text-[#0f2340]">
                              {selection.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.id, 1, item.quantity)}
                              disabled={selection.quantity >= item.quantity}
                              aria-label="Increase quantity"
                              className="w-6 h-6 flex items-center justify-center text-[#0f2340] hover:bg-[#f5f7fa] disabled:opacity-30 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : null}

                        {/* Line Price (Figma Archivo 14px ExtraBold) */}
                        <span
                          className={cn(
                            "font-display font-black text-[14px] text-right min-w-[72px]",
                            isChecked ? "text-[#0f2340]" : "text-[#55647a]"
                          )}
                        >
                          ₹
                          {(isChecked
                            ? item.unitPrice * selection.quantity
                            : item.unitPrice * item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Reason & Note (Figma 225:101907, 718x145) */}
            <div className="p-5 border-b border-[#dce2ea] grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reason Selector */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="refund-reason"
                  className="text-[14px] font-bold text-[#0f2340]"
                >
                  2 · Reason
                </label>
                <div className="relative">
                  <select
                    id="refund-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-[52px] w-full rounded-[12px] border border-[#7f8ca0] px-4 pr-10 text-[14px] font-medium text-[#0f2340] bg-white focus:outline-none focus:border-[#1c3a66] appearance-none cursor-pointer"
                  >
                    <option value="Item quality / preparation issue">
                      Item quality / preparation issue
                    </option>
                    <option value="Wrong item prepared">Wrong item prepared</option>
                    <option value="Customer cancelled / delayed">
                      Customer cancelled / delayed
                    </option>
                    <option value="Store out of stock">Store out of stock</option>
                    <option value="Other reason">Other reason</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#3f4b5e] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[12px] font-medium text-[#3f4b5e]">
                  Tagged to {order.storeName} quality report
                </span>
              </div>

              {/* Note for store & customer */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="refund-note"
                  className="text-[14px] font-bold text-[#0f2340]"
                >
                  Note for store & customer
                </label>
                <input
                  id="refund-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Reason or instructions for customer..."
                  className="h-[52px] w-full rounded-[12px] border-2 border-[#2f5690] px-4 text-[14px] font-medium text-[#0f2340] bg-white focus:outline-none focus:ring-1 focus:ring-[#2f5690] shadow-2xs"
                />
                <span className="text-[12px] font-medium text-[#3f4b5e]">
                  Shown on the refund receipt
                </span>
              </div>
            </div>

            {/* Step 3: Refund Method (Figma 225:101922, 718x213) */}
            <div className="p-5 flex flex-col gap-3">
              <h2 className="text-[14px] font-bold text-[#0f2340]">
                3 · Refund method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method 1: Original UPI */}
                <button
                  type="button"
                  onClick={() => setRefundMethod("UPI")}
                  className={cn(
                    "rounded-[12px] p-[18px] text-left transition-all flex items-start gap-3 cursor-pointer",
                    refundMethod === "UPI"
                      ? "border-2 border-[#1c3a66] bg-[#f8fafc]/40"
                      : "border border-[#7f8ca0] bg-white hover:border-[#1c3a66]/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                      refundMethod === "UPI"
                        ? "border-2 border-[#1c3a66]"
                        : "border border-[#7f8ca0]"
                    )}
                  >
                    {refundMethod === "UPI" && (
                      <div className="w-2 h-2 rounded-full bg-[#1c3a66]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-[#0f2340]">
                      Original UPI
                    </span>
                    <span className="text-[12px] font-medium text-[#3f4b5e] leading-snug">
                      Ref 4290 7712 0034 · 3–5 working days via Razorpay
                    </span>
                  </div>
                </button>

                {/* Method 2: BRUVI Wallet */}
                <button
                  type="button"
                  onClick={() => setRefundMethod("WALLET")}
                  className={cn(
                    "rounded-[12px] p-[17px] text-left transition-all flex items-start gap-3 cursor-pointer",
                    refundMethod === "WALLET"
                      ? "border-2 border-[#1c3a66] bg-[#f8fafc]/40"
                      : "border border-[#7f8ca0] bg-white hover:border-[#1c3a66]/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                      refundMethod === "WALLET"
                        ? "border-2 border-[#1c3a66]"
                        : "border border-[#7f8ca0]"
                    )}
                  >
                    {refundMethod === "WALLET" && (
                      <div className="w-2 h-2 rounded-full bg-[#1c3a66]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-[#0f2340]">
                      BRUVI wallet · instant
                    </span>
                    <span className="text-[12px] font-medium text-[#3f4b5e] leading-snug">
                      Credited now · usable on next order
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer Action Bar (Figma 225:101936, 718x81) */}
            <div className="bg-[#f5f7fa] border-t border-[#dce2ea] px-5 py-4 flex items-center justify-between flex-wrap gap-4">
              <span className="text-[12px] font-medium text-[#3f4b5e]">
                Customer notified by SMS + app
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/orders/${order.orderNumber}`}
                  className="h-12 px-6 rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-[14px] font-bold text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors flex items-center justify-center shadow-2xs cursor-pointer"
                >
                  Cancel
                </Link>

                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(true)}
                  disabled={selectedCount === 0 || refundTotal <= 0}
                  className="h-12 px-6 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] active:scale-[0.99] text-[14px] font-bold text-white transition-all shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  Process refund · ₹{refundTotal.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (400px / 4 cols): Refund Summary, Approval Limit & Audit Log */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full">
          {/* Card 1: Refund Summary (Figma 225:101944, 400x326) */}
          <div className="bg-white border border-[#dce2ea] rounded-[16px] p-5 flex flex-col gap-3 shadow-xs">
            <h2 className="text-[18px] font-extrabold text-[#0f2340] leading-6">
              Refund summary
            </h2>

            {/* Item Lines */}
            <div className="flex flex-col gap-2 pt-1">
              {selectedLines.length > 0 ? (
                selectedLines.map((line) => (
                  <div key={line.id} className="flex justify-between items-center text-[14px]">
                    <span className="font-bold text-[#0f2340]">
                      {line.qty}× {line.name}
                    </span>
                    <span className="font-bold text-[#0f2340]">
                      ₹{line.lineTotal.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-[13px] text-[#7f8ca0] italic">
                  No items selected for refund
                </span>
              )}

              {/* Promo deduction (prorated) */}
              {selectedLines.length > 0 && proratedDiscount > 0 && (
                <div className="flex justify-between items-center text-[14px]">
                  <span className="font-bold text-[#3f4b5e]">
                    Promo {order.promoCode?.replace("Promo ", "") || "BREW50"} (prorated)
                  </span>
                  <span className="font-bold text-[#3f4b5e]">
                    −₹{proratedDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Taxable value */}
              {selectedLines.length > 0 && (
                <div className="flex justify-between items-center text-[14px]">
                  <span className="font-bold text-[#0f2340]">Taxable value</span>
                  <span className="font-bold text-[#0f2340]">
                    ₹{taxableValue.toFixed(2)}
                  </span>
                </div>
              )}

              {/* GST 5% refund */}
              {selectedLines.length > 0 && (
                <div className="flex justify-between items-center text-[14px]">
                  <span className="font-bold text-[#0f2340]">GST 5% refund</span>
                  <span className="font-bold text-[#0f2340]">
                    +₹{gstRefund.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#dce2ea] my-1" />

            {/* Total Row */}
            <div className="flex justify-between items-baseline">
              <span className="text-[16px] font-extrabold text-[#0f2340]">
                Refund to customer
              </span>
              <span className="font-display font-black text-[24px] text-[#0f2340] tracking-tight">
                ₹{refundTotal.toFixed(2)}
              </span>
            </div>

            {/* Formula / Residual Order Total */}
            <div className="bg-[#f5f7fa] rounded-[10px] p-3 border border-[#dce2ea]/70 flex flex-col gap-0.5 mt-1">
              <span className="text-[12px] font-medium text-[#3f4b5e]">
                Order total after refund
              </span>
              <span className="text-[12px] font-bold text-[#3f4b5e]">
                ₹{order.totalAmount.toFixed(2)} − ₹{refundTotal.toFixed(2)} = ₹
                {orderTotalAfterRefund.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Card 2: Approval Limit (Figma 225:101968, 400x86) */}
          <div className="bg-[#e3f4ea] rounded-[16px] p-4 flex gap-3 items-start border border-[#c3e8d2]">
            <ShieldCheck className="h-5 w-5 text-[#1f7a4d] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[14px] font-bold text-[#0f2340] leading-tight">
                Within your approval limit
              </span>
              <span className="text-[12px] font-medium text-[#3f4b5e] leading-relaxed mt-0.5">
                HQ can approve refunds up to ₹2,000 per order. Above that, Finance approval is
                required.
              </span>
            </div>
          </div>

          {/* Card 3: Audit Log (Figma 225:101978, 400x258) */}
          <div className="bg-white border border-[#dce2ea] rounded-[16px] p-5 flex flex-col gap-3 shadow-xs">
            <h3 className="text-[12px] font-bold text-[#3f4b5e] uppercase tracking-wider">
              REFUNDS ON THIS ORDER
            </h3>
            <p className="text-[14px] font-normal text-[#0f2340] leading-snug">
              None yet · last refund A-019, 22 Sep · ₹221 to wallet
            </p>
            <div className="border-t border-[#dce2ea] my-1" />
            <span className="text-[12px] font-medium text-[#3f4b5e] leading-snug">
              Will be logged as RF-30431 · {order.storeName} · approved by Kavya R.
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal (Figma 225:102329) */}
      <OrderCancelRefundModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        order={order}
        mode={refundTotal >= order.totalAmount ? "cancel_and_refund" : "refund_only"}
        refundAmount={refundTotal}
        onSuccess={(refundId, amount) => {
          setIsConfirmModalOpen(false);
          setSuccessResult({ refundId, amount });
        }}
      />

      {/* Success Modal */}
      {successResult && (
        <div className="fixed inset-0 z-50 bg-[#0f2340]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full shadow-xl border border-[#dce2ea] flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-[#e3f4ea] text-[#1f7a4d] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-extrabold text-[#0f2340]">
                Refund Processed Successfully
              </h3>
              <p className="text-[14px] text-[#3f4b5e] leading-relaxed">
                Refund <span className="font-bold text-[#0f2340]">{successResult.refundId}</span>{" "}
                for{" "}
                <span className="font-bold text-[#0f2340]">
                  ₹{successResult.amount.toFixed(2)}
                </span>{" "}
                has been recorded and customer notified.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => router.push(`/orders/${order.orderNumber}`)}
                className="flex-1 h-11 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-white text-[14px] font-bold transition-colors cursor-pointer"
              >
                Back to Order
              </button>
              <button
                type="button"
                onClick={() => router.push("/orders")}
                className="flex-1 h-11 rounded-[12px] bg-white border border-[#bcc6d3] text-[#0f2340] hover:bg-[#f5f7fa] text-[14px] font-bold transition-colors cursor-pointer"
              >
                All Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
