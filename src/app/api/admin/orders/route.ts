import { NextRequest, NextResponse } from "next/server";
import { Order, OrdersListResponse } from "@/types/orders";

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord_a047",
    orderNumber: "A-047",
    time: "9:31",
    createdAt: "2026-10-02T09:31:00+05:30",
    storeName: "Indiranagar",
    storeId: "store_blr_indiranagar",
    channel: "App",
    customerName: "Saisubbireddy",
    customerPhone: "+91 ••••• 83435",
    customerEmail: "saisubbi@bruvi.coffee",
    itemCount: 3,
    items: [
      {
        id: "item_a047_1",
        productName: "Salted Cream Cold Brew",
        quantity: 2,
        unitPrice: 390,
        totalPrice: 780,
        modifiers: [
          "Large +₹40",
          "Iced",
          "Light ice",
          "2 shots +₹60",
          "Oat milk +₹50",
          "Less sweet",
        ],
      },
      {
        id: "item_a047_2",
        productName: "Cà Phê Sữa Đá",
        quantity: 1,
        unitPrice: 190,
        totalPrice: 190,
        modifiers: ["Regular", "Iced"],
      },
    ],
    subtotal: 970,
    promoCode: "Promo BREW50",
    promoDiscount: 50,
    taxAmount: 46,
    taxBreakdown: "GST 5% on ₹920 (CGST 2.5% + SGST 2.5%)",
    totalAmount: 966,
    paymentMethod: "UPI",
    paymentGatewayText: "UPI · Razorpay · Captured 9:31:07",
    paymentReference: "UPI ref 4290 7712 0034 · pay_P8sJ4vNc19 · settles Sat 3 Oct",
    paymentStatus: "PAID",
    status: "Preparing",
    makeTime: "—",
    kdsStation: "Bar 1 KDS (Hot & Cold)",
    baristaName: "Arjun S. · Shift Lead",
    priorityTier: "Standard app prep",
    customerNote: "“Please write Saisubbireddy on the cups”",
    customerProfile: {
      initials: "S",
      name: "Saisubbireddy",
      phone: "+91 ••••• 83435 · since Mar 2025",
      memberSince: "Mar 2025",
      tier: "Gold",
      points: "1,240",
      totalOrders: 38,
      lifetimeSpend: "₹14,860",
      note: "Usually orders Salted Cream Large with oat milk · no complaints on file",
    },
    timeline: [
      { time: "9:31", event: "Placed in app · iPhone, v3.2", dotColor: "#55647a" },
      { time: "9:31", event: "Payment authorized · UPI", dotColor: "#55647a" },
      { time: "9:31", event: "Auto-accepted · ticket to Bar 1 KDS", dotColor: "#55647a" },
      { time: "9:37", event: "Started by Arjun S.", dotColor: "#55647a" },
      { time: "9:37", event: "Customer notified “Preparing”", dotColor: "#55647a" },
      { time: "Now", event: "Preparing · ready by 9:45", isCurrent: true, dotColor: "#22629e" },
    ],
    sla: {
      elapsedText: "10 min since placed · target 8 min",
      busyModeText: "Busy mode +10",
      percentage: 80,
    },
  },
  {
    id: "ord_c218",
    orderNumber: "C-218",
    time: "9:38",
    createdAt: "2026-10-02T09:38:00+05:30",
    storeName: "Indiranagar",
    storeId: "store_blr_indiranagar",
    channel: "Counter",
    customerName: "Saisubbireddy",
    customerPhone: "+91 ••••• 83435",
    itemCount: 3,
    items: [
      {
        id: "item_c218_1",
        productName: "Cà Phê Muối",
        quantity: 2,
        unitPrice: 260,
        totalPrice: 520,
        modifiers: ["Regular", "Iced", "Standard sweet"],
      },
      {
        id: "item_c218_2",
        productName: "Butter Croissant",
        quantity: 1,
        unitPrice: 205,
        totalPrice: 205,
        modifiers: ["Warmed"],
      },
    ],
    subtotal: 690,
    taxAmount: 35,
    taxBreakdown: "GST 5% (CGST 2.5% + SGST 2.5%)",
    totalAmount: 725,
    paymentMethod: "UPI",
    paymentGatewayText: "UPI · BharatPe · Captured 9:38:12",
    paymentReference: "UPI ref 3281 0984 1294 · pay_Bh712 · settles Fri 2 Oct",
    paymentStatus: "PAID",
    status: "Preparing",
    makeTime: "—",
    kdsStation: "Bar 1 KDS (Hot & Cold)",
    baristaName: "Meera K.",
    priorityTier: "Walk-in Counter",
    customerProfile: {
      initials: "S",
      name: "Saisubbireddy",
      phone: "+91 ••••• 83435 · since Mar 2025",
      memberSince: "Mar 2025",
      tier: "Gold",
      points: "1,240",
      totalOrders: 38,
      lifetimeSpend: "₹14,860",
      note: "Prefers extra salt cream layer on Cà Phê Muối",
    },
    timeline: [
      { time: "9:38", event: "Placed at Counter POS 1", dotColor: "#55647a" },
      { time: "9:38", event: "Payment settled · UPI", dotColor: "#55647a" },
      { time: "Now", event: "Preparing at Bar 1", isCurrent: true, dotColor: "#22629e" },
    ],
    sla: {
      elapsedText: "3 min since placed · target 5 min",
      busyModeText: "On Track",
      percentage: 60,
    },
  },
  {
    id: "ord_c216",
    orderNumber: "C-216",
    time: "9:38",
    createdAt: "2026-10-02T09:38:00+05:30",
    storeName: "Indiranagar",
    storeId: "store_blr_indiranagar",
    channel: "Counter",
    customerName: "Walk-in",
    itemCount: 2,
    items: [
      {
        id: "item_c216_1",
        productName: "Vietnamese Iced Coffee",
        quantity: 2,
        unitPrice: 200,
        totalPrice: 400,
        modifiers: ["Phin drip", "Condensed milk"],
      },
    ],
    subtotal: 400,
    taxAmount: 20,
    totalAmount: 420,
    paymentMethod: "UPI",
    paymentGatewayText: "UPI · Paytm · Refunded 9:39:40",
    paymentReference: "UPI ref 3281 0983 2190 · rfd_9921",
    paymentStatus: "REFUNDED",
    status: "Cancelled",
    makeTime: "—",
    isCancelled: true,
    kdsStation: "Bar 2 KDS",
    notes: "Customer cancelled prior to brew queue",
    timeline: [
      { time: "9:38", event: "Placed at Counter POS 2", dotColor: "#55647a" },
      { time: "9:39", event: "Order cancelled by cashier", dotColor: "#c0352b" },
      { time: "9:39", event: "Instant refund processed to UPI VPA", dotColor: "#55647a" },
    ],
  },
  {
    id: "ord_k112",
    orderNumber: "K112",
    time: "9:36",
    createdAt: "2026-10-02T09:36:00+05:30",
    storeName: "Indiranagar",
    storeId: "store_blr_indiranagar",
    channel: "Kiosk K1",
    customerName: "Guest",
    itemCount: 3,
    items: [
      {
        id: "item_k112_1",
        productName: "Egg Coffee (Cà Phê Trứng)",
        quantity: 1,
        unitPrice: 320,
        totalPrice: 320,
        modifiers: ["Hot", "Traditional custard whip"],
      },
      {
        id: "item_k112_2",
        productName: "Cold Brew Tonic",
        quantity: 2,
        unitPrice: 200,
        totalPrice: 400,
        modifiers: ["Large", "Lemon slice"],
      },
    ],
    subtotal: 720,
    taxAmount: 36,
    totalAmount: 756,
    paymentMethod: "UPI",
    paymentGatewayText: "UPI · PhonePe · Captured 9:36:15",
    paymentReference: "UPI ref 3281 0981 9283 · pay_Ph109",
    paymentStatus: "PAID",
    status: "Ready",
    makeTime: "4:48",
    kdsStation: "Bar 2 KDS",
    baristaName: "Rohan V.",
    priorityTier: "Self-service Kiosk",
    timeline: [
      { time: "9:36", event: "Ordered at Kiosk K1", dotColor: "#55647a" },
      { time: "9:36", event: "Auto-dispatched to Bar 2 KDS", dotColor: "#55647a" },
      { time: "9:38", event: "Preparation started", dotColor: "#55647a" },
      { time: "9:41", event: "Order completed · placed on Shelf B", dotColor: "#1f7a4d" },
    ],
  },
  {
    id: "ord_a112",
    orderNumber: "A-112",
    time: "9:35",
    createdAt: "2026-10-02T09:35:00+05:30",
    storeName: "Bandra",
    storeId: "store_mum_bandra",
    channel: "App",
    customerName: "Ishaan Kapoor",
    customerPhone: "+91 99201 88320",
    itemCount: 2,
    items: [
      {
        id: "item_a112_1",
        productName: "Matcha Cloud Latte",
        quantity: 2,
        unitPrice: 257,
        totalPrice: 514,
        modifiers: ["Oat milk +₹40", "Ceremonial Uji Grade"],
      },
    ],
    subtotal: 514,
    taxAmount: 26,
    totalAmount: 540,
    paymentMethod: "Card",
    paymentGatewayText: "Card · HDFC VISA · Captured 9:35:04",
    paymentReference: "AUTH_882194 · VISA **** 8821",
    paymentStatus: "PAID",
    status: "Preparing",
    makeTime: "—",
    kdsStation: "Bar 1 KDS",
    baristaName: "Pooja D.",
    priorityTier: "App Priority Prep",
    timeline: [
      { time: "9:35", event: "Placed in app", dotColor: "#55647a" },
      { time: "9:35", event: "Ticket routed to Bandra Bar 1", dotColor: "#55647a" },
      { time: "Now", event: "Preparing", isCurrent: true, dotColor: "#22629e" },
    ],
  },
  {
    id: "ord_c094",
    orderNumber: "C-094",
    time: "9:33",
    createdAt: "2026-10-02T09:33:00+05:30",
    storeName: "Cyber Hub",
    storeId: "store_del_cyberhub",
    channel: "Counter",
    customerName: "Walk-in",
    itemCount: 1,
    items: [
      {
        id: "item_c094_1",
        productName: "Cascara Sparkling Soda",
        quantity: 1,
        unitPrice: 257,
        totalPrice: 257,
        modifiers: ["Iced", "Citrus zest"],
      },
    ],
    subtotal: 257,
    taxAmount: 13,
    totalAmount: 270,
    paymentMethod: "Cash",
    paymentStatus: "PAID",
    status: "Delayed",
    makeTime: "9:12",
    isDelayed: true,
    kdsStation: "Bar 1 KDS",
    notes: "Barista station bottleneck: ice replenishment in progress",
    timeline: [
      { time: "9:33", event: "Counter POS ordered", dotColor: "#55647a" },
      { time: "9:34", event: "Queued at station", dotColor: "#55647a" },
      { time: "Now", event: "SLA alert: 9 min elapsed", isCurrent: true, dotColor: "#c0352b" },
    ],
    sla: {
      elapsedText: "9 min 12 s · target 4 min",
      busyModeText: "Station Delayed",
      percentage: 100,
    },
  },
  {
    id: "ord_k058",
    orderNumber: "K058",
    time: "9:30",
    createdAt: "2026-10-02T09:30:00+05:30",
    storeName: "Koramangala",
    storeId: "store_blr_koramangala",
    channel: "Kiosk K1",
    customerName: "Guest",
    itemCount: 2,
    items: [
      {
        id: "item_k058_1",
        productName: "Vietnamese Black Phin",
        quantity: 1,
        unitPrice: 220,
        totalPrice: 220,
        modifiers: ["Dark Roast Da Lat Robusta"],
      },
      {
        id: "item_k058_2",
        productName: "Almond Frangipane",
        quantity: 1,
        unitPrice: 228,
        totalPrice: 228,
        modifiers: ["Warmed"],
      },
    ],
    subtotal: 448,
    taxAmount: 22,
    totalAmount: 470,
    paymentMethod: "UPI",
    paymentGatewayText: "UPI · Razorpay · Captured 9:30:22",
    paymentReference: "UPI ref 3281 0971 9280",
    paymentStatus: "PAID",
    status: "Completed",
    makeTime: "4:21",
    kdsStation: "Bar 2 KDS",
  },
  {
    id: "ord_q31",
    orderNumber: "Q-31",
    time: "9:28",
    createdAt: "2026-10-02T09:28:00+05:30",
    storeName: "Indiranagar",
    storeId: "store_blr_indiranagar",
    channel: "QR dine-in",
    customerName: "Table 4",
    customerPhone: "+91 97112 00192",
    itemCount: 4,
    items: [
      {
        id: "item_q31_1",
        productName: "Coconut Foam Cold Brew",
        quantity: 2,
        unitPrice: 280,
        totalPrice: 560,
        modifiers: ["Fresh coconut cream", "Iced"],
      },
      {
        id: "item_q31_2",
        productName: "Pandan Waffle",
        quantity: 2,
        unitPrice: 185,
        totalPrice: 370,
        modifiers: ["Maple syrup", "Crisp"],
      },
    ],
    subtotal: 930,
    taxAmount: 47,
    totalAmount: 977,
    paymentMethod: "UPI",
    paymentGatewayText: "UPI · PineLabs · Captured 9:28:18",
    paymentReference: "UPI ref 3281 0969 8124",
    paymentStatus: "PAID",
    status: "Delayed 14m",
    makeTime: "14:00",
    isDelayed: true,
    kdsStation: "Kitchen KDS",
    notes: "Waffle iron reheat delay · Table 4 notified",
    sla: {
      elapsedText: "14 min · target 8 min",
      busyModeText: "Kitchen Delayed",
      percentage: 100,
    },
  },
  {
    id: "ord_c205",
    orderNumber: "C-205",
    time: "9:08",
    createdAt: "2026-10-02T09:08:00+05:30",
    storeName: "Indiranagar",
    storeId: "store_blr_indiranagar",
    channel: "Counter",
    customerName: "Guest",
    itemCount: 2,
    items: [
      {
        id: "item_c205_1",
        productName: "Phin Americano",
        quantity: 2,
        unitPrice: 200,
        totalPrice: 400,
        modifiers: ["Hot", "Single origin Arabica"],
      },
    ],
    subtotal: 400,
    taxAmount: 20,
    totalAmount: 420,
    paymentMethod: "UPI",
    paymentGatewayText: "UPI · Paytm · Partially Refunded",
    paymentReference: "UPI ref 3281 0950 2918",
    paymentStatus: "PARTIALLY_REFUNDED",
    status: "Part refund",
    makeTime: "3:55",
    isRefunded: true,
    notes: "One cup replaced due to milk preference adjustment, ₹200 refunded",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.toLowerCase().trim() || "";
  const tab = (searchParams.get("tab") || "ALL").toUpperCase();
  const store = searchParams.get("store") || "All 12";
  const channel = searchParams.get("channel") || "All";
  const status = searchParams.get("status") || "All";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  let filtered = [...MOCK_ORDERS];

  // Search Filter
  if (search) {
    filtered = filtered.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        (order.customerPhone && order.customerPhone.includes(search)) ||
        (order.paymentReference && order.paymentReference.toLowerCase().includes(search)) ||
        order.storeName.toLowerCase().includes(search)
    );
  }

  // Tab Filter
  if (tab === "LIVE") {
    filtered = filtered.filter(
      (o) =>
        o.status === "Preparing" ||
        o.status === "Ready" ||
        o.status === "Delayed" ||
        o.status === "Delayed 14m"
    );
  } else if (tab === "DELAYED") {
    filtered = filtered.filter((o) => o.isDelayed || o.status.startsWith("Delayed"));
  } else if (tab === "COMPLETED") {
    filtered = filtered.filter((o) => o.status === "Completed");
  } else if (tab === "REFUNDED") {
    filtered = filtered.filter((o) => o.status === "Part refund" || o.isRefunded);
  } else if (tab === "CANCELLED") {
    filtered = filtered.filter((o) => o.status === "Cancelled" || o.isCancelled);
  }

  // Store Filter
  if (store && store !== "All 12" && store !== "All") {
    filtered = filtered.filter(
      (o) => o.storeName.toLowerCase() === store.toLowerCase() || o.storeId === store
    );
  }

  // Channel Filter
  if (channel && channel !== "All") {
    filtered = filtered.filter(
      (o) => o.channel.toLowerCase() === channel.toLowerCase()
    );
  }

  // Status Filter
  if (status && status !== "All") {
    filtered = filtered.filter(
      (o) => o.status.toLowerCase().startsWith(status.toLowerCase())
    );
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginatedOrders = filtered.slice(startIndex, startIndex + limit);

  const counts = {
    all: 1284,
    live: 41,
    delayed: 3,
    completed: 1222,
    refunded: 6,
    cancelled: 15,
  };

  const response: OrdersListResponse = {
    orders: paginatedOrders,
    total: 1284,
    page,
    limit,
    totalPages: Math.ceil(1284 / limit),
    counts,
    updatedAt: "9:41 am",
  };

  return NextResponse.json(response);
}
