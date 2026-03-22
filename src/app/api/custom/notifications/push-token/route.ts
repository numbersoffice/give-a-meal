import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// updatePushToken
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { pushToken, businessId } = await request.json();
    await verifyBusinessMembership(authData, businessId);

    if (!pushToken || typeof pushToken !== "string")
      throw new ApiError(400, "Missing parameter or wrong type: pushToken.");

    const payload = await getPayload({ config });

    const { docs } = await payload.find({
      collection: "businessUsers",
      where: { email: { equals: authData.email } },
      limit: 1,
    });

    if (docs.length === 0)
      throw new ApiError(500, "User not found.");

    const updated = await payload.update({
      collection: "businessUsers",
      id: docs[0].id,
      data: { pushToken },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return errorResponse(error);
  }
}
