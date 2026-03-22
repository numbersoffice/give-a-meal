import { errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// listClaimedDonations
export async function GET(request: NextRequest) {
  try {
    const claimId = request.nextUrl.searchParams.get("claimId");

    if (!claimId || typeof claimId !== "string")
      throw new ApiError(400, "Missing parameter or wrong type: claimId.");

    const payload = await getPayload({ config });

    const { docs } = await payload.find({
      collection: "donations",
      where: {
        claimedBy: { equals: claimId },
        redeemedAt: { exists: false },
      },
      depth: 2,
    });

    return NextResponse.json(docs);
  } catch (error) {
    return errorResponse(error);
  }
}
