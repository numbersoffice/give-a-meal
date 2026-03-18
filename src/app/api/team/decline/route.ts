import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { sendGrid } from "@/lib/api/sendgrid";
import { NextRequest, NextResponse } from "next/server";

// declineTeamRequest
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { verificationId, businessId } = await request.json();
    const connectionData = await verifyBusinessMembership(authData, businessId, true);

    if (!verificationId || typeof verificationId !== "number")
      throw new ApiError(400, "Missing parameter or wrong type: verificationId.");

    // Remove verification entry
    const verificationRes = await supabaseService
      .from("verifications")
      .delete()
      .eq("id", verificationId);

    if (verificationRes.error)
      throw new ApiError(500, verificationRes.error.message);

    // Notify employee of declined request
    const msg = {
      to: (verificationRes.data as any)?.[0]?.verification_email,
      from: { email: "max@give-a-meal.org", name: "Give a Meal" },
      templateId: "d-7d58b9f8b301463bad3d653da57e41bc",
      dynamic_template_data: {
        business: connectionData.business.business_name,
      },
    };
    sendGrid.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
