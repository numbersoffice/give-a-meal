import { errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// getBusinessesByLocation
export async function GET(request: NextRequest) {
  try {
    const lat = parseFloat(request.nextUrl.searchParams.get("lat") ?? "");
    const lon = parseFloat(request.nextUrl.searchParams.get("lon") ?? "");

    if (isNaN(lat) || isNaN(lon))
      throw new ApiError(400, "Latitude and longitude are required.");

    const payload = await getPayload({ config });

    const where: any = {
      inactive: { equals: false },
    };

    const minLat = request.nextUrl.searchParams.get("minlat");
    const maxLat = request.nextUrl.searchParams.get("maxlat");
    const minLon = request.nextUrl.searchParams.get("minlon");
    const maxLon = request.nextUrl.searchParams.get("maxlon");

    if (minLat && maxLat && minLon && maxLon) {
      where.location = {
        near: `${lon},${lat},100000,0`,
      };
    } else {
      where.location = {
        near: `${lon},${lat},100000,0`,
      };
    }

    const { docs: businesses } = await payload.find({
      collection: "businesses",
      where,
      limit: 10,
    });

    // Get donation counts
    const counts: Record<string, number> = {};
    await Promise.all(
      businesses.map(async (b) => {
        const { totalDocs } = await payload.count({
          collection: "donations",
          where: {
            business: {
              equals: b.id,
            },
          },
        });
        counts[b.id] = totalDocs;
      }),
    );

    // Add to businesses
    const businessesWithCounts = businesses.map((b) => ({
      ...b,
      donationCount: counts[b.id],
    }));

    return NextResponse.json(businessesWithCounts);
  } catch (error) {
    return errorResponse(error);
  }
}
