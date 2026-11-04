import { NextRequest, NextResponse } from "next/server";
import { MOCK_ORDERS } from "../../route";
import { Order } from "@/types/orders";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase();

  const orderIndex = MOCK_ORDERS.findIndex(
    (o: Order) =>
      o.id.toLowerCase() === decodedId ||
      o.orderNumber.toLowerCase() === decodedId
  );

  if (orderIndex === -1) {
    return NextResponse.json(
      { error: `Order "${id}" not found` },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { refundAmount, reason, note, method } = body;

    const order = MOCK_ORDERS[orderIndex];
    const isFullRefund = refundAmount >= order.totalAmount;

    // Update order status
    order.status = isFullRefund ? "Cancelled" : "Part refund";
    order.paymentStatus = isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED";
    order.isRefunded = true;

    // Append to timeline
    if (!order.timeline) {
      order.timeline = [];
    }
    order.timeline.push({
      time: "Now",
      event: `Refund of ₹${Number(refundAmount).toFixed(2)} processed via ${method || "UPI"} (${reason || "Quality issue"}). Ref: RF-30431`,
      dotColor: "#c0352b",
    });

    return NextResponse.json({
      success: true,
      refundId: "RF-30431",
      refundAmount: Number(refundAmount),
      method: method || "Original UPI",
      reason,
      note,
      approvedBy: "Kavya R.",
      order,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
