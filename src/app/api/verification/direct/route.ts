import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { getBusinessDetailsFromGoogle, keysToCamel } from "@/lib/api/utils";
import { NextRequest, NextResponse } from "next/server";

// directOwnerVerification
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { placeId } = await request.json();

    if (!placeId) throw new ApiError(400, "Missing parameter placeId.");

    const details: any = await getBusinessDetailsFromGoogle(placeId);
    if (!details || !details.website)
      throw new ApiError(503, "Failed to fetch business details.");

    const businessDomain = new URL(details.website).host.replace("www.", "");
    const userDomainParts = authData.email.split("@");
    const userDomain = userDomainParts[userDomainParts.length - 1];

    if (businessDomain !== userDomain)
      throw new ApiError(401, "Email address doesn't match business website.");

    // Insert entries in parallel
    const [businessRes, profileRes] = await Promise.all([
      supabaseService
        .from("businesses")
        .insert({
          place_id: details.placeId,
          business_name: details.name,
          address: details.address.address,
          street_number: details.address.streetNumber,
          city: details.address.city,
          postal_code: details.address.postalCode,
          state: details.address.state,
          country: details.address.country,
          lat: details.location.lat,
          lon: details.location.lng,
        })
        .select()
        .limit(1)
        .single()
        .then((res) => {
          if (res.status > 199 && res.status < 300) return res.data;
          throw new ApiError(500, res.error?.message ?? "Failed to insert business entry.");
        }),
      supabaseService
        .from("profiles")
        .upsert({ auth_id: authData.uid, email: authData.email }, { onConflict: "email" })
        .select()
        .limit(1)
        .single()
        .then((res) => {
          if (res.status > 199 && res.status < 300) return res.data;
          throw new ApiError(500, res.error?.message ?? "Failed to insert profile entry.");
        }),
    ]);

    const connectionsRes = await supabaseService
      .from("business_connections")
      .insert({
        connection_type: "admin",
        business: (businessRes as any).id,
        profile: (profileRes as any).id,
      })
      .select("*, business!inner(*), profile(*)")
      .limit(1)
      .single();

    if (connectionsRes.error)
      throw new ApiError(500, connectionsRes.error.message);

    return NextResponse.json(keysToCamel(connectionsRes.data));
  } catch (error) {
    return errorResponse(error);
  }
}
