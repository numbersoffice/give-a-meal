import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// getTeamPending
export async function GET(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const businessId = request.nextUrl.searchParams.get("businessId")!;
    await verifyBusinessMembership(authData, businessId, true);

    const payload = await getPayload({ config });

    const { docs } = await payload.find({
      collection: "verifications",
      where: { business: { equals: businessId } },
    });

    return NextResponse.json(docs);
  } catch (error) {
    return errorResponse(error);
  }
}
