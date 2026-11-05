import { NextRequest, NextResponse } from "next/server";
import { MOCK_ORDERS } from "../route";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase();

  const found = MOCK_ORDERS.find(
    (o) =>
      o.id.toLowerCase() === decodedId ||
      o.orderNumber.toLowerCase() === decodedId
  );

  if (!found) {
    return NextResponse.json(
      { error: `Order with identifier "${id}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(found);
}
