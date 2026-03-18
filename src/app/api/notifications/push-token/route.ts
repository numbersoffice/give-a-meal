import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// updatePushToken
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { pushToken, businessId } = await request.json();
    await verifyBusinessMembership(authData, businessId);

    if (!pushToken || typeof pushToken !== "string")
      throw new ApiError(400, "Missing parameter or wrong type: pushToken.");

    const profileRes = await supabaseService
      .from("profiles")
      .update({ push_token: pushToken })
      .eq("auth_id", authData.uid);

    if (profileRes.error || (profileRes.data as any)?.length === 0)
      throw new ApiError(500, "There was a problem updating the push token.");

    return NextResponse.json(profileRes.data?.[0] ?? null);
  } catch (error) {
    return errorResponse(error);
  }
}
