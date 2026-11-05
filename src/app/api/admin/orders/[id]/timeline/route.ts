import { NextRequest, NextResponse } from "next/server";
import { MOCK_ORDERS } from "../../route";
import { Order, OrderTimelineDetail } from "@/types/orders";

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

  // Pre-configured timeline for A-047 (matching Figma 225:102900 / 225:102939 exactly)
  if (order.orderNumber === "A-047") {
    const timelineDetail: OrderTimelineDetail = {
      orderId: order.id,
      orderNumber: "A-047",
      status: "Preparing",
      channel: "App",
      storeName: "Indiranagar",
      customerName: "Saisubbireddy",
      totalAmount: 966,
      events: [
        {
          id: "evt_1",
          time: "9:31:04",
          title: "Order placed in app",
          tag: "Customer",
          description: "Saisubbireddy · iPhone · BRUVI app v3.2 · 3 items · BREW50 applied",
          avatarType: "initials",
          avatarText: "S",
          category: "customer",
        },
        {
          id: "evt_2",
          time: "9:31:06",
          title: "Payment authorized · UPI",
          tag: "System",
          description: "Razorpay · ₹966.00 · UPI ref 4290 7712 0034",
          avatarType: "icon",
          avatarIcon: "payment",
          category: "system",
        },
        {
          id: "evt_3",
          time: "9:32:04",
          title: "Auto-accepted by Indiranagar",
          tag: "System",
          description: "Busy mode on · promised ready 9:45 (+10 min app prep)",
          avatarType: "icon",
          avatarIcon: "check",
          category: "system",
        },
        {
          id: "evt_4",
          time: "9:32:05",
          title: "Ticket sent to Bar 1 KDS",
          tag: "System",
          description: "KDS-IND-BAR1 · 6th in queue · 2 drinks + 1 drink",
          avatarType: "icon",
          avatarIcon: "kds",
          category: "system",
        },
        {
          id: "evt_5",
          time: "9:36:50",
          title: "Started by Arjun S.",
          tag: "Staff",
          description: "Barista · Bar 1 · bumped from queue on KDS",
          avatarType: "initials",
          avatarText: "AS",
          category: "staff",
        },
        {
          id: "evt_6",
          time: "9:36:52",
          title: "Customer notified “Preparing”",
          tag: "System",
          description: "Push delivered to iPhone · opened 9:37:30",
          avatarType: "icon",
          avatarIcon: "bell",
          category: "system",
        },
        {
          id: "evt_7",
          time: "9:38:15",
          title: "Note added by Arjun S.",
          tag: "Staff",
          description: "“Oat milk low — opened last carton, transfer due 1:45 pm”",
          avatarType: "initials",
          avatarText: "AS",
          category: "staff",
        },
        {
          id: "evt_8",
          time: "9:41 now",
          title: "Preparing · expected ready 9:45",
          tag: "Live",
          description: "Make time 4:10 so far · store avg 4:52",
          avatarType: "pulse",
          avatarIcon: "clock",
          category: "system",
          isCurrent: true,
        },
      ],
      upcomingSteps: [
        {
          id: "up_1",
          time: "~9:45",
          title: "Marked ready on KDS · “Ready for pickup” push to Saisubbireddy",
        },
        {
          id: "up_2",
          time: "—",
          title: "Picked up at counter · order closed",
        },
      ],
      serviceLevel: {
        statusText: "2 min over target",
        elapsedTime: "10:00",
        elapsedSubtext: "elapsed since 9:31 · target 8:00",
        targetTime: "Target 8:00",
        percentageSuccess: 80,
        percentageOver: 20,
        queueWait: "4:45",
        makeTime: "4:10",
        readyBy: "9:45",
      },
      whyItsLate: {
        title: "Why it’s late",
        explanation:
          "Ticket waited 4:45 in the Bar 1 queue during the 9:30 rush. Busy mode already promised the customer 9:45, so the app ETA is still on time.",
        customerActionsCount: 1,
        staffActionsCount: 2,
        systemEventsCount: 5,
        barStoreName: "Indiranagar bar",
      },
    };

    return NextResponse.json(timelineDetail);
  }

  // Dynamic fallback for any other order (e.g. C-218)
  const isDelayed = order.isDelayed || order.status.includes("Delayed");
  const timelineDetail: OrderTimelineDetail = {
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    channel: order.channel,
    storeName: order.storeName,
    customerName: order.customerName,
    totalAmount: order.totalAmount,
    events: [
      {
        id: "evt_1",
        time: `${order.time}:00`,
        title: `Order placed via ${order.channel}`,
        tag: "Customer",
        description: `${order.customerName} · ${order.itemCount} items · Total ₹${order.totalAmount}`,
        avatarType: "initials",
        avatarText: order.customerName.charAt(0).toUpperCase() || "C",
        category: "customer",
      },
      {
        id: "evt_2",
        time: `${order.time}:02`,
        title: `Payment authorized · ${order.paymentMethod}`,
        tag: "System",
        description: `Verified gateway authorization · ₹${order.totalAmount}.00`,
        avatarType: "icon",
        avatarIcon: "payment",
        category: "system",
      },
      {
        id: "evt_3",
        time: `${order.time}:15`,
        title: `Accepted by ${order.storeName}`,
        tag: "System",
        description: `Dispatched to ${order.kdsStation || "Bar 1 KDS"}`,
        avatarType: "icon",
        avatarIcon: "check",
        category: "system",
      },
      {
        id: "evt_4",
        time: `${order.time}:20`,
        title: `Ticket queued at ${order.kdsStation || "Bar 1 KDS"}`,
        tag: "System",
        description: `Queue priority tier: ${order.priorityTier || "Normal"}`,
        avatarType: "icon",
        avatarIcon: "kds",
        category: "system",
      },
      {
        id: "evt_5",
        time: `${order.time}:45`,
        title: `Preparation by ${order.baristaName || "Staff"}`,
        tag: "Staff",
        description: `Barista began brewing on station`,
        avatarType: "initials",
        avatarText: (order.baristaName || "Staff")
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        category: "staff",
      },
      {
        id: "evt_6",
        time: `Now`,
        title: `${order.status} · In Progress`,
        tag: "Live",
        description: `Active on store bar display`,
        avatarType: "pulse",
        avatarIcon: "clock",
        category: "system",
        isCurrent: true,
      },
    ],
    upcomingSteps: [
      {
        id: "up_1",
        time: "Upcoming",
        title: "Complete brewing & quality check",
      },
      {
        id: "up_2",
        time: "Final",
        title: "Call customer for pickup / handoff",
      },
    ],
    serviceLevel: {
      statusText: isDelayed ? "Over target" : "On target",
      elapsedTime: order.makeTime || "4:48",
      elapsedSubtext: `elapsed since ${order.time} · target 8:00`,
      targetTime: "Target 8:00",
      percentageSuccess: isDelayed ? 70 : 95,
      percentageOver: isDelayed ? 30 : 0,
      queueWait: "2:30",
      makeTime: order.makeTime || "4:48",
      readyBy: "Estimated soon",
    },
    whyItsLate: {
      title: isDelayed ? "Why it’s delayed" : "Order Status",
      explanation: isDelayed
        ? `Station ${order.kdsStation || "Bar 1"} experienced high volume during rush period.`
        : "Order is progressing normally within the store standard SLA.",
      customerActionsCount: 1,
      staffActionsCount: 1,
      systemEventsCount: 4,
      barStoreName: `${order.storeName} bar`,
    },
  };

  return NextResponse.json(timelineDetail);
}

