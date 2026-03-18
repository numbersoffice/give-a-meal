import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// editItem
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const authData = await verifyAuth(request);
    const { businessId, title, description } = await request.json();
    const itemId = Number(params.itemId);
    await verifyBusinessMembership(authData, businessId, true);

    if (!itemId || isNaN(itemId))
      throw new ApiError(400, "Missing parameter or wrong type: itemId.");
    if (!title && !description)
      throw new ApiError(400, "Missing parameter: title or description.");

    const itemRes = await supabaseService
      .from("items")
      .update({ title, description })
      .eq("id", itemId);

    if (itemRes.error || (itemRes.data as any)?.length === 0)
      throw new ApiError(500, "There was a problem updating this item");

    return NextResponse.json(itemRes.data);
  } catch (error) {
    return errorResponse(error);
  }
}

// archiveItem
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const authData = await verifyAuth(request);
    const { businessId } = await request.json();
    const itemId = Number(params.itemId);
    await verifyBusinessMembership(authData, businessId, true);

    if (!itemId || isNaN(itemId))
      throw new ApiError(400, "Missing parameter or wrong type: itemId.");

    const deleteRes = await supabaseService
      .from("items")
      .update({ archived: true })
      .eq("id", itemId);

    if (deleteRes.error || (deleteRes.data as any)?.length === 0)
      throw new ApiError(500, "There was a problem deleting this item.");

    return NextResponse.json(deleteRes.data);
  } catch (error) {
    return errorResponse(error);
  }
}
