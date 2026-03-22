import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";

import { getBusinessDetailsFromGoogle } from "@/lib/api/utils";
import { NextRequest, NextResponse } from "next/server";

// verifyOwnerByPhone
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { placeId, verificationNotes } = await request.json();
    if (!placeId) throw new ApiError(400, "Missing parameter placeId.");

    const details: any = await getBusinessDetailsFromGoogle(placeId);
    if (!details || !details.internationalPhoneNumber)
      throw new ApiError(503, "Failed to fetch business details.");

    const payload = await getPayload({ config });

    // Find or create business user
    const { docs: existingUsers } = await payload.find({
      collection: "businessUsers",
      where: { email: { equals: authData.email } },
      limit: 1,
    });

    let businessUser;
    if (existingUsers.length > 0) {
      businessUser = existingUsers[0];
    } else {
      businessUser = await payload.create({
        collection: "businessUsers",
        data: { email: authData.email },
      });
    }

    // Create verification entry
    const verification = await payload.create({
      collection: "verifications",
      data: {
        placeId,
        businessUser: businessUser.id,
        connectionType: "admin",
        verificationMode: "phone",
        verificationEmail: authData.email,
        verificationPhone: details.internationalPhoneNumber,
        verificationNotes: verificationNotes ?? null,
      },
    });

    // Send notification email to admin
    await payload.sendEmail({
      to: process.env.INBOUND_EMAIL,
      subject: "Phone Authentication Request",
      text: `A new restaurant is asking for verification. Please call ${details.internationalPhoneNumber} to verify. They left the following notes: ${verificationNotes ?? "No notes."}`,
      html: `<h1>Phone verification request</h1><p>Please call ${details.internationalPhoneNumber} to verify.</p><h2>Notes</h2><p>${verificationNotes ?? "No notes"}</p>`,
    });

    return NextResponse.json(verification);
  } catch (error) {
    console.log(error)
    return errorResponse(error);
  }
}
