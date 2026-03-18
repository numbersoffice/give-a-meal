import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { sendGrid } from "@/lib/api/sendgrid";
import { generateRandomString, getBusinessDetailsFromGoogle, keysToCamel } from "@/lib/api/utils";
import { initAdminApp } from "@/lib/firebaseAdmin";
import { auth } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

initAdminApp();

// verifyOwnerByEmail
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { placeId, emailName } = await request.json();

    if (!placeId) throw new ApiError(400, "Missing parameter placeId.");
    if (!emailName) throw new ApiError(400, "Missing parameter emailName.");

    const user = await auth().getUser(authData.uid);
    if (!user) throw new ApiError(500, "Unable to find user by uid.");

    const details: any = await getBusinessDetailsFromGoogle(placeId);
    if (!details || !details.website)
      throw new ApiError(503, "Failed to fetch business details.");

    const domain = new URL(details.website).host.replace("www.", "");
    const emailAddress = emailName + "@" + domain;

    const connectionEntry = await supabaseService
      .from("verifications")
      .insert({
        place_id: placeId,
        auth_id: authData.uid,
        connection_type: "admin",
        verification_mode: "email",
        verification_email: emailAddress,
      })
      .select()
      .limit(1)
      .single();

    if (connectionEntry.error)
      throw new ApiError(500, connectionEntry.error.message);
    if (!connectionEntry.data)
      throw new ApiError(500, "We had a problem adding the verification entry.");

    // Save verification key
    const verificationKey = generateRandomString();
    const verificationKeyEntry = await supabaseService
      .from("verification_keys")
      .insert({
        verification: connectionEntry.data.id,
        key: verificationKey,
      });

    if (verificationKeyEntry.error)
      throw new ApiError(500, verificationKeyEntry.error.message);

    // Send verification message
    const verificationBaseUrl = process.env.VERIFICATION_URL || `${request.nextUrl.origin}/api/verification/email-link`;
    const msg = {
      to: emailAddress,
      from: { email: "max@give-a-meal.org", name: "Give a Meal" },
      templateId: "d-a1799f8f78e54a34a34bdddc83fdb995",
      dynamic_template_data: {
        business: details.name,
        verificationURL: `${verificationBaseUrl}?key=${verificationKey}`,
      },
    };
    await sendGrid.send(msg);

    return NextResponse.json(keysToCamel(connectionEntry.data));
  } catch (error) {
    return errorResponse(error);
  }
}
