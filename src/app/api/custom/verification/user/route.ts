import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { sendNotifications } from "@/lib/api/notifications";
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

    // Find or create business user for the requester
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
        business: businessId,
        placeId: business.placeId,
        businessUser: businessUser.id,
        connectionType: "user",
        verificationMode: "email",
        verificationEmail: authData.email,
      },
    });

    sendNotifications(businessId, "team_request");

    return NextResponse.json(verification);
  } catch (error) {
    return errorResponse(error);
  }
}
