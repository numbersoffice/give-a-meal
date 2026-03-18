import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { keysToCamel } from "@/lib/api/utils";
import { NextRequest, NextResponse } from "next/server";

// getTeamPending
export async function GET(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const businessId = Number(request.nextUrl.searchParams.get("businessId"));
    await verifyBusinessMembership(authData, businessId, true);

    const verificationRes = await supabaseService
      .from("verifications")
      .select("*")
      .eq("business", businessId);

    if (verificationRes.error)
      throw new ApiError(500, "Problem finding pending verifications");

    return NextResponse.json(keysToCamel(verificationRes.data));
  } catch (error) {
    return errorResponse(error);
  }
}
