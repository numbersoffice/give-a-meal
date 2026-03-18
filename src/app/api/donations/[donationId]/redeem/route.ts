import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { sendGrid } from "@/lib/api/sendgrid";
import { sendNotifications } from "@/lib/api/notifications";
import { NextRequest, NextResponse } from "next/server";

// redeemDonation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ donationId: string }> }
) {
  try {
    const authData = await verifyAuth(request);
    const { donationId: donationIdParam } = await params;
    const donationId = Number(donationIdParam);
    const { businessId } = await request.json();
    const connectionData = await verifyBusinessMembership(authData, businessId);

    if (!donationId || isNaN(donationId))
      throw new ApiError(400, "Missing parameter or wrong type: donationId.");

    // Check if donation exists on this business
    const donationRes: any = await supabaseService
      .from("items")
      .select("*, business_id(business_name), donations!inner(*, donated_by(email))")
      .eq("donations.id", donationId)
      .limit(1)
      .single();

    if (donationRes.error)
      throw new ApiError(400, "This donation belongs to a different business and can not be claimed.");

    if (!donationRes.data)
      throw new ApiError(403, "This donation belongs to a different business and can not be claimed.");

    if (!donationRes.data.donations[0].claimed_by)
      throw new ApiError(404, "The claim for this donation has expired.");

    // Redeem donation
    const redeemRes = await supabaseService
      .from("donations")
      .update({
        claimed_by: null,
        redeemed_by: connectionData.profile.id,
        redeemed_at: new Date().toISOString(),
      })
      .eq("id", donationId);

    if (redeemRes.error) throw new ApiError(500, redeemRes.error.message);

    sendNotifications(businessId, "donation_removed", connectionData.profile.id);

    // Send notification to donor
    try {
      const msg = {
        to: donationRes.data.donations[0].donated_by.email,
        from: { email: "max@give-a-meal.org", name: "Give a Meal" },
        templateId: "d-d03ff50e9db14c2b9722dd409b2bcd34",
        dynamic_template_data: {
          businessName: donationRes.data.business_id.business_name,
          donationName: donationRes.data.title,
          donorProfileUrl: `https://give-a-meal.org/donors/profile?pe=${donationRes.data.donations[0].donated_by.email}`,
        },
      };
      sendGrid.send(msg);
    } catch (err) {
      console.log(err);
    }

    return NextResponse.json(redeemRes.data?.[0] ?? null);
  } catch (error) {
    return errorResponse(error);
  }
}
