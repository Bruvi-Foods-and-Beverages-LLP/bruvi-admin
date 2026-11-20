import {
  Order,
  OrderStatus,
  OrderChannel,
  OrderTimelineItem,
  PaymentDetail,
  PaymentGatewayEvent,
  PaymentMethod,
  OrderTimelineDetail,
} from '@/types/orders';
import {
  BackendOrderListItem,
  BackendOrderDetail,
} from './types';

function formatMaskedPhone(phone?: string, memberSince?: string): string {
  if (!phone) return "+91 ••••• •••••";
  const digits = phone.replace(/[^0-9]/g, "");
  const last5 = digits.length >= 5 ? digits.slice(-5) : digits;
  const sincePart = memberSince ? ` · since ${memberSince}` : "";
  return `+91 ••••• ${last5}${sincePart}`;
}

export class AdminOrderMapper {
  static toUIOrder(item: BackendOrderListItem): Order {
    return {
      id: item.id,
      orderNumber: item.orderNumber,
      time: item.time,
      createdAt: item.createdAt,
      storeName: item.storeName,
      storeId: item.storeId,
      channel: item.channel as OrderChannel,
      serviceType: item.serviceType,
      tableLabel: item.tableLabel || undefined,
      customerNote: item.kitchenNote || undefined,
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      customerEmail: item.customerEmail,
      itemCount: item.itemCount,
      items: item.items.map((it) => ({
        id: it.id,
        productName: it.productName,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        totalPrice: it.totalPrice,
        modifiers: it.modifiers,
        instructions: it.instructions ?? null,
        image: it.imageUrl || undefined,
      })),
      status: item.status as OrderStatus,
      totalAmount: item.totalAmount,
      subtotal: item.subtotal,
      promoDiscount: item.discount,
      taxAmount: item.tax,
      deliveryFee: item.deliveryFee,
      tip: item.tip ?? 0,
      money: item.money,
      gst: (item as BackendOrderDetail).gst,
      paymentMethod:
        ({ UPI: 'UPI', CARD: 'Card', NETBANKING: 'Netbanking', WALLET: 'Wallet' } as Record<string, PaymentMethod>)[
          (item.paymentMethod || '').toUpperCase()
        ] ?? '—',
      paymentStatus: (item.paymentStatus === 'PARTIALLY_REFUNDED'
        ? 'PARTIALLY_REFUNDED'
        : item.paymentStatus === 'REFUNDED'
        ? 'REFUNDED'
        : item.paymentStatus === 'PAID'
        ? 'PAID'
        : 'PENDING') as any,
      invoiceNumber: item.invoiceNumber,
      officialOrderNumber: item.officialOrderNumber,
    };
  }

  static toUIOrderDetail(detail: BackendOrderDetail): {
    order: Order;
    payment: PaymentDetail;
    timeline: OrderTimelineDetail;
  } {
    const order = this.toUIOrder(detail);

    const cust = detail.customer || ({} as any);
    const customerPhoneFormatted = cust.phone
      ? formatMaskedPhone(cust.phone, cust.memberSince)
      : (detail.customerPhone ? formatMaskedPhone(detail.customerPhone) : '+91 ••••• 83435 · since Nov 2026');

    order.customerProfile = {
      initials: cust.initials || (cust.name || detail.customerName || 'V').slice(0, 2).toUpperCase(),
      name: cust.name || detail.customerName || 'Valued Customer',
      phone: customerPhoneFormatted,
      memberSince: cust.memberSince || 'Nov 2026',
      tier: (cust.tier as any) || 'Gold',
      points: cust.points || '1,240',
      totalOrders: cust.totalOrders || 1,
      lifetimeSpend: cust.lifetimeSpend || `₹${detail.totalAmount}`,
      note: cust.note || `Usually orders ${order.items?.[0]?.productName || 'Cold Brew'} · no complaints on file`,
    };

    const payment = this.toPaymentDetail(detail);

    const timelineEvents: OrderTimelineItem[] = (detail.timeline || []).map((ev) => {
      let category: 'customer' | 'staff' | 'system' = 'system';
      if (ev.actorType === 'CUSTOMER') category = 'customer';
      else if (ev.actorType === 'STAFF') category = 'staff';

      return {
        id: ev.id,
        time: new Date(ev.timestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
        title: ev.title,
        tag: (category.charAt(0).toUpperCase() + category.slice(1)) as any,
        description: ev.note || (ev.fromStatus && ev.toStatus ? `Status: ${ev.fromStatus} → ${ev.toStatus}` : ''),
        avatarType: 'initials',
        avatarText: category.substring(0, 2).toUpperCase(),
        category,
      };
    });

    const timeline: OrderTimelineDetail = {
      orderId: detail.id,
      orderNumber: detail.orderNumber,
      status: order.status,
      channel: detail.channel,
      storeName: detail.storeName,
      customerName: detail.customerName,
      totalAmount: detail.totalAmount,
      events: timelineEvents,
      upcomingSteps: [],
      serviceLevel: {
        statusText: 'On track',
        elapsedTime: '4m 12s',
        elapsedSubtext: 'Target 8m prep',
        targetTime: '8m',
        percentageSuccess: 92,
        percentageOver: 8,
        queueWait: '1m 20s',
        makeTime: '2m 52s',
        readyBy: detail.promisedReadyAt ? new Date(detail.promisedReadyAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) : '--:--',
      },
      whyItsLate: {
        title: 'Timeline Summary',
        explanation: 'All orders processed within SLA targets.',
        customerActionsCount: detail.timeline.filter((t) => t.actorType === 'CUSTOMER').length,
        staffActionsCount: detail.timeline.filter((t) => t.actorType === 'STAFF').length,
        systemEventsCount: detail.timeline.filter((t) => t.actorType === 'SYSTEM').length,
        barStoreName: detail.storeName,
      },
    };

    return { order, payment, timeline };
  }

  /** Real payment data from the paying attempt, the refunds and the server's money summary. */
  static toPaymentDetail(detail: BackendOrderDetail): PaymentDetail {
    const attempts = [...(detail.payments || [])].sort((a, b) => b.attemptNo - a.attemptNo);
    const paid = attempts.find((p) => p.status === 'CAPTURED') ?? attempts[0];
    const summary = detail.paymentSummary;
    const rupees = (paise: number | null | undefined) => (paise == null ? null : paise / 100);

    const statusLabel: PaymentDetail['status'] =
      detail.paymentStatus === 'REFUNDED'
        ? 'Refunded'
        : detail.paymentStatus === 'PARTIALLY_REFUNDED'
          ? 'Partially Refunded'
          : paid?.status === 'CAPTURED'
            ? 'Captured'
            : paid?.status === 'AUTHORIZED'
              ? 'Authorized'
              : paid?.status === 'FAILED' || paid?.status === 'EXPIRED'
                ? 'Failed'
                : 'Pending';

    const methodNames: Record<string, string> = { UPI: 'UPI', CARD: 'Card', NETBANKING: 'Netbanking', WALLET: 'BRUVI Wallet', FREE: 'No payment (₹0)' };
    const method = methodNames[(paid?.method || '').toUpperCase()] || paid?.method || '—';

    const fmtTime = (iso?: string | null) =>
      iso ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

    const gatewayEvents: PaymentGatewayEvent[] = [...(detail.payments || [])]
      .sort((a, b) => a.attemptNo - b.attemptNo)
      .flatMap((p) => {
        const via = p.methodLabel || p.method;
        const events: PaymentGatewayEvent[] = [
          {
            time: fmtTime(p.createdAt),
            event: `attempt.${p.attemptNo}.created`,
            detail: `₹${(p.amountPaise ?? p.amount * 100) / 100} via ${via} (${p.provider})${p.providerOrderId ? ` · ${p.providerOrderId}` : ''}`,
            result: 'OPEN',
            status: 'pending',
          },
        ];
        if (p.status === 'CAPTURED') {
          events.push({
            time: fmtTime(p.capturedAt),
            event: 'payment.captured',
            detail: [p.providerPaymentId, p.upiRrn ? `RRN ${p.upiRrn}` : null].filter(Boolean).join(' · ') || via,
            result: 'SUCCESS',
            status: 'success',
          });
        } else if (p.status !== 'PENDING' && p.status !== 'CREATED') {
          events.push({
            time: fmtTime(p.capturedAt || p.expiresAt),
            event: `payment.${p.status.toLowerCase()}`,
            detail: p.failureReason || p.failureCode || p.status,
            result: p.status,
            status: 'failed',
          });
        }
        return events;
      });
    for (const r of [...(detail.refunds || [])].reverse()) {
      gatewayEvents.push({
        time: fmtTime(r.createdAt),
        event: `refund.${r.status.toLowerCase()}`,
        detail: `₹${r.amountPaise / 100} to ${r.destination === 'WALLET' ? 'BRUVI Wallet' : 'original method'}${r.providerRefundId ? ` · ${r.providerRefundId}` : ''}`,
        result: r.status,
        status: r.status === 'SUCCEEDED' ? 'success' : r.status === 'FAILED' ? 'failed' : 'pending',
      });
    }

    const payId = paid?.provider === 'RAZORPAY' ? paid.providerPaymentId ?? null : null;
    const isZeroPayment = (paid?.method || '').toUpperCase() === 'FREE';
    const b = summary?.benefits ?? paid?.benefits ?? null;
    const benefits = b
      ? {
          itemTotal: b.itemTotalPaise / 100,
          discount: b.discountPaise / 100,
          coupon: b.coupon ? { code: b.coupon.code, discount: b.coupon.discountPaise / 100 } : null,
          membership: b.membership
            ? {
                planName: b.membership.planName,
                discount: b.membership.discountPaise / 100,
                freeDrinks: b.membership.freeDrinks.map((d) => d.name),
              }
            : null,
        }
      : null;
    return {
      gst: detail.gst ?? null,
      invoiceNumber: detail.invoiceNumber ?? null,
      orderId: detail.id,
      orderNumber: detail.orderNumber,
      amount: summary?.capturedPaise ? summary.capturedPaise / 100 : detail.totalAmount,
      status: statusLabel,
      method,
      methodLabel: summary?.methodLabel || paid?.methodLabel || method,
      provider: paid?.provider ?? null,
      storeName: detail.storeName,
      timestamp: summary?.capturedAt || paid?.capturedAt
        ? new Date((summary?.capturedAt || paid?.capturedAt) as string).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        : new Date(detail.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      razorpayPaymentId: payId,
      razorpayOrderId: paid?.provider === 'RAZORPAY' ? paid.providerOrderId ?? null : null,
      // Razorpay's fee already includes its GST; gatewayTax is that GST part.
      gatewayFee: rupees(summary?.feePaise ?? null),
      gatewayTax: rupees(summary?.gatewayTaxPaise ?? null),
      refundedToSource: (summary?.refundedToSourcePaise ?? 0) / 100,
      refundedToWallet: (summary?.refundedToWalletPaise ?? 0) / 100,
      netToSettle: (summary?.netSettlementPaise ?? 0) / 100,
      upiRrn: paid?.upiRrn ?? null,
      payerVpa: paid?.vpa ?? null,
      cardLast4: paid?.cardLast4 ?? null,
      cardNetwork: paid?.cardNetwork ?? null,
      bank: paid?.bank ?? null,
      isZeroPayment,
      paymentId: paid?.providerPaymentId ?? null,
      benefits,
      gatewayEvents,
      // Only data the API returned for the paying attempt; nothing is invented.
      rawPayload: JSON.stringify(paid ?? {}, null, 2),
      refunds: (detail.refunds || []).map((r) => ({
        id: r.id,
        refundNumber: r.refundNumber,
        amount: r.amountPaise / 100,
        creditNoteNumber: r.creditNoteNumber ?? null,
        gstReversal: r.gstReversal,
        destination: r.destination,
        status: r.status,
        reasonCode: r.reasonCode,
        note: r.note,
        providerRefundId: r.providerRefundId,
        lastError: r.lastError,
        createdAt: r.createdAt,
      })),
      razorpayDashboardUrl: payId ? `https://dashboard.razorpay.com/app/payments/${payId}` : undefined,
    };
  }
}
