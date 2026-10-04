import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { sendNotifications } from "@/lib/api/notifications";
import staffVerificationRequestTemplate from "@/components/emailTemplates/staffVerificationRequest";
import { NextRequest, NextResponse } from "next/server";

// createUserVerification
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { businessId } = await request.json();

    if (!businessId) throw new ApiError(400, "Missing parameter businessId.");

    const payload = await getPayload({ config });

    // Verify business exists
    const business = await payload.findByID({
      collection: "businesses",
      id: businessId,
    });

    if (!business)
      throw new ApiError(500, "We had a problem adding the verification entry.");

    const { docs: existingUsers } = await payload.find({
      collection: "businessUsers",
      where: { id: { equals: authData.uid } },
      limit: 1,
    });

    if (existingUsers.length === 0) throw new ApiError(404, "User not found.");
    const businessUser = existingUsers[0];

    // Create verification entry
    const verification = await payload.create({
      collection: "verifications",
      data: {
        business: businessId,
        placeId: business.placeId,
        businessUser: businessUser.id,
        connectionType: "user",
        verificationMode: "email",
        verificationEmail: authData.email,
      },
    });

    sendNotifications(businessId, "team_request");

    // Send email to business owners
    const { docs: owners } = await payload.find({
      collection: "businessUsers",
      where: {
        ownedBusinesses: { in: [businessId] },
      },
      limit: 100,
    });

    const template = staffVerificationRequestTemplate({
      businessName: business.businessName,
      requestEmail: authData.email,
    });

    for (const owner of owners) {
      if (owner.email) {
        await payload.sendEmail({
          to: owner.email,
          subject: "New employee request",
          text: template.text,
          html: template.html,
        });
      }
    }

    return NextResponse.json(verification);
  } catch (error) {
    return errorResponse(error);
  }
}
