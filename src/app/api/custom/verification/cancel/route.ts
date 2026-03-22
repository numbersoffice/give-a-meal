import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// cancelVerification
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { placeId } = await request.json();

    if (!placeId) throw new ApiError(400, "Missing parameter placeId.");

    const payload = await getPayload({ config });

    // Find active verifications for this user and place
    const { docs: verifications } = await payload.find({
      collection: "verifications",
      where: {
        placeId: { equals: placeId },
        verificationEmail: { equals: authData.email },
      },
    });

    if (verifications.length === 0)
      throw new ApiError(500, "We couldn't find an active verification involving this business and this user");

    // Delete associated verification keys
    for (const v of verifications) {
      await payload.delete({
        collection: "verification-keys",
        where: { verification: { equals: v.id } },
      });
    }

    // Delete verifications
    await payload.delete({
      collection: "verifications",
      where: {
        placeId: { equals: placeId },
        verificationEmail: { equals: authData.email },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
