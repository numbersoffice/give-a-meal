import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth, unauthorizedResponse, errorResponse } from "@/lib/admin/auth";
import { supabaseService } from "@/lib/supabase";
import { getAdminAuth } from "@/lib/admin/firebaseAdmin";
import { getBusinessDetailsFromGoogle, keysToCamel } from "@/lib/api/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  let uid: string;
  try {
    uid = await verifyAdminAuth(req);
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

  if (!verificationRes.data || verificationRes.data.length === 0) {
    return errorResponse("Couldn't find verification", 404);
  }

  const details: any = await getBusinessDetailsFromGoogle(
    verificationRes.data[0].place_id
  );

  if (!details || !details.website) {
    return errorResponse("Couldn't find business on Google Places API", 503);
  }

  const user = await getAdminAuth().getUser(uid);
  const verification = verificationRes.data[0];

  verification.user_email = user.email;
  verification.address = {
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

  return NextResponse.json(keysToCamel(verification));
}
