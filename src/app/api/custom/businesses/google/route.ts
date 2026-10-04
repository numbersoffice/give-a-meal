import { getBusinessDetailsFromGoogle } from "@/lib/api/utils";
import { errorResponse, ApiError } from "@/lib/api/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/api/rateLimit";

const limiter = createRateLimiter(60, 10 * 60 * 1000);

// getGoogleBusiness
export async function GET(request: NextRequest) {
  try {
    if (limiter.consume(request)) throw new ApiError(429, "Too many requests.");

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
