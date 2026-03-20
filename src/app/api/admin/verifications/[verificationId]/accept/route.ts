import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth, unauthorizedResponse, errorResponse } from "@/lib/admin/auth";
import { supabaseService } from "@/lib/supabase";
import { getBusinessDetailsFromGoogle, keysToCamel } from "@/lib/api/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  try {
    await verifyAdminAuth(req);
  } catch {
    return unauthorizedResponse();
  }

  const { verificationId } = await params;
  if (!verificationId) {
    return errorResponse("Missing parameter verificationId", 400);
  }

  const verificationRes = await supabaseService
    .from("verifications")
    .select("*")
    .eq("id", verificationId);

  if (verificationRes.error) {
    return errorResponse("Error fetching verification");
  }

  const verification = verificationRes.data[0];

  const details: any = await getBusinessDetailsFromGoogle(verification.place_id);
  if (!details || !details.website) {
    return errorResponse("Failed to fetch business details", 503);
  }

  const businessData = {
    place_id: verification.auth_id,
    business_name: details.name,
    address: details.address.address,
    street_number: details.address.streetNumber,
    city: details.address.city,
    postal_code: details.address.postalCode,
    state: details.address.state,
    country: details.address.country,
    lat: details.location.lat,
    lon: details.location.lng,
  };

  const profileData = {
    auth_id: verification.auth_id,
    email: verification.verification_email,
  };

  const [businessRes, profileRes] = await Promise.all([
    supabaseService.from("businesses").insert(businessData).select().limit(1).single(),
    supabaseService.from("profiles").insert(profileData).select().limit(1).single(),
  ]);

  if (businessRes.error) {
    return errorResponse(businessRes.error.message || "Failed to insert business entry");
  }
  if (profileRes.error) {
    return errorResponse(profileRes.error.message || "Failed to insert profile entry");
  }

  const connectionsRes = await supabaseService
    .from("business_connections")
    .insert({
      connection_type: "admin",
      business: businessRes.data.id,
      profile: profileRes.data.id,
    })
    .select("*, business!inner(*), profile(*)")
    .limit(1)
    .single();

  if (connectionsRes.error) {
    return errorResponse(connectionsRes.error.message);
  }

  const verificationDeleteRes = await supabaseService
    .from("verifications")
    .delete()
    .eq("id", verification.id)
    .single();

  if (verificationDeleteRes.error) {
    return errorResponse(verificationDeleteRes.error.message);
  }

  return NextResponse.json(keysToCamel(connectionsRes.data));
}
