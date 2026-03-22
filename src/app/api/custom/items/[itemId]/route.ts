import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// editItem
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const authData = await verifyAuth(request);
    const { businessId, title, description } = await request.json();
    const { itemId } = await params;
    await verifyBusinessMembership(authData, businessId, true);

    if (!itemId)
      throw new ApiError(400, "Missing parameter: itemId.");
    if (!title && !description)
      throw new ApiError(400, "Missing parameter: title or description.");

    const payload = await getPayload({ config });

    const updated = await payload.update({
      collection: "items",
      id: itemId,
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return errorResponse(error);
  }
}

// archiveItem
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const authData = await verifyAuth(request);
    const { businessId } = await request.json();
    const { itemId } = await params;
    await verifyBusinessMembership(authData, businessId, true);

    if (!itemId)
      throw new ApiError(400, "Missing parameter: itemId.");

    const payload = await getPayload({ config });

    const archived = await payload.update({
      collection: "items",
      id: itemId,
      data: { archived: true },
    });

    return NextResponse.json(archived);
  } catch (error) {
    return errorResponse(error);
  }
}
