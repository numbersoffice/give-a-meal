import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { sendGrid } from "@/lib/api/sendgrid";
import { getBusinessDetailsFromGoogle, keysToCamel } from "@/lib/api/utils";
import { initAdminApp } from "@/lib/firebaseAdmin";
import { auth } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

initAdminApp();

// verifyOwnerByPhone
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { placeId, verificationNotes } = await request.json();

    if (!placeId) throw new ApiError(400, "Missing parameter placeId.");

    const user = await auth().getUser(authData.uid);
    if (!user) throw new ApiError(500, "Unable to find user by uid.");

    const details: any = await getBusinessDetailsFromGoogle(placeId);
    if (!details || !details.internationalPhoneNumber)
      throw new ApiError(503, "Failed to fetch business details.");

    const connectionEntry = await supabaseService
      .from("verifications")
      .insert({
        place_id: placeId,
        auth_id: authData.uid,
        connection_type: "admin",
        verification_email: user.email,
        verification_phone: details.internationalPhoneNumber,
        verification_mode: "phone",
        verification_notes: verificationNotes ?? null,
      })
      .select()
      .limit(1)
      .single();

    if (connectionEntry.error)
      throw new ApiError(500, connectionEntry.error.message);
    if (!connectionEntry.data)
      throw new ApiError(
        500,
        "We had a problem adding the verification entry.",
      );

    // Send notification email to admin
    const msg = {
      to: user.email,
      from: { email: "max@give-a-meal.org", name: "Give a Meal System" },
      subject: "Phone Authentication Request",
      text: `A new restaurant is asking for verification. Please call ${details.internationalPhoneNumber} to verify. They left the follow notes: ${verificationNotes ?? "No notes."}}`,
      html: `<h1>Phone verification request</h1><p>Please call ${details.internationalPhoneNumber} to verify.</p><h2>Notes</h2><p>${verificationNotes ?? "No notes"}</p>`,
    };
    await sendGrid.send(msg);

    return NextResponse.json(keysToCamel(connectionEntry.data));
  } catch (error) {
    return errorResponse(error);
  }
}
