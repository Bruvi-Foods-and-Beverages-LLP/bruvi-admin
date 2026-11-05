"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setIsDrawerOpen, setSelectedOrder } from "@/store/slices/orders-slice";
import { OrderStatusBadge } from "./order-status-badge";
import {
  X,
  Phone,
  Mail,
  Receipt,
  RotateCcw,
  Ban,
  Clock,
  Store,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function OrderDetailDrawer() {
  const dispatch = useAppDispatch();
  const { selectedOrder, isDrawerOpen } = useAppSelector((state) => state.orders);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        dispatch(setIsDrawerOpen(false));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, isDrawerOpen]);

  if (!isDrawerOpen || !selectedOrder) {
    return null;
  }

  const order = selectedOrder;

  const handleClose = () => {
    dispatch(setIsDrawerOpen(false));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Drawer Panel (Figma A061 Order Detail Spec) */}
      <div className="relative w-full max-w-[680px] bg-[#f5f7fa] h-full shadow-overlay flex flex-col z-10 overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* 1. Header Bar */}
        <div className="sticky top-0 z-20 px-6 py-5 bg-white border-b border-[#dce2ea] flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-caption text-text-secondary">
              Orders / <strong className="text-[#0f2340]">{order.orderNumber}</strong>
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-[#7f8ca0] hover:text-[#0f2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 mt-1">
            <div className="flex items-center gap-3">
              <h2 className="text-display-s font-display font-black text-[#0f2340]">
                {order.orderNumber}
              </h2>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Quick Actions (Figma 225:101522) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert(`Resent digital receipt for ${order.orderNumber} to customer.`)}
                className="h-8 px-3 rounded-[12px] bg-white border border-[#bcc6d3] text-body-s font-semibold text-[#0f2340] hover:bg-[#f5f7fa] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Receipt className="h-3.5 w-3.5 text-[#55647a]" />
                <span>Resend</span>
              </button>
              {order.status !== "Cancelled" && (
                <button
                  type="button"
                  onClick={() => alert(`Cancel request logged for order ${order.orderNumber}`)}
                  className="h-8 px-3 rounded-[12px] bg-[#fce8e6] text-body-s font-semibold text-[#c0352b] hover:bg-[#fbd0cc] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-body-s text-text-secondary">
            {order.channel} · {order.storeName} · {order.customerName} · placed {order.time}
          </p>
        </div>

        {/* 2. Content Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Status Alert Banner if delayed */}
          {order.isDelayed && (
            <div className="rounded-[12px] bg-[#fce8e6] border border-[#c0352b]/30 p-3.5 flex items-start gap-3 text-[#c0352b]">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-body-s font-bold">Preparation Delayed</span>
                <span className="text-caption">
                  {order.notes || "Order preparation has exceeded standard 5-minute barista SLA."}
                </span>
              </div>
            </div>
          )}

          {/* Items Card (Figma 225:101533) */}
          <div className="rounded-[16px] border border-[#dce2ea] bg-white p-5 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#dce2ea] pb-3">
              <div>
                <h3 className="text-title text-[#0f2340]">Items · {order.itemCount}</h3>
                <span className="text-caption text-text-secondary">
                  Ticket on {order.kdsStation || "Bar 1 KDS"} · pickup at counter
                </span>
              </div>
              <span className="text-caption-bold text-[#1f7a4d] bg-[#e3f4ea] px-2.5 py-1 rounded-full">
                POS Verified
              </span>
            </div>

            {/* Items List */}
            <div className="flex flex-col divide-y divide-[#dce2ea]">
              {order.items.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between">
                    <span className="text-body-s font-bold text-[#0f2340]">
                      {item.quantity}× {item.productName}
                    </span>
                    <div className="text-right">
                      <span className="text-price-xs font-display font-extrabold text-[#0f2340]">
                        ₹{item.totalPrice}
                      </span>
                      {item.quantity > 1 && (
                        <div className="text-caption text-text-muted">
                          ₹{item.unitPrice} each
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modifiers List */}
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.modifiers.map((mod, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-[8px] bg-[#f5f7fa] px-2 py-0.5 text-caption font-medium text-[#3f4b5e] border border-[#dce2ea]"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="border-t border-[#dce2ea] pt-3.5 flex flex-col gap-2">
              <div className="flex justify-between text-body-s text-text-secondary">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-body-s text-text-secondary">
                <span>Taxes & GST (5%)</span>
                <span>₹{order.taxAmount}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#dce2ea]">
                <span className="text-title font-bold text-[#0f2340]">Total Paid</span>
                <span className="text-price-m font-display font-extrabold text-[#0f2340]">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Tender Info Card */}
          <div className="rounded-[16px] border border-[#dce2ea] bg-white p-5 shadow-2xs flex flex-col gap-3">
            <h3 className="text-title text-[#0f2340]">Payment & Tender</h3>
            <div className="grid grid-cols-2 gap-3 text-body-s">
              <div>
                <span className="text-caption text-text-muted block">Payment Method</span>
                <span className="font-semibold text-[#0f2340] flex items-center gap-1.5 mt-0.5">
                  <CreditCard className="h-4 w-4 text-[#55647a]" />
                  {order.paymentMethod}
                </span>
              </div>
              <div>
                <span className="text-caption text-text-muted block">Transaction Status</span>
                <span className="font-semibold text-[#1f7a4d] flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentReference && (
                <div className="col-span-2">
                  <span className="text-caption text-text-muted block">Gateway Reference ID</span>
                  <span className="font-mono text-caption text-[#0f2340] bg-[#f5f7fa] px-2 py-1 rounded mt-0.5 inline-block">
                    {order.paymentReference}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer & Location Card */}
          <div className="rounded-[16px] border border-[#dce2ea] bg-white p-5 shadow-2xs flex flex-col gap-3">
            <h3 className="text-title text-[#0f2340]">Customer Details</h3>
            <div className="flex flex-col gap-2 text-body-s">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0f2340]">{order.customerName}</span>
                <span className="text-caption text-[#55647a] bg-[#f5f7fa] px-2 py-0.5 rounded-full border border-[#dce2ea]">
                  {order.channel}
                </span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Phone className="h-4 w-4 text-[#7f8ca0]" />
                  <span>{order.customerPhone}</span>
                </div>
              )}
              {order.customerEmail && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail className="h-4 w-4 text-[#7f8ca0]" />
                  <span>{order.customerEmail}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-text-secondary pt-1">
                <Store className="h-4 w-4 text-[#7f8ca0]" />
                <span>Store Outlet: {order.storeName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

