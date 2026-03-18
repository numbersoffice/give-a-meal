import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// getItemsFromBusiness
export async function GET(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const businessId = Number(request.nextUrl.searchParams.get("businessId"));
    await verifyBusinessMembership(authData, businessId);

    const itemsRes = await supabaseService
      .from("items")
      .select("*, donations!inner(count)")
      .eq("business_id", businessId)
      .eq("archived", false)
      .order("title");

    if (itemsRes.error) throw new ApiError(500, itemsRes.error.message);

    return NextResponse.json(itemsRes.data);
  } catch (error) {
    return errorResponse(error);
  }
}

// createItem
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { businessId, title, description } = await request.json();
    await verifyBusinessMembership(authData, businessId);

    if (!title || typeof title !== "string")
      throw new ApiError(400, "Missing parameter or wrong type: title.");
    if (!description || typeof description !== "string")
      throw new ApiError(400, "Missing parameter or wrong type: description.");

    // Check for duplicate
    const duplicateRes: any = await supabaseService
      .from("items")
      .select("*")
      .eq("title", title)
      .eq("business_id", businessId)
      .eq("archived", false);

    if (duplicateRes.error || duplicateRes.data.length > 0)
      throw new ApiError(400, `Item with name ${title} already exists.`);

    const itemsRes = await supabaseService.from("items").insert({
      business_id: businessId,
      title: title,
      description: description,
    });

    if (itemsRes.error) throw new ApiError(500, itemsRes.error.message);

    return NextResponse.json(itemsRes.data?.[0] ?? null);
  } catch (error) {
    return errorResponse(error);
  }
}
