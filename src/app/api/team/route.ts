import { verifyAuth, verifyBusinessMembership, errorResponse } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { keysToCamel } from "@/lib/api/utils";
import { ApiError } from "@/lib/api/middleware";
import { NextRequest, NextResponse } from "next/server";

// getTeam
export async function GET(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const businessId = Number(request.nextUrl.searchParams.get("businessId"));
    await verifyBusinessMembership(authData, businessId, true);

    const teamRes = await supabaseService
      .from("profiles")
      .select("*, business_connections!inner(business)")
      .eq("business_connections.business", businessId);

    if (teamRes.error)
      throw new ApiError(500, "Problem finding team members");

    return NextResponse.json(keysToCamel(teamRes.data));
  } catch (error) {
    return errorResponse(error);
  }
}
