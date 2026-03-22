import { getBusinessDetailsFromGoogle } from "@/lib/api/utils";
import { errorResponse, ApiError } from "@/lib/api/middleware";
import { NextRequest, NextResponse } from "next/server";

// getGoogleBusiness
export async function GET(request: NextRequest) {
  try {
    const placeId = request.nextUrl.searchParams.get("placeId");

    if (!placeId || typeof placeId !== "string")
      throw new ApiError(400, "Request needs a placeId parameter.");

    const details = await getBusinessDetailsFromGoogle(placeId);
    if (!details)
      throw new ApiError(503, "Failed to fetch business details.");

    return NextResponse.json(details);
  } catch (error) {
    return errorResponse(error);
  }
}
