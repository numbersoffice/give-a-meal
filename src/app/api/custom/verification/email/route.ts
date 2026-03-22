import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { generateRandomString, getBusinessDetailsFromGoogle } from "@/lib/api/utils";
import { NextRequest, NextResponse } from "next/server";

// verifyOwnerByEmail
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { placeId, emailName } = await request.json();

    if (!placeId) throw new ApiError(400, "Missing parameter placeId.");
    if (!emailName) throw new ApiError(400, "Missing parameter emailName.");

    const details: any = await getBusinessDetailsFromGoogle(placeId);
    if (!details || !details.website)
      throw new ApiError(503, "Failed to fetch business details.");

    const domain = new URL(details.website).host.replace("www.", "");
    const emailAddress = emailName + "@" + domain;

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
        verificationMode: "email",
        verificationEmail: emailAddress,
      },
    });

    // Save verification key
    const verificationKey = generateRandomString();
    await payload.create({
      collection: "verification-keys",
      data: {
        verification: verification.id,
        key: verificationKey,
      },
    });

    // Send verification email
    const verificationBaseUrl = process.env.VERIFICATION_URL || `${request.nextUrl.origin}/api/verification/email-link`;
    const verificationURL = `${verificationBaseUrl}?key=${verificationKey}`;
    await payload.sendEmail({
      to: emailAddress,
      subject: "Verify your business on Give a Meal",
      text: `Hi, please verify ${details.name} by visiting: ${verificationURL}`,
      html: `<h1>Verify your business</h1><p>Hi, please verify <strong>${details.name}</strong> on Give a Meal by clicking the link below.</p><p><a href="${verificationURL}">Verify your business</a></p>`,
    });

    return NextResponse.json(verification);
  } catch (error) {
    return errorResponse(error);
  }
}
