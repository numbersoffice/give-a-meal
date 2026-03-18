import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { keysToCamel } from "@/lib/api/utils";
import { sendNotifications } from "@/lib/api/notifications";
import { NextRequest, NextResponse } from "next/server";

// createUserVerification
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { businessId } = await request.json();

    if (!businessId) throw new ApiError(400, "Missing parameter businessId.");

    // Get business
    const business = await supabaseService
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .limit(1)
      .single();

    if (business.error) throw new ApiError(500, business.error.message);
    if (!business.data) throw new ApiError(500, "We had a problem adding the verification entry.");

    // Create unverified connection type
    const connectionEntry: any = await supabaseService
      .from("verifications")
      .insert({
        business: businessId,
        place_id: business.data.place_id,
        auth_id: authData.uid,
        connection_type: "user",
        verification_mode: "email",
        verification_email: authData.email,
      })
      .select("*, business!inner(*)")
      .limit(1)
      .single();

    if (connectionEntry.error)
      throw new ApiError(500, connectionEntry.error.message);
    if (!connectionEntry.data)
      throw new ApiError(500, "We had a problem adding the verification entry.");

    // Send notifications
    sendNotifications(businessId, "team_request");

    return NextResponse.json(keysToCamel(connectionEntry.data));
  } catch (error) {
    return errorResponse(error);
  }
}
