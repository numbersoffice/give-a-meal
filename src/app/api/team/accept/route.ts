import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { sendGrid } from "@/lib/api/sendgrid";
import { NextRequest, NextResponse } from "next/server";

// acceptTeamRequest
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { verificationId, businessId } = await request.json();
    const connectionData = await verifyBusinessMembership(authData, businessId, true);

    if (!verificationId || typeof verificationId !== "number")
      throw new ApiError(400, "Missing parameter or wrong type: verificationId.");

    // Get verification entry
    const verificationRes = await supabaseService
      .from("verifications")
      .select("*")
      .eq("id", verificationId);

    if (verificationRes.error || !verificationRes.data || verificationRes.data.length === 0)
      throw new ApiError(500, "Verification entry not found.");

    // Check if profile entry already exists
    let profileRes = await supabaseService
      .from("profiles")
      .select("*")
      .eq("email", verificationRes.data[0].verification_email);

    if (profileRes.error)
      throw new ApiError(500, profileRes.error.message);

    if (!profileRes.data || profileRes.data.length === 0) {
      const profileNewRes = await supabaseService.from("profiles").insert({
        auth_id: verificationRes.data[0].auth_id,
        email: verificationRes.data[0].verification_email,
      });

      if (profileNewRes.error) throw new ApiError(500, profileNewRes.error.message);
      profileRes = { data: profileNewRes.data } as any;
    }

    // Delete verification entry
    const deletedVerificationRes = await supabaseService
      .from("verifications")
      .delete()
      .eq("id", verificationId);

    if (deletedVerificationRes.error)
      throw new ApiError(500, deletedVerificationRes.error.message);

    // Add connection entry
    const newConnectionsRes = await supabaseService
      .from("business_connections")
      .insert({
        connection_type: "user",
        business: businessId,
        profile: profileRes.data![0].id,
      });

    if (newConnectionsRes.error)
      throw new ApiError(500, newConnectionsRes.error.message);

    // Notify employee of accepted request
    const msg = {
      to: verificationRes.data[0].verification_email,
      from: { email: "max@give-a-meal.org", name: "Give a Meal" },
      templateId: "d-26d679b50e6245a885089cda15e1e700",
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
