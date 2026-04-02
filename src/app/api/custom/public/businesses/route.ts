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

    const minLat = parseFloat(request.nextUrl.searchParams.get("minlat") ?? "");
    const maxLat = parseFloat(request.nextUrl.searchParams.get("maxlat") ?? "");
    const minLon = parseFloat(request.nextUrl.searchParams.get("minlon") ?? "");
    const maxLon = parseFloat(request.nextUrl.searchParams.get("maxlon") ?? "");

    // Calculate search radius from bounds, or default to 100km
    let maxDistance = 100000;
    if (!isNaN(minLat) && !isNaN(maxLat) && !isNaN(minLon) && !isNaN(maxLon)) {
      const dLat = ((maxLat - minLat) / 2) * (Math.PI / 180);
      const dLon = ((maxLon - minLon) / 2) * (Math.PI / 180);
      const a =
        Math.sin(dLat) * Math.sin(dLat) +
        Math.cos(lat * (Math.PI / 180)) *
          Math.cos(maxLat * (Math.PI / 180)) *
          Math.sin(dLon) *
          Math.sin(dLon);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      maxDistance = Math.ceil(6371000 * c);
    }

    where.location = {
      near: `${lon},${lat},${maxDistance},0`,
    };

    const hasDonations = request.nextUrl.searchParams.get("hasDonations");

    const { docs: allBusinesses } = await payload.find({
      collection: "businesses",
      where,
      limit: 50,
    });

    // Filter to businesses within the visible map bounds
    const businesses =
      !isNaN(minLat) && !isNaN(maxLat) && !isNaN(minLon) && !isNaN(maxLon)
        ? allBusinesses.filter((b) => {
            const [bLon, bLat] = b.location as [number, number];
            return bLat >= minLat && bLat <= maxLat && bLon >= minLon && bLon <= maxLon;
          })
        : allBusinesses;

    // Get active (unredeemed) donation counts, excluding reserved ones
    const counts: Record<string, number> = {};
    await Promise.all(
      businesses.map(async (b) => {
        const { docs: donations } = await payload.find({
          collection: "donations",
          where: {
            business: { equals: b.id },
            redeemedAt: { exists: false },
          },
          limit: 100,
        });

        if (donations.length === 0) {
          counts[b.id] = 0;
          return;
        }

        const donationIds = donations.map((d) => d.id);
        const { totalDocs: reservedCount } = await payload.count({
          collection: "reservations",
          where: { donation: { in: donationIds.join(",") } },
        });

        counts[b.id] = donations.length - reservedCount;
      }),
    );

    const businessesWithCounts = businesses.map((b) => ({
      ...b,
      donationCount: counts[b.id],
    }));

    // Only filter to businesses with donations if hasDonations param is provided
    if (hasDonations) {
      return NextResponse.json(businessesWithCounts.filter((b) => b.donationCount > 0));
    }

    return NextResponse.json(businessesWithCounts);
  } catch (error) {
    return errorResponse(error);
  }
}
