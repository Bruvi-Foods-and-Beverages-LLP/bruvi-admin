import { NextRequest, NextResponse } from "next/server";
import { MOCK_ORDERS } from "../../route";
import { Order, PaymentDetail } from "@/types/orders";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase();

  const order = MOCK_ORDERS.find(
    (o: Order) =>
      o.id.toLowerCase() === decodedId ||
      o.orderNumber.toLowerCase() === decodedId
  );

  if (!order) {
    return NextResponse.json(
      { error: `Order "${id}" not found` },
      { status: 404 }
    );
  }

  // Pre-configured payment details for C-218 (matching Figma 225:102573 exactly)
  if (order.orderNumber === "C-218") {
    const paymentDetail: PaymentDetail = {
      orderId: order.id,
      orderNumber: "C-218",
      amount: 725.0,
      status: "Captured",
      method: "UPI via Razorpay",
      storeName: "Indiranagar counter",
      timestamp: "Fri 2 Oct, 9:38 am",
      razorpayPaymentId: "pay_P8sK2LmQx41",
      gatewayFeeText: "₹0.00 · UPI zero MDR",
      netToSettle: 725.0,
      upiRrn: "4291 0083 7716",
      payerVpa: "an••••@okhdfc",
      posTerminalId: "POS-IND-01",
      settlementBatch: "SET-02OCT-IND",
      expectedCreditDate: "T+1 · Sat 3 Oct",
      gatewayEvents: [
        {
          time: "9:38:03",
          event: "payment.created",
          detail: "order_P8sK1x · amount 72500 paise · UPI collect",
          result: "OK",
          status: "success",
        },
        {
          time: "9:38:11",
          event: "payment.authorized",
          detail: "Approved by payer app · RRN 4291 0083 7716",
          result: "OK",
          status: "success",
        },
        {
          time: "9:38:12",
          event: "payment.captured",
          detail: "Auto-capture · ₹725.00 · fee ₹0.00 · tax ₹0.00",
          result: "OK",
          status: "success",
        },
        {
          time: "9:38:12",
          event: "webhook.delivered",
          detail: "POST /webhooks/razorpay · 182 ms · attempt 1",
          result: "200",
          status: "success",
        },
      ],
      rawPayload:
        "id: pay_P8sK2LmQx41     status: captured     method: upi\namount: 72500     currency: INR     fee: 0     tax: 0\nvpa: an••••@okhdfc     acquirer_data.rrn: 429100837716\nnotes.order: C-218     notes.store: BLR-IND     notes.terminal: POS-IND-01",
      riskChecks: [
        { id: "amount_match", label: "Amount matches order C-218", passed: true },
        { id: "vpa_verified", label: "VPA verified by NPCI", passed: true },
        { id: "no_duplicate", label: "No duplicate payment in last 30 min", passed: true },
        { id: "terminal_valid", label: "Terminal POS-IND-01 registered to store", passed: true },
      ],
      settlement: {
        batchId: "SET-02OCT-IND",
        cycle: "T+1",
        batchCloses: "Fri 2 Oct, 11:59 pm",
        expectedCredit: "Sat 3 Oct",
        account: "BRUVI Cafés · HDFC ••4410",
        reconciled: true,
        reconciledText: "Reconciled with POS · no mismatch",
      },
      razorpayDashboardUrl: "https://dashboard.razorpay.com/#/app/payments/pay_P8sK2LmQx41",
    };

    return NextResponse.json(paymentDetail);
  }

  // Dynamic generator for all other orders (A-047, Q-31, etc.)
  const amount = order.totalAmount;
  const payId = order.paymentReference?.match(/pay_[A-Za-z0-9]+/)?.[0] || `pay_${order.id.slice(0, 10)}`;
  const rrn = order.paymentReference?.match(/\d{4}\s\d{4}\s\d{4}/)?.[0] || "4290 7712 0034";
  const storeLocation = `${order.storeName} ${order.channel.toLowerCase()}`;

  const paymentDetail: PaymentDetail = {
    orderId: order.id,
    orderNumber: order.orderNumber,
    amount,
    status: order.paymentStatus === "PAID" ? "Captured" : order.paymentStatus === "REFUNDED" ? "Refunded" : "Captured",
    method: `${order.paymentMethod} via Razorpay`,
    storeName: storeLocation,
    timestamp: `Fri 2 Oct, ${order.time} am`,
    razorpayPaymentId: payId,
    gatewayFeeText: order.paymentMethod === "UPI" ? "₹0.00 · UPI zero MDR" : "1.8% + GST · Card interchange",
    netToSettle: amount,
    upiRrn: rrn,
    payerVpa: "customer@upi",
    posTerminalId: `POS-${order.storeName.slice(0, 3).toUpperCase()}-01`,
    settlementBatch: `SET-02OCT-${order.storeName.slice(0, 3).toUpperCase()}`,
    expectedCreditDate: "T+1 · Sat 3 Oct",
    gatewayEvents: [
      {
        time: `${order.time}:02`,
        event: "payment.created",
        detail: `order_${order.orderNumber} · amount ${(amount * 100).toFixed(0)} paise · ${order.paymentMethod}`,
        result: "OK",
        status: "success",
      },
      {
        time: `${order.time}:10`,
        event: "payment.authorized",
        detail: `Approved by payer app · RRN ${rrn}`,
        result: "OK",
        status: "success",
      },
      {
        time: `${order.time}:12`,
        event: "payment.captured",
        detail: `Auto-capture · ₹${amount.toFixed(2)} · fee ₹0.00 · tax ₹0.00`,
        result: "OK",
        status: "success",
      },
      {
        time: `${order.time}:12`,
        event: "webhook.delivered",
        detail: "POST /webhooks/razorpay · 174 ms · attempt 1",
        result: "200",
        status: "success",
      },
    ],
    rawPayload: `id: ${payId}     status: captured     method: ${order.paymentMethod.toLowerCase()}\namount: ${(amount * 100).toFixed(0)}     currency: INR     fee: 0     tax: 0\nvpa: customer@upi     acquirer_data.rrn: ${rrn.replace(/\s/g, "")}\nnotes.order: ${order.orderNumber}     notes.store: ${order.storeName}     notes.terminal: POS-${order.storeName.slice(0, 3).toUpperCase()}-01`,
    riskChecks: [
      { id: "amount_match", label: `Amount matches order ${order.orderNumber}`, passed: true },
      { id: "vpa_verified", label: "VPA verified by NPCI", passed: true },
      { id: "no_duplicate", label: "No duplicate payment in last 30 min", passed: true },
      { id: "terminal_valid", label: `Terminal registered to ${order.storeName}`, passed: true },
    ],
    settlement: {
      batchId: `SET-02OCT-${order.storeName.slice(0, 3).toUpperCase()}`,
      cycle: "T+1",
      batchCloses: "Fri 2 Oct, 11:59 pm",
      expectedCredit: "Sat 3 Oct",
      account: "BRUVI Cafés · HDFC ••4410",
      reconciled: true,
      reconciledText: "Reconciled with POS · no mismatch",
    },
    razorpayDashboardUrl: `https://dashboard.razorpay.com/#/app/payments/${payId}`,
  };

  return NextResponse.json(paymentDetail);
}

