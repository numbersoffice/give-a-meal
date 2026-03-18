import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { sendGrid } from "@/lib/api/sendgrid";
import { sendNotifications } from "@/lib/api/notifications";
import { NextRequest, NextResponse } from "next/server";

// getDonationsFromBusiness
export async function GET(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const businessId = Number(request.nextUrl.searchParams.get("businessId"));
    const isActiveParam = request.nextUrl.searchParams.get("isActive");
    await verifyBusinessMembership(authData, businessId);

    let donationsRes: any;
    if (isActiveParam === "true") {
      donationsRes = await supabaseService
        .from("donations")
        .select("*, item_id(*), donated_by(first_name)")
        .is("redeemed_at", null)
        .eq("business_id", businessId);
    } else if (isActiveParam === "false") {
      donationsRes = await supabaseService
        .from("donations")
        .select("*, item_id(*), donated_by(first_name)")
        .not("redeemed_at", "is", null)
        .eq("business_id", businessId)
        .limit(5);
    } else {
      donationsRes = await supabaseService
        .from("donations")
        .select("*, item_id(*), donated_by(first_name)")
        .eq("business_id", businessId);
    }

    if (donationsRes.error) throw new ApiError(500, donationsRes.error.message);

    const data = donationsRes.data.map((donation: any) => ({
      ...donation,
      donor_name: donation.donor_name ?? donation.donated_by?.first_name ?? null,
    }));

    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}

// addDonation
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { itemId, businessId, donorEmail } = await request.json();
    const connectionData = await verifyBusinessMembership(authData, businessId);

    if (!itemId || typeof itemId !== "number")
      throw new ApiError(400, "Missing parameter or wrong type: itemId.");

    // Check if item exists on this business
    const itemRes: any = await supabaseService
      .from("items")
      .select("*, business_id(business_name)")
      .eq("id", itemId)
      .eq("business_id", businessId);

    if (itemRes.error || itemRes.data.length === 0)
      throw new ApiError(400, `Item with id ${itemId} does not exist for this business, or does not exist at all.`);

    // If no email has been provided, add donation without donor
    if (!donorEmail) {
      const itemsRes = await supabaseService.from("donations").insert({
        item_id: itemId,
        business_id: businessId,
        donated_by: null,
        created_by: connectionData.profile.id,
      });

      if (itemsRes.error) throw new ApiError(500, itemsRes.error.message);

      sendNotifications(businessId, "donation_added", connectionData.profile.id);
      return NextResponse.json(itemsRes.data?.[0] ?? null);
    }

    // Check if donor profile already exists
    let donorProfileId = null;
    const { data: profileData, error: profileError } = await supabaseService
      .from("profiles")
      .select("id")
      .eq("email", donorEmail)
      .limit(1);

    if (profileError) throw new ApiError(500, profileError.message);

    if (profileData && profileData.length > 0) {
      donorProfileId = profileData[0].id;
    }

    // Create profile for donor if needed
    if (donorProfileId === null) {
      const profileRes = await supabaseService.from("profiles").insert({
        email: donorEmail,
      });

      if (profileRes.error) throw new ApiError(500, profileRes.error.message);
      donorProfileId = (profileRes.data as any)?.[0]?.id;
    }

    // Donate item
    const itemsRes = await supabaseService.from("donations").insert({
      item_id: itemId,
      business_id: businessId,
      donated_by: donorProfileId,
      created_by: connectionData.profile.id,
    });

    if (itemsRes.error) throw new ApiError(500, itemsRes.error.message);

    sendNotifications(businessId, "donation_added", connectionData.profile.id);

    // Send email to donor
    const msg = {
      to: donorEmail,
      from: { email: "max@give-a-meal.org", name: "Give a Meal" },
      templateId: "d-163032b3f2ee4565b1e79a3deaadc08a",
      dynamic_template_data: {
        businessName: itemRes.data[0].business_id.business_name,
        donationName: itemRes.data[0].title,
        donorProfileUrl: `https://give-a-meal.org/donors/profile?pe=${donorEmail}`,
      },
    };
    sendGrid.send(msg);

    return NextResponse.json(itemsRes.data?.[0] ?? null);
  } catch (error) {
    return errorResponse(error);
  }
}
