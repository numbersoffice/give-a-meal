import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { keysToCamel } from "@/lib/api/utils";
import { NextRequest, NextResponse } from "next/server";

// removeTeamMember
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { profileId, businessId } = await request.json();
    const connectionData = await verifyBusinessMembership(authData, businessId, true);

    if (!profileId)
      throw new ApiError(400, "Missing parameter: profileId.");

    if (connectionData.connection_type === "user")
      throw new ApiError(403, "Only business owners are allowed to remove team members.");

    const removeConnectionRes = await supabaseService
      .from("business_connections")
      .delete()
      .eq("profile", profileId)
      .eq("business", businessId);

    if (removeConnectionRes.error || (removeConnectionRes.data as any)?.length === 0)
      throw new ApiError(500, "Couldn't remove connection or connection does not exist.");

    return NextResponse.json(keysToCamel(removeConnectionRes.data));
  } catch (error) {
    return errorResponse(error);
  }
}
