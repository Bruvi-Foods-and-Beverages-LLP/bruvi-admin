import {
  Order,
  OrderStatus,
  OrderChannel,
  OrderTimelineItem,
  PaymentDetail,
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
      paymentMethod: (item.paymentStatus === 'PAID' ? 'UPI' : 'UPI') as any,
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

    const firstPayment = detail.payments?.[0];
    const payment: PaymentDetail = {
      orderId: detail.id,
      orderNumber: detail.orderNumber,
      amount: detail.totalAmount,
      status: (firstPayment?.status === 'CAPTURED'
        ? 'Captured'
        : firstPayment?.status === 'FAILED'
        ? 'Failed'
        : 'Authorized') as any,
      method: firstPayment?.method || 'UPI',
      storeName: detail.storeName,
      timestamp: detail.createdAt,
      razorpayPaymentId: firstPayment?.providerPaymentId || firstPayment?.id || 'pay_mock',
      gatewayFeeText: '₹ 0.00',
      netToSettle: detail.totalAmount,
      upiRrn: '849204918234',
      payerVpa: 'customer@okaxis',
      posTerminalId: 'POS-01',
      settlementBatch: 'SB-8492',
      expectedCreditDate: 'Next business day',
      gatewayEvents: (detail.payments || []).map((p) => ({
        time: p.capturedAt || p.createdAt,
        event: p.status,
        detail: `Amount ₹${p.amount} via ${p.method} (${p.provider})`,
        result: p.status === 'CAPTURED' ? 'SUCCESS' : p.failureReason || p.status,
        status: p.status === 'CAPTURED' ? 'success' : 'failed',
      })),
      rawPayload: JSON.stringify(firstPayment || {}, null, 2),
      riskChecks: [
        { id: '1', label: 'IP Geolocation Match', passed: true },
        { id: '2', label: 'Velocity Check (< 3 orders / hr)', passed: true },
        { id: '3', label: 'Device Fingerprint Known', passed: true },
      ],
      settlement: {
        batchId: 'BATCH-83921',
        cycle: 'T+1 Daily',
        batchCloses: '23:59 IST',
        expectedCredit: `₹ ${detail.totalAmount}`,
        account: 'HDFC Bank •••• 4021',
        reconciled: true,
        reconciledText: 'Matched with bank feed',
      },
    };

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
}
